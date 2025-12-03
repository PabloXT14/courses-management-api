import { drizzle } from 'drizzle-orm/node-postgres'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env is required.')
}

export const db = drizzle(process.env.DATABASE_URL, {
  logger: true // show SQL queries in console
})