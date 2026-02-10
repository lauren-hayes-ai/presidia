import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getBriefing, getMeetingsForBriefing } from "@/db/queries";
import { notFound } from "next/navigation";

const lifestyleMoments = [
  { hour: 7, time: "7:00 AM", emoji: "🌅", label: "Rise and shine", sublabel: "A new day of meetings ahead" },
  { hour: 7.5, time: "7:30 AM", emoji: "☕", label: "Morning coffee", sublabel: "Review your briefings" },
  { hour: 12, time: "12:00 PM", emoji: "🍽️", label: "Lunch break", sublabel: "Recharge for the afternoon" },
  { hour: 17, time: "5:00 PM", emoji: "🌇", label: "Wind down", sublabel: "Wrap up and reflect" },
  { hour: 22, time: "10:00 PM", emoji: "🌙", label: "Rest up", sublabel: "Tomorrow's another big day" },
];

type MeetingRow = Awaited<ReturnType<typeof getMeetingsForBriefing>>[number];

type TimelineItem =
  | { type: "lifestyle"; hour: number; time: string; emoji: string; label: string; sublabel: string }
  | { type: "meeting"; hour: number; time: string; meeting: MeetingRow };

function buildTimeline(meetings: MeetingRow[]) {
  const items: TimelineItem[] = [];

  for (const m of lifestyleMoments) {
    items.push({ type: "lifestyle", ...m });
  }

  for (const m of meetings) {
    items.push({ type: "meeting", hour: m.hour, time: m.time, meeting: m });
  }

  items.sort((a, b) => a.hour - b.hour);
  return items;
}

export default async function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const briefing = await getBriefing(id);
  if (!briefing) notFound();

  const meetings = await getMeetingsForBriefing(id);
  const timeline = buildTimeline(meetings);

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-stone-400 hover:text-stone-600 transition text-sm">
            &larr; Back
          </Link>
          <span className="text-stone-200">|</span>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Presidia" width={28} height={28} />
            <span className="text-xl font-bold text-stone-800 font-serif tracking-tight">Presidia</span>
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-10">
          <div className="text-stone-400 text-xs mb-2 tracking-wide uppercase">{briefing.date}</div>
          <h1 className="text-3xl font-bold text-stone-800 font-serif tracking-tight">Your Day</h1>
        </div>

        <div className="relative">
          <div className="absolute left-[71px] top-2 bottom-2 w-px bg-gray-100" />

          <div className="space-y-1">
            {timeline.map((item, i) => {
              if (item.type === "lifestyle") {
                return (
                  <div key={`lifestyle-${i}`} className="flex items-center gap-6 py-4">
                    <div className="w-[52px] text-right text-xs text-stone-300 font-mono shrink-0">
                      {item.time}
                    </div>
                    <div className="w-[7px] h-[7px] rounded-full bg-gray-200 shrink-0 relative z-[1]" />
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.emoji}</span>
                      <div>
                        <div className="text-sm text-stone-400 italic">{item.label}</div>
                        <div className="text-xs text-stone-300">{item.sublabel}</div>
                      </div>
                    </div>
                  </div>
                );
              }

              const m = item.meeting;
              return (
                <Link
                  key={`meeting-${m.id}`}
                  href={`/briefings/${id}/meetings/${m.id}`}
                  className="flex items-center gap-6 py-3 group"
                >
                  <div className="w-[52px] text-right text-xs text-stone-400 font-mono shrink-0 group-hover:text-stone-600 transition">
                    {m.time}
                  </div>
                  <div className="w-[7px] h-[7px] rounded-full bg-stone-400 shrink-0 relative z-[1] group-hover:bg-stone-600 transition" />
                  <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-lg px-4 py-3 group-hover:border-gray-200 group-hover:shadow-sm transition">
                    <img
                      src={m.contactImage || ""}
                      alt={m.contactName}
                      className="w-9 h-9 rounded-full shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-stone-800 text-sm font-medium">{m.contactName}</div>
                      <div className="text-stone-400 text-xs truncate">{m.contactRole} @ {m.organizationName}</div>
                    </div>
                    <span className="text-stone-300 group-hover:text-stone-400 transition text-sm">&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
