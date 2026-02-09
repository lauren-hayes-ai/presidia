import { db } from "./index";
import { eq, desc } from "drizzle-orm";
import * as schema from "./schema";

export function getBriefing(id: string) {
  return db.select().from(schema.briefings).where(eq(schema.briefings.id, id)).get();
}

export function getMeetingsForBriefing(briefingId: string) {
  return db
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
    .all();
}

export function getMeeting(meetingId: number) {
  return db
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
    .get();
}

export function getContact(contactId: number) {
  return db
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
    .get();
}

export function getMeetingsForContact(contactId: number) {
  return db
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
    .all();
}

export function getOrganization(orgId: number) {
  return db.select().from(schema.organizations).where(eq(schema.organizations.id, orgId)).get();
}

export function getContactsForOrganization(orgId: number) {
  return db.select().from(schema.contacts).where(eq(schema.contacts.organizationId, orgId)).all();
}

export function getLinksForContact(contactId: number) {
  return db.select().from(schema.contactLinks).where(eq(schema.contactLinks.contactId, contactId)).all();
}

export function getCareerForContact(contactId: number) {
  return db.select().from(schema.careerHistory).where(eq(schema.careerHistory.contactId, contactId)).all();
}

export function getNewsForContact(contactId: number) {
  return db.select().from(schema.contactNews).where(eq(schema.contactNews.contactId, contactId)).all();
}

export function getLifeEventsForContact(contactId: number) {
  return db.select().from(schema.contactLifeEvents).where(eq(schema.contactLifeEvents.contactId, contactId)).all();
}

export function getTimelineForContact(contactId: number) {
  return db.select().from(schema.contactTimeline).where(eq(schema.contactTimeline.contactId, contactId)).all();
}

export function getMeetingsForOrganization(orgId: number) {
  return db
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
    .all();
}
