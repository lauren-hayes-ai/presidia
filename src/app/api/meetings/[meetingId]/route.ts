import { getMeeting, getLinksForContact, getCareerForContact, getNewsForContact, getLifeEventsForContact, getTimelineForContact } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  const meeting = await getMeeting(Number(meetingId));
  if (!meeting) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contactId = meeting.contactId;
  const [links, career, news, lifeEvents, timeline] = await Promise.all([
    getLinksForContact(contactId),
    getCareerForContact(contactId),
    getNewsForContact(contactId),
    getLifeEventsForContact(contactId),
    getTimelineForContact(contactId),
  ]);

  return NextResponse.json({ ...meeting, links, career, news, lifeEvents, timeline });
}
