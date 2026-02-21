import { mysqlTable, varchar, text, int, bigint, mysqlEnum, boolean, index } from 'drizzle-orm/mysql-core';

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  openId: varchar('open_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 512 }),
  role: mysqlEnum('role', ['admin', 'user']).notNull().default('user'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
});

// ─── Shared Collections ───────────────────────────────────────────────────────
export const sharedCollections = mysqlTable('shared_collections', {
  id: int('id').autoincrement().primaryKey(),
  ownerId: int('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  shareToken: varchar('share_token', { length: 64 }).unique(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
}, (t) => [
  index('idx_shared_collections_owner').on(t.ownerId),
  index('idx_shared_collections_token').on(t.shareToken),
]);

// ─── Collection Cards ─────────────────────────────────────────────────────────
export const collectionCards = mysqlTable('collection_cards', {
  id: int('id').autoincrement().primaryKey(),
  collectionId: int('collection_id').notNull().references(() => sharedCollections.id, { onDelete: 'cascade' }),
  cardId: varchar('card_id', { length: 64 }).notNull(),
  addedAt: bigint('added_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
}, (t) => [
  index('idx_collection_cards_collection').on(t.collectionId),
]);

// ─── Card Comments ────────────────────────────────────────────────────────────
export const cardComments = mysqlTable('card_comments', {
  id: int('id').autoincrement().primaryKey(),
  cardId: varchar('card_id', { length: 64 }).notNull(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
}, (t) => [
  index('idx_card_comments_card').on(t.cardId),
  index('idx_card_comments_user').on(t.userId),
]);

// ─── Collection Members (for team sharing) ────────────────────────────────────
export const collectionMembers = mysqlTable('collection_members', {
  id: int('id').autoincrement().primaryKey(),
  collectionId: int('collection_id').notNull().references(() => sharedCollections.id, { onDelete: 'cascade' }),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: mysqlEnum('role', ['owner', 'editor', 'viewer']).notNull().default('viewer'),
  joinedAt: bigint('joined_at', { mode: 'number' }).notNull().$defaultFn(() => Date.now()),
}, (t) => [
  index('idx_collection_members_collection').on(t.collectionId),
  index('idx_collection_members_user').on(t.userId),
]);

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SharedCollection = typeof sharedCollections.$inferSelect;
export type CardComment = typeof cardComments.$inferSelect;
export type CollectionMember = typeof collectionMembers.$inferSelect;
