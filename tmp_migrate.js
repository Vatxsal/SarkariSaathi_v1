const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const sql = fs.readFileSync('supabase/migrations/005_better_auth.sql', 'utf8');
    await client.query(sql);
    console.log('Migration 005_better_auth.sql applied successfully');

  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await client.end();
  }
}

migrate();
