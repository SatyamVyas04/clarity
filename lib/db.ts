import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

export const sql = neon(connectionString);

type SchemaState = {
  initialized: boolean;
  promise: Promise<void> | null;
};

const schemaState: SchemaState = {
  initialized: false,
  promise: null,
};

async function initializeSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      source_name TEXT,
      source_link TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS article_enhancements (
      slug TEXT PRIMARY KEY REFERENCES articles(slug) ON DELETE CASCADE,
      summary TEXT NOT NULL,
      key_takeaways JSONB NOT NULL,
      sections JSONB NOT NULL,
      sources JSONB NOT NULL,
      quiz_call_to_action TEXT NOT NULL DEFAULT '',
      generated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE article_enhancements
    ADD COLUMN IF NOT EXISTS quiz_call_to_action TEXT NOT NULL DEFAULT '';
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id BIGSERIAL PRIMARY KEY,
      article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option CHAR(1) NOT NULL,
      explanation TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      wallet_address TEXT PRIMARY KEY,
      total_coins INTEGER NOT NULL DEFAULT 0,
      total_quizzes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id BIGSERIAL PRIMARY KEY,
      wallet_address TEXT NOT NULL REFERENCES user_profiles(wallet_address) ON DELETE CASCADE,
      article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      coins_awarded INTEGER NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function ensureSchema() {
  if (schemaState.initialized) {
    return;
  }

  if (!schemaState.promise) {
    schemaState.promise = initializeSchema()
      .then(() => {
        schemaState.initialized = true;
      })
      .catch((error) => {
        schemaState.promise = null;
        throw error;
      });
  }

  await schemaState.promise;
}
