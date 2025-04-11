import {
    pgTable,
    uuid,
    boolean,
    integer,
    doublePrecision,
    timestamp,
    varchar
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull(),
  isSubscriptionActive: boolean('is_subscription_active').notNull().default(false),
  interestCount: integer('interest_count').notNull().default(0)
});

export const houses = pgTable('houses', {
  id: uuid('id').primaryKey(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  photoUrl: varchar('photo_url').notNull(),
  description: varchar('description').notNull(),
  phone: varchar('phone').notNull(),
  published: boolean('published').notNull().default(true),
  publishedBy: uuid('published_by').notNull().references(() => users.id)
});

export const interests = pgTable('interests', {
  id: uuid('id').primaryKey(),
  houseId: uuid('house_id').notNull().references(() => houses.id),
  createdAt: timestamp('created_at').notNull().defaultNow()
});
