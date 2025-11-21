import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  try {
    // Read the SQLite database schema and create tables in Turso
    const schema = `
-- Create JobPosting table
CREATE TABLE IF NOT EXISTS job_postings (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    salary TEXT NOT NULL,
    description TEXT,
    applicants INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS job_postings_status_idx ON job_postings(status);
CREATE INDEX IF NOT EXISTS job_postings_department_idx ON job_postings(department);

-- Create Candidate table
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS candidates_email_idx ON candidates(email);

-- Create Application table
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY NOT NULL,
    candidate_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW',
    applied_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS applications_candidate_id_idx ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS applications_job_id_idx ON applications(job_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);

-- Create Pipeline table
CREATE TABLE IF NOT EXISTS pipelines (
    id TEXT PRIMARY KEY NOT NULL,
    candidate_id TEXT NOT NULL,
    position TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'APPLIED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS pipelines_candidate_id_idx ON pipelines(candidate_id);
CREATE INDEX IF NOT EXISTS pipelines_stage_idx ON pipelines(stage);

-- Create Interview table
CREATE TABLE IF NOT EXISTS interviews (
    id TEXT PRIMARY KEY NOT NULL,
    candidate_id TEXT NOT NULL,
    position TEXT NOT NULL,
    date DATETIME NOT NULL,
    time TEXT NOT NULL,
    interviewer TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS interviews_candidate_id_idx ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS interviews_date_idx ON interviews(date);
CREATE INDEX IF NOT EXISTS interviews_status_idx ON interviews(status);

-- Create Offer table
CREATE TABLE IF NOT EXISTS offers (
    id TEXT PRIMARY KEY NOT NULL,
    candidate_id TEXT NOT NULL,
    position TEXT NOT NULL,
    salary TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS offers_candidate_id_idx ON offers(candidate_id);
CREATE INDEX IF NOT EXISTS offers_status_idx ON offers(status);
    `;

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
      console.log('Executed:', statement.substring(0, 50) + '...');
    }

    console.log('✅ Migration to Turso completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

migrate();
