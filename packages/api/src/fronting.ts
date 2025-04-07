import { Database } from 'bun:sqlite'

export const db = new Database('system.sqlite', { create: true })
db.exec(`
  create table if not exists alters (
    id text primary key,
    name text not null,
    pronouns text not null,
    role text not null,
    description text,
    avatar_url text
  );

  create table if not exists fronting (
    alter_id text not null,
    timestamp integer not null,
    primary key (alter_id, timestamp),
    foreign key (alter_id) references alters(id)
  );

  insert or ignore into alters (id, name, pronouns, role, description, avatar_url)
  values
    ('iris', 'iris', 'she/it', 'host', 'silly web developer & enjoyer of catppuccin', '/me.webp'),
    ('willow', 'willow', 'they/she', 'co-host', 'chasing mice!', '/willow.png');
`)

export interface Alter {
  id: string
  name: string
  pronouns: string
  role: string
  description: string | null
  avatar_url: string | null
}

export interface FrontingState {
  alters: Alter[]
  timestamp: number
}

export function getCurrentlyFronting(): FrontingState {
  const stmt = db.prepare(`
    select a.id, a.name, a.pronouns, a.role, a.description, a.avatar_url, f.timestamp
    from alters a
    join fronting f on a.id = f.alter_id
    order by f.timestamp desc
    limit 10
  `)

  const rows = stmt.all() as (Alter & { timestamp: number })[]

  if (rows.length === 0) {
    return { alters: [], timestamp: Date.now() }
  }

  return {
    alters: rows.map((row) => ({
      id: row.id,
      name: row.name,
      pronouns: row.pronouns,
      role: row.role,
      description: row.description,
      avatar_url: row.avatar_url,
    })),
    timestamp: rows[0].timestamp,
  }
}

export function getAllAlters(): Alter[] {
  const stmt = db.prepare('select * from alters')
  return stmt.all() as Alter[]
}

export function updateFronting(alterIds: string[]): FrontingState {
  const timestamp = Date.now()

  db.transaction(() => {
    db.prepare('delete from fronting').run()

    const insertStmt = db.prepare('insert into fronting (alter_id, timestamp) values (?, ?)')
    for (const id of alterIds) {
      insertStmt.run(id, timestamp)
    }
  })()

  return getCurrentlyFronting()
}
