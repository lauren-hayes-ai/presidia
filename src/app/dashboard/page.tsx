import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Sample briefings data (will be replaced with real data)
const briefings = [
  {
    id: "2026-02-09",
    date: "February 9, 2026",
    title: "Sunday Briefing",
    meetingCount: 6,
    status: "ready",
  },
  {
    id: "2026-02-08",
    date: "February 8, 2026", 
    title: "Saturday Briefing",
    meetingCount: 2,
    status: "ready",
  },
  {
    id: "2026-02-07",
    date: "February 7, 2026",
    title: "Friday Briefing", 
    meetingCount: 8,
    status: "ready",
  },
];

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-700">
        <Link href="/" className="text-2xl font-bold text-white">Presidia</Link>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Briefings</h1>
            <p className="text-slate-400 mt-1">Daily intelligence and meeting prep</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">
              All Briefings
            </button>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">
              My Meetings
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {briefings.map((briefing) => (
            <Link 
              key={briefing.id}
              href={`/briefings/${briefing.id}`}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 mb-1">{briefing.date}</div>
                  <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
                    {briefing.title}
                  </h2>
                  <div className="text-slate-400 mt-2">
                    {briefing.meetingCount} external meetings
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    {briefing.status}
                  </span>
                  <span className="text-slate-500 group-hover:text-slate-300 transition">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {briefings.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-white mb-2">No briefings yet</h2>
            <p className="text-slate-400">Your daily briefings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
