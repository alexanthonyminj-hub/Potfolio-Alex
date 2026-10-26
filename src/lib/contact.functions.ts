import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(),
});

// In-memory sliding-window rate limiter: Max 5 submissions per IP per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  if (ip === "unknown") return true;
  const now = Date.now();
  const timestamps = ipSubmissions.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipSubmissions.set(ip, recent);
    return false;
  }
  recent.push(now);
  ipSubmissions.set(ip, recent);

  // Periodically clean up stale entries to prevent memory growth
  if (ipSubmissions.size > 1000) {
    for (const [key, list] of ipSubmissions.entries()) {
      const active = list.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        ipSubmissions.delete(key);
      } else {
        ipSubmissions.set(key, active);
      }
    }
  }
  return true;
}

function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // strip non-printable control characters
    .trim();
}

export const submitContactRequest = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Origin verification (logs warning only; does not break legitimate submissions)
    const origin = getRequestHeader("origin");
    const host = getRequestHeader("x-forwarded-host") || getRequestHeader("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host.toLowerCase();
        const serverHost = host.toLowerCase();
        if (
          originHost !== serverHost &&
          !originHost.includes("localhost") &&
          !originHost.endsWith(".vercel.app")
        ) {
          console.warn(`[Origin check] Info: origin=${originHost}, host=${serverHost}`);
        }
      } catch {
        // Ignore non-fatal origin header format issues
      }
    }

    // 2. Client IP rate limiting
    const rawIp =
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(rawIp)) {
      throw new Error("Too many requests from this address. Please wait a few minutes before trying again.");
    }

    // 3. Honeypot check (silent drop for automated bots)
    if (data.website) {
      return { received: true, emailSent: true };
    }

    // 4. Input sanitization
    const sanitizedName = sanitizeText(data.name);
    const sanitizedEmail = data.email.trim().toLowerCase();
    const sanitizedSubject = sanitizeText(data.subject);
    const sanitizedMessage = sanitizeText(data.message);

    if (!sanitizedName || !sanitizedSubject || !sanitizedMessage) {
      throw new Error("Please fill in all required fields.");
    }

    // 5. Automated link-spam heuristic: messages with > 3 URLs dropped silently
    const urlMatches = sanitizedMessage.match(/https?:\/\//gi);
    if (urlMatches && urlMatches.length > 3) {
      return { received: true, emailSent: false };
    }

    // 6. Save contact request to SQL Database before attempting email notification
    try {
      const { insertContactSubmission } = await import("@/lib/db.server");
      await insertContactSubmission({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
      });
    } catch (err) {
      console.error("[Database] Failed to insert contact submission:", err);
      throw new Error("Your request could not be saved. Please try again.");
    }

    // 7. Dispatch email notification strictly on the server with timeout protection
    const gmailAppPassword = process.env["GMAIL_APP_PASSWORD"];
    const gmailUser = process.env["GMAIL_USER"] || "alexanthonyminj@gmail.com";
    const web3FormsKey = process.env["WEB3FORMS_ACCESS_KEY"];
    let emailSent = false;

    // A. Direct Gmail SMTP via Google App Password
    if (gmailAppPassword) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailAppPassword.replace(/\s+/g, ""),
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${gmailUser}>`,
          to: gmailUser,
          replyTo: sanitizedEmail,
          subject: `[Portfolio Inquiry] ${sanitizedSubject} - from ${sanitizedName}`,
          text: `You received a new message from your portfolio contact form:\n\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nSubject: ${sanitizedSubject}\n\nMessage:\n${sanitizedMessage}\n\n---\nReply directly to this email to respond to ${sanitizedName}.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #3B82F6; margin-top: 0;">New Portfolio Inquiry</h2>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
              <p><strong>Subject:</strong> ${sanitizedSubject}</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 6px;">${sanitizedMessage}</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #888;">You can click Reply in your email client to respond directly to ${sanitizedEmail}.</p>
            </div>
          `,
        });

        emailSent = true;
      } catch (err) {
        console.error("Direct Gmail SMTP delivery failed:", err);
        emailSent = false;
      }
    } else if (web3FormsKey) {
      // B. Web3Forms relay fallback
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: sanitizedName,
            email: sanitizedEmail,
            replyto: sanitizedEmail,
            subject: `Portfolio enquiry: ${sanitizedSubject}`,
            message: sanitizedMessage,
            from_name: "Alex Anthony Minj portfolio contact form",
          }),
        });

        const delivery: unknown = await response.json();
        emailSent =
          response.ok &&
          typeof delivery === "object" &&
          delivery !== null &&
          "success" in delivery &&
          delivery.success === true;
      } catch {
        emailSent = false;
      }
    }

    return {
      received: true,
      emailSent,
    };
  });