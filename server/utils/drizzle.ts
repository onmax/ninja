import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export type Chunk = typeof schema.chunks.$inferSelect
export type NewChunk = Omit<Chunk, 'id' | 'embedding' | 'postRecordId'>

export type PostRecord = typeof schema.postRecord.$inferSelect
export type NewPostRecord = Omit<PostRecord, 'id'>
