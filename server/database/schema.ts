import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

type Headers = [string] | [string, string] | [string, string, string] | [string, string, string, string]

export const postRecord = sqliteTable('post_records', {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().notNull().unique(),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  modifiedAt: integer('modified_at', { mode: 'timestamp' }),
  scrappedAt: integer('scrapped_at', { mode: 'timestamp' }).notNull(),
})

export const chunks = sqliteTable('chunks', {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  postRecordId: integer('post_record_id').notNull().references(() => postRecord.id, { onDelete: 'cascade' }),
  content: text().notNull(),
  embedding: text({ mode: 'json' }).$type<number[]>(),
  headers: text({ mode: 'json' }).$type<Headers>(),
  hash: text(),
}, (table) => {
  return {
    nameIdx: uniqueIndex('hash_index').on(table.hash),
  }
})
