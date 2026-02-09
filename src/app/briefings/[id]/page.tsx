"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

// Sample meeting data
const meetings = [
  {
    id: 1,
    time: "10:30 AM",
    name: "Brandon Frisch",
    company: "Begin Software",
    role: "Managing Director & Co-founder",
    image: "https://ui-avatars.com/api/?name=Brandon+Frisch&background=3b82f6&color=fff",
    bio: "Co-founder of Begin Software, a Denver-based software development team. Built dev teams for 50+ companies.",
    linkedin: "https://linkedin.com/in/brandonfrisch",
    talking_points: [
      "Ask about their team's experience with AI/agent tooling",
      "Explore potential development partnership",
      "Discuss their client base and ideal project types"
    ],
    recent_news: "Begin Software recently expanded to 40+ engineers",
  },
  {
    id: 2,
    time: "11:00 AM", 
    name: "Kate Simpson",
    company: "Gem Investments",
    role: "MD, Head of VC",
    image: "https://ui-avatars.com/api/?name=Kate+Simpson&background=8b5cf6&color=fff",
    bio: "24+ years in investment management. Leads VC initiatives at Gem's $12B OCIO platform.",
    linkedin: "https://linkedin.com/in/katesimpson",
    talking_points: [
      "Understand Gem's thesis on AI infrastructure",
      "Discuss their portfolio company needs",
      "Explore strategic partnership opportunities"
    ],
    recent_news: "Gem recently launched their private credit vertical",
  },
  {
    id: 3,
    time: "11:30 AM",
    name: "Hannah Corry",
    company: "Handle",
    role: "Co-founder",
    image: "https://ui-avatars.com/api/?name=Hannah+Corry&background=10b981&color=fff",
    bio: "YC-backed founder building construction finance and credit software.",
    linkedin: "https://linkedin.com/in/hannahcorry",
    talking_points: [
      "Learn about their integration needs",
      "Discuss construction industry pain points",
      "Explore how Anon could help their product"
    ],
    recent_news: "Handle closed YC funding round",
  },
];

export default function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(1);

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-700 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
            ← Back
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-2xl font-bold text-white">Presidia</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="text-slate-500 text-sm mb-2">February 9, 2026</div>
          <h1 className="text-4xl font-bold text-white mb-4">Sunday Briefing</h1>
          <div className="flex gap-4 text-slate-400">
            <span className="flex items-center gap-2">
              <span>📅</span> 6 meetings
            </span>
            <span className="flex items-center gap-2">
              <span>🏢</span> 6 companies
            </span>
            <span className="flex items-center gap-2">
              <span>👤</span> 6 people
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id}
              className={`bg-slate-800/50 border rounded-xl overflow-hidden transition-all ${
                expandedMeeting === meeting.id 
                  ? 'border-blue-500/50' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <button
                onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-500 font-mono text-sm w-20">
                    {meeting.time}
                  </div>
                  <img 
                    src={meeting.image} 
                    alt={meeting.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold">{meeting.name}</div>
                    <div className="text-slate-400 text-sm">
                      {meeting.role} @ {meeting.company}
                    </div>
                  </div>
                  <span className={`transition-transform ${expandedMeeting === meeting.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {expandedMeeting === meeting.id && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-700 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Background
                    </h3>
                    <p className="text-slate-300">{meeting.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Suggested Talking Points
                    </h3>
                    <ul className="space-y-2">
                      {meeting.talking_points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-blue-400">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Recent News
                    </h3>
                    <p className="text-slate-300">{meeting.recent_news}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a 
                      href={meeting.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      View LinkedIn
                    </a>
                    <button className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition">
                      Add Note
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
