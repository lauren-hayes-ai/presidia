import { db, schema, isPostgres } from "./index";
import { eq } from "drizzle-orm";

// Helpers to normalise SQLite sync (.get/.all) vs Postgres async (await)
async function getOne(query: any) {
  if (isPostgres) {
    const rows = await query;
    return rows[0] ?? undefined;
  }
  return query.get();
}
async function getAll(query: any) {
  if (isPostgres) return query;
  return query.all();
}

export async function getBriefing(id: string) {
  return getOne(
    db.select().from(schema.briefings).where(eq(schema.briefings.id, id))
  );
}

export async function getMeetingsForBriefing(briefingId: string) {
  return getAll(
    db
      .select({
        id: schema.meetings.id,
        time: schema.meetings.time,
        hour: schema.meetings.hour,
        talkingPoints: schema.meetings.talkingPoints,
        recentNews: schema.meetings.recentNews,
        contactId: schema.contacts.id,
        contactName: schema.contacts.name,
        contactRole: schema.contacts.role,
        contactImage: schema.contacts.imageUrl,
        contactBio: schema.contacts.bio,
        contactLinkedin: schema.contacts.linkedinUrl,
        organizationId: schema.organizations.id,
        organizationName: schema.organizations.name,
      })
      .from(schema.meetings)
      .innerJoin(schema.contacts, eq(schema.meetings.contactId, schema.contacts.id))
      .leftJoin(schema.organizations, eq(schema.contacts.organizationId, schema.organizations.id))
      .where(eq(schema.meetings.briefingId, briefingId))
      .orderBy(schema.meetings.hour)
  );
}

export async function getMeeting(meetingId: number) {
  return getOne(
    db
      .select({
        id: schema.meetings.id,
        briefingId: schema.meetings.briefingId,
        time: schema.meetings.time,
        hour: schema.meetings.hour,
        talkingPoints: schema.meetings.talkingPoints,
        recentNews: schema.meetings.recentNews,
        summary: schema.meetings.summary,
        context: schema.meetings.context,
        notes: schema.meetings.notes,
        contactId: schema.contacts.id,
        contactName: schema.contacts.name,
        contactRole: schema.contacts.role,
        contactImage: schema.contacts.imageUrl,
        contactBio: schema.contacts.bio,
        contactLinkedin: schema.contacts.linkedinUrl,
        organizationId: schema.organizations.id,
        organizationName: schema.organizations.name,
        organizationDescription: schema.organizations.description,
      })
      .from(schema.meetings)
      .innerJoin(schema.contacts, eq(schema.meetings.contactId, schema.contacts.id))
      .leftJoin(schema.organizations, eq(schema.contacts.organizationId, schema.organizations.id))
      .where(eq(schema.meetings.id, meetingId))
  );
}

export async function getContact(contactId: number) {
  return getOne(
    db
      .select({
        id: schema.contacts.id,
        name: schema.contacts.name,
        role: schema.contacts.role,
        imageUrl: schema.contacts.imageUrl,
        bio: schema.contacts.bio,
        linkedinUrl: schema.contacts.linkedinUrl,
        organizationId: schema.organizations.id,
        organizationName: schema.organizations.name,
      })
      .from(schema.contacts)
      .leftJoin(schema.organizations, eq(schema.contacts.organizationId, schema.organizations.id))
      .where(eq(schema.contacts.id, contactId))
  );
}

export async function getMeetingsForContact(contactId: number) {
  return getAll(
    db
      .select({
        id: schema.meetings.id,
        briefingId: schema.meetings.briefingId,
        time: schema.meetings.time,
        hour: schema.meetings.hour,
        talkingPoints: schema.meetings.talkingPoints,
        recentNews: schema.meetings.recentNews,
        briefingDate: schema.briefings.date,
        briefingTitle: schema.briefings.title,
      })
      .from(schema.meetings)
      .innerJoin(schema.briefings, eq(schema.meetings.briefingId, schema.briefings.id))
      .where(eq(schema.meetings.contactId, contactId))
      .orderBy(schema.briefings.id)
  );
}

export async function getOrganization(orgId: number) {
  return getOne(
    db.select().from(schema.organizations).where(eq(schema.organizations.id, orgId))
  );
}

export async function getContactsForOrganization(orgId: number) {
  return getAll(
    db.select().from(schema.contacts).where(eq(schema.contacts.organizationId, orgId))
  );
}

export async function getLinksForContact(contactId: number) {
  return getAll(
    db.select().from(schema.contactLinks).where(eq(schema.contactLinks.contactId, contactId))
  );
}

export async function getCareerForContact(contactId: number) {
  return getAll(
    db.select().from(schema.careerHistory).where(eq(schema.careerHistory.contactId, contactId))
  );
}

export async function getNewsForContact(contactId: number) {
  return getAll(
    db.select().from(schema.contactNews).where(eq(schema.contactNews.contactId, contactId))
  );
}

export async function getLifeEventsForContact(contactId: number) {
  return getAll(
    db.select().from(schema.contactLifeEvents).where(eq(schema.contactLifeEvents.contactId, contactId))
  );
}

export async function getTimelineForContact(contactId: number) {
  return getAll(
    db.select().from(schema.contactTimeline).where(eq(schema.contactTimeline.contactId, contactId))
  );
}

export async function getMeetingsForOrganization(orgId: number) {
  return getAll(
    db
      .select({
        id: schema.meetings.id,
        briefingId: schema.meetings.briefingId,
        time: schema.meetings.time,
        hour: schema.meetings.hour,
        contactName: schema.contacts.name,
        contactId: schema.contacts.id,
        contactImage: schema.contacts.imageUrl,
        briefingDate: schema.briefings.date,
      })
      .from(schema.meetings)
      .innerJoin(schema.contacts, eq(schema.meetings.contactId, schema.contacts.id))
      .innerJoin(schema.briefings, eq(schema.meetings.briefingId, schema.briefings.id))
      .where(eq(schema.contacts.organizationId, orgId))
      .orderBy(schema.briefings.id)
  );
}
