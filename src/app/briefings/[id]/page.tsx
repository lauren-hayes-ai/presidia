"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Sample meeting data
const meetings = [
  {
    id: 1,
    time: "10:30 AM",
    name: "Brandon Frisch",
    company: "Begin Software",
    role: "Managing Director & Co-founder",
    image: "https://ui-avatars.com/api/?name=Brandon+Frisch&background=166534&color=fff",
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
    image: "https://ui-avatars.com/api/?name=Kate+Simpson&background=166534&color=fff",
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
    image: "https://ui-avatars.com/api/?name=Hannah+Corry&background=166534&color=fff",
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

// Sample comments
const sampleComments = [
  {
    id: 1,
    user: "Daniel Mason",
    avatar: "DM",
    text: "Can you dig deeper on Gem's portfolio companies? I want to know which ones might need our product.",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    user: "Lauren Hayes",
    avatar: "LH",
    text: "Updated with 5 portfolio companies that are likely fits. See the expanded section on Kate Simpson.",
    time: "1 hour ago",
    status: "resolved",
    isAI: true,
  },
];

export default function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useUser();
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(1);
  const [comments, setComments] = useState(sampleComments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: comments.length + 1,
      user: user?.fullName || "You",
      avatar: user?.firstName?.[0] || "U",
      text: newComment,
      time: "Just now",
      status: "pending" as const,
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-stone-400 hover:text-green-700 transition">
            ← Back
          </Link>
          <span className="text-stone-300">|</span>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Presidia" width={28} height={28} />
            <span className="text-xl font-bold text-green-900 font-serif">Presidia</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition border ${
              showComments 
                ? 'bg-green-700 text-white border-green-700' 
                : 'bg-white text-stone-600 border-stone-200 hover:border-green-300'
            }`}
          >
            💬 {comments.length}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex">
        <div className={`flex-1 max-w-4xl mx-auto px-8 py-12 transition-all ${showComments ? 'mr-80' : ''}`}>
          <div className="mb-8">
            <div className="text-stone-400 text-sm mb-2">February 9, 2026</div>
            <h1 className="text-4xl font-bold text-green-900 mb-4 font-serif">Sunday Briefing</h1>
            <div className="flex gap-4 text-stone-500">
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
                className={`bg-white border rounded-xl overflow-hidden transition-all shadow-sm ${
                  expandedMeeting === meeting.id 
                    ? 'border-green-300 shadow-md' 
                    : 'border-stone-200 hover:border-green-200'
                }`}
              >
                <button
                  onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-stone-400 font-mono text-sm w-20">
                      {meeting.time}
                    </div>
                    <img 
                      src={meeting.image} 
                      alt={meeting.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-green-900 font-semibold">{meeting.name}</div>
                      <div className="text-stone-500 text-sm">
                        {meeting.role} @ {meeting.company}
                      </div>
                    </div>
                    <span className={`text-stone-400 transition-transform ${expandedMeeting === meeting.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedMeeting === meeting.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-stone-100 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Background
                      </h3>
                      <p className="text-stone-700">{meeting.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Suggested Talking Points
                      </h3>
                      <ul className="space-y-2">
                        {meeting.talking_points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-stone-700">
                            <span className="text-green-600">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Recent News
                      </h3>
                      <p className="text-stone-700">{meeting.recent_news}</p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <a 
                        href={meeting.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition"
                      >
                        View LinkedIn
                      </a>
                      <button 
                        onClick={() => {
                          setShowComments(true);
                          setNewComment(`Tell me more about ${meeting.name}'s `);
                        }}
                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 transition border border-stone-200"
                      >
                        🔍 Dig Deeper
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className={`fixed right-0 top-[65px] bottom-0 w-80 bg-white border-l border-stone-200 transform transition-transform shadow-lg ${
          showComments ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-stone-200">
              <h3 className="font-semibold text-green-900">Comments & Requests</h3>
              <p className="text-sm text-stone-500">Ask for more info or deeper research</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className={`p-3 rounded-lg ${
                  comment.isAI ? 'bg-green-50 border border-green-200' : 'bg-stone-50 border border-stone-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      comment.isAI ? 'bg-green-700 text-white' : 'bg-stone-300 text-stone-600'
                    }`}>
                      {comment.avatar}
                    </div>
                    <span className="text-sm font-medium text-stone-800">{comment.user}</span>
                    {comment.isAI && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">AI</span>
                    )}
                    <span className="text-xs text-stone-400 ml-auto">{comment.time}</span>
                  </div>
                  <p className="text-sm text-stone-700">{comment.text}</p>
                  {comment.status === "pending" && !comment.isAI && (
                    <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      ⏳ Lauren is working on this...
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Ask for more info..."
                  className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <button 
                  onClick={handleAddComment}
                  className="px-3 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
