import postgres, { type Sql } from "postgres";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// In-memory fallback for local development when DATABASE_URL is not yet set
const localFallbackSubmissions: ContactSubmission[] = [
  {
    id: "demo-1",
    name: "Aman Sharma",
    email: "aman@digicrow.media",
    subject: "Podcast Editing & Sound Design Collaboration",
    message: "Hi Alex! Love your work on the Digicrow podcast series. We have a new 12-episode visual podcast production starting next month and would love to bring you on for editing and motion graphics idents.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "demo-2",
    name: "Priya Nair",
    email: "priya@cyberpeace.net",
    subject: "New Cyber Awareness Campaign Video",
    message: "Hey Alex, following up on our previous project. We are planning a 60-second animated explainer for our upcoming national safety summit. Let us know your availability!",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let _sql: Sql | null = null;
let _tableInitialized = false;

export function isRenderDbConfigured(): boolean {
  return Boolean(process.env["DATABASE_URL"] && process.env["DATABASE_URL"].trim().length > 0);
}

function getSql(): Sql | null {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) return null;

  if (!_sql) {
    // Render PostgreSQL requires SSL when connecting from external providers like Vercel
    const isSsl = connectionString.includes("sslmode=require") || !connectionString.includes("localhost");
    _sql = postgres(connectionString, {
      ssl: isSsl ? { rejectUnauthorized: false } : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return _sql;
}

async function ensureTableExists(sql: Sql) {
  if (_tableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;
    // Ensure is_read column exists if table was created by older migrations
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'contact_submissions' AND column_name = 'is_read'
        ) THEN
          ALTER TABLE contact_submissions ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;
    `;
    _tableInitialized = true;
  } catch (error) {
    console.error("[Database] Error ensuring contact_submissions table exists:", error);
  }
}

export async function insertContactSubmission(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactSubmission> {
  const sql = getSql();

  if (sql) {
    try {
      await ensureTableExists(sql);
      const rows = await sql<ContactSubmission[]>`
        INSERT INTO contact_submissions (name, email, subject, message, is_read)
        VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message}, false)
        RETURNING id, name, email, subject, message, is_read, created_at::text as created_at
      `;
      if (rows && rows[0]) {
        return rows[0];
      }
    } catch (err) {
      console.error("[Database] PostgreSQL insert error (falling back to memory):", err);
    }
  }

  // Fallback to local memory when DATABASE_URL is not provided or if database is temporarily unreachable
  const newSubmission: ContactSubmission = {
    id: `local-${Date.now()}`,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  localFallbackSubmissions.unshift(newSubmission);
  return newSubmission;
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const sql = getSql();

  if (sql) {
    try {
      await ensureTableExists(sql);
      const rows = await sql<ContactSubmission[]>`
        SELECT 
          id::text, 
          name, 
          email, 
          subject, 
          message, 
          COALESCE(is_read, false) as is_read, 
          created_at::text as created_at
        FROM contact_submissions
        ORDER BY created_at DESC
      `;
      return rows;
    } catch (err) {
      console.error("[Database] PostgreSQL fetch error (falling back to memory):", err);
    }
  }

  return [...localFallbackSubmissions];
}

export async function updateSubmissionReadStatus(id: string, is_read: boolean): Promise<boolean> {
  const sql = getSql();

  if (sql) {
    await ensureTableExists(sql);
    await sql`
      UPDATE contact_submissions
      SET is_read = ${is_read}
      WHERE id = ${id}::uuid
    `;
    return true;
  }

  const item = localFallbackSubmissions.find((s) => s.id === id);
  if (item) {
    item.is_read = is_read;
    return true;
  }
  return false;
}

export async function deleteContactSubmissionById(id: string): Promise<boolean> {
  const sql = getSql();

  if (sql) {
    await ensureTableExists(sql);
    await sql`
      DELETE FROM contact_submissions
      WHERE id = ${id}::uuid
    `;
    return true;
  }

  const index = localFallbackSubmissions.findIndex((s) => s.id === id);
  if (index !== -1) {
    localFallbackSubmissions.splice(index, 1);
    return true;
  }
  return false;
}
