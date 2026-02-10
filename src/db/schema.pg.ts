import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  organizationId: integer("organization_id").references(() => organizations.id),
  imageUrl: text("image_url"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
});

export const contactLinks = pgTable("contact_links", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  label: text("label"),
});

export const careerHistory = pgTable("career_history", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  description: text("description"),
  isCurrent: boolean("is_current").default(false),
  sourceUrl: text("source_url"),
  source: text("source"),
});

export const contactNews = pgTable("contact_news", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  title: text("title").notNull(),
  source: text("source"),
  url: text("url"),
  date: text("date").notNull(),
  summary: text("summary"),
});

export const contactLifeEvents = pgTable("contact_life_events", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  event: text("event").notNull(),
  date: text("date").notNull(),
  description: text("description"),
  sourceUrl: text("source_url"),
  source: text("source"),
});

export const briefings = pgTable("briefings", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  briefingId: text("briefing_id").references(() => briefings.id).notNull(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  time: text("time").notNull(),
  hour: real("hour").notNull(),
  talkingPoints: text("talking_points"),
  recentNews: text("recent_news"),
  summary: text("summary"),
  context: text("context"),
  notes: text("notes"),
});

export const contactTimeline = pgTable("contact_timeline", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  direction: text("direction"),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  duration: text("duration"),
  channel: text("channel"),
});
