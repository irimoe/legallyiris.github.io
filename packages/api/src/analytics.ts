import { Database } from 'bun:sqlite'
import Elysia from 'elysia'

export const db = new Database('analytics.sqlite', { create: true })
db.exec(`
	create table if not exists path_hits (
		path text primary key,
		hits integer default 1
	);
	create table if not exists daily_uniques (
		path text not null,
		hashed_ip text not null,
		date text not null,
		primary key (path, hashed_ip, date)
	);
`)

const incrementHitStmt = db.prepare(
  'insert into path_hits (path) values (?) on conflict(path) do update set hits = hits + 1',
)
const recordUniqueStmt = db.prepare(
  'insert or ignore into daily_uniques (path, hashed_ip, date) values (?, ?, ?)',
)

export function recordVisit(path: string, ip: string | null | undefined) {
  try {
    if (
      !ip ||
      ip === 'unknown' ||
      path === '/' ||
      path.startsWith('/api/assets/') ||
      path.startsWith('/assets/') ||
      path.endsWith('.webp') ||
      path === '/favicon.ico' ||
      path === '/api/analytics'
    )
      return

    const hashedIp = Bun.hash.wyhash(ip).toString(16)
    const today = new Date().toISOString().split('T')[0]

    console.log(`logging visit: ${path} - ip_hash: ${hashedIp.substring(0, 6)}...`)

    db.transaction(() => {
      incrementHitStmt.run(path)
      recordUniqueStmt.run(path, hashedIp, today)
    })()
  } catch (error) {
    console.error(`analytics error for path ${path}:`, error)
  }
}
