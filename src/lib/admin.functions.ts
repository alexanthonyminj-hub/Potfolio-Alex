import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "crypto";

function getAdminSecret(): string {
  return process.env["ADMIN_PASSWORD"] || "alexadmin2026";
}

function generateToken(): string {
  const secret = getAdminSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestampStr, providedSig] = parts;
  const timestamp = Number(timestampStr);
  if (isNaN(timestamp)) return false;

  // Token valid for 7 days
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > SEVEN_DAYS_MS || timestamp > Date.now() + 60000) {
    return false;
  }

  const secret = getAdminSecret();
  const expectedSig = crypto.createHmac("sha256", secret).update(timestampStr).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig));
}

// 1. Admin Login Function
export const adminLoginRequest = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ password: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const correctPassword = getAdminSecret();
    if (data.password !== correctPassword) {
      throw new Error("Invalid admin password. Please try again.");
    }
    return {
      success: true,
      token: generateToken(),
    };
  });

// 2. Fetch Admin Dashboard Data Function
export const getAdminDashboardData = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidToken(data.token)) {
      throw new Error("Unauthorized. Please log in to access the admin panel.");
    }

    const { getAllContactSubmissions, isRenderDbConfigured } = await import("./db.server");
    const submissions = await getAllContactSubmissions();

    const now = Date.now();
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    const totalCount = submissions.length;
    const unreadCount = submissions.filter((s) => !s.is_read).length;
    const todayCount = submissions.filter((s) => {
      const created = new Date(s.created_at).getTime();
      return now - created <= TWENTY_FOUR_HOURS_MS;
    }).length;

    return {
      totalCount,
      unreadCount,
      todayCount,
      isDbConnected: isRenderDbConfigured(),
      submissions,
    };
  });

// 3. Toggle Read/Unread Status Function
export const toggleSubmissionReadRequest = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string(), id: z.string(), is_read: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidToken(data.token)) {
      throw new Error("Unauthorized.");
    }

    const { updateSubmissionReadStatus } = await import("./db.server");
    const updated = await updateSubmissionReadStatus(data.id, data.is_read);
    return { success: updated };
  });

// 4. Delete Submission Function
export const deleteSubmissionRequest = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string(), id: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidToken(data.token)) {
      throw new Error("Unauthorized.");
    }

    const { deleteContactSubmissionById } = await import("./db.server");
    const deleted = await deleteContactSubmissionById(data.id);
    return { success: deleted };
  });
