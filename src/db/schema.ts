import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable("organizations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role"),
  organizationId: integer("organization_id").references(() => organizations.id),
  imageUrl: text("image_url"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
});

export const contactLinks = sqliteTable("contact_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  type: text("type").notNull(), // linkedin, twitter, instagram, website, github, substack, etc.
  url: text("url").notNull(),
  label: text("label"), // display label override
});

export const careerHistory = sqliteTable("career_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  startDate: text("start_date"), // "2022" or "Jan 2022"
  endDate: text("end_date"), // "Present" or "2024"
  description: text("description"),
  isCurrent: integer("is_current", { mode: "boolean" }).default(false),
  sourceUrl: text("source_url"),
  source: text("source"), // "LinkedIn", "Crunchbase", etc.
});

export const contactNews = sqliteTable("contact_news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  title: text("title").notNull(),
  source: text("source"), // "LinkedIn", "TechCrunch", "X", etc.
  url: text("url"),
  date: text("date").notNull(), // "Feb 5, 2026"
  summary: text("summary"),
});

export const contactLifeEvents = sqliteTable("contact_life_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  event: text("event").notNull(),
  date: text("date").notNull(),
  description: text("description"),
  sourceUrl: text("source_url"),
  source: text("source"),
});

export const briefings = sqliteTable("briefings", {
  id: text("id").primaryKey(), // e.g. "2026-02-09"
  date: text("date").notNull(), // "Sunday, February 9, 2026"
  title: text("title").notNull(),
});

export const meetings = sqliteTable("meetings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  briefingId: text("briefing_id").references(() => briefings.id).notNull(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  time: text("time").notNull(), // "10:30 AM"
  hour: real("hour").notNull(), // 10.5 for sorting
  talkingPoints: text("talking_points"), // JSON array
  recentNews: text("recent_news"),
  summary: text("summary"), // executive summary of the person + meeting context
  context: text("context"), // how you know them, intro context, previous interactions
  notes: text("notes"), // JSON array of additional agent notes
});

export const contactTimeline = sqliteTable("contact_timeline", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  type: text("type").notNull(), // "email", "call", "meeting", "intro", "note"
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  direction: text("direction"), // "inbound" or "outbound" (for emails)
  fromAddress: text("from_address"), // for emails
  toAddress: text("to_address"), // for emails
  duration: text("duration"), // for calls/meetings, e.g. "15 min"
  channel: text("channel"), // "gmail", "zoom", "in-person", "linkedin", "phone"
});
