import { getMeeting, getLinksForContact, getCareerForContact, getNewsForContact, getLifeEventsForContact, getTimelineForContact } from "@/db/queries";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const { meetingId } = await params;
  const meeting = getMeeting(Number(meetingId));
  if (!meeting) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contactId = meeting.contactId;
  const links = getLinksForContact(contactId);
  const career = getCareerForContact(contactId);
  const news = getNewsForContact(contactId);
  const lifeEvents = getLifeEventsForContact(contactId);
  const timeline = getTimelineForContact(contactId);

  return NextResponse.json({ ...meeting, links, career, news, lifeEvents, timeline });
}
