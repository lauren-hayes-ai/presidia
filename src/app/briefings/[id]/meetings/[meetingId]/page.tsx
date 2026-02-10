"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState, use, useEffect } from "react";

type LinkData = {
  id: number;
  type: string;
  url: string;
  label: string | null;
};

type CareerEntry = {
  id: number;
  role: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  isCurrent: boolean | null;
  sourceUrl: string | null;
  source: string | null;
};

type NewsItem = {
  id: number;
  title: string;
  source: string | null;
  url: string | null;
  date: string;
  summary: string | null;
};

type LifeEvent = {
  id: number;
  event: string;
  date: string;
  description: string | null;
  sourceUrl: string | null;
  source: string | null;
};

type TimelineEntry = {
  id: number;
  type: string;
  title: string;
  description: string | null;
  date: string;
  direction: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  duration: string | null;
  channel: string | null;
};

type MeetingData = {
  id: number;
  briefingId: string;
  time: string;
  talkingPoints: string | null;
  recentNews: string | null;
  summary: string | null;
  context: string | null;
  notes: string | null;
  contactId: number;
  contactName: string;
  contactRole: string | null;
  contactImage: string | null;
  contactBio: string | null;
  contactLinkedin: string | null;
  organizationId: number | null;
  organizationName: string | null;
  organizationDescription: string | null;
  links: LinkData[];
  career: CareerEntry[];
  news: NewsItem[];
  lifeEvents: LifeEvent[];
  timeline: TimelineEntry[];
};

const linkIcons: Record<string, { label: string; icon: string }> = {
  linkedin: { label: "LinkedIn", icon: "in" },
  twitter: { label: "X / Twitter", icon: "𝕏" },
  instagram: { label: "Instagram", icon: "ig" },
  github: { label: "GitHub", icon: "gh" },
  website: { label: "Website", icon: "↗" },
  substack: { label: "Substack", icon: "✉" },
  ycombinator: { label: "Y Combinator", icon: "Y" },
};

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string; meetingId: string }> }) {
  const { id, meetingId } = use(params);
  const { user } = useUser();
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"briefing" | "context">("briefing");

  const [comments, setComments] = useState<Array<{
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    status: string;
    isAI?: boolean;
  }>>([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetch(`/api/meetings/${meetingId}`)
      .then((r) => r.json())
      .then((data) => { setMeeting(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [meetingId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-stone-800 font-serif">Meeting not found</h1>
          <Link href={`/briefings/${id}`} className="text-sm text-stone-400 hover:text-stone-600 mt-2 inline-block">
            &larr; Back to briefing
          </Link>
        </div>
      </div>
    );
  }

  const talkingPoints: string[] = meeting.talkingPoints ? JSON.parse(meeting.talkingPoints) : [];
  const notes: string[] = meeting.notes ? JSON.parse(meeting.notes) : [];

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href={`/briefings/${id}`} className="text-stone-400 hover:text-stone-600 transition text-sm">
            &larr; Back to timeline
          </Link>
          <span className="text-stone-200">|</span>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Presidia" width={28} height={28} />
            <span className="text-xl font-bold text-stone-800 font-serif tracking-tight">Presidia</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="flex">
        <div className="flex-1 max-w-3xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-start gap-5 mb-8">
            <img
              src={meeting.contactImage || ""}
              alt={meeting.contactName}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="text-xs text-stone-400 font-mono mb-1">{meeting.time}</div>
              <h1 className="text-2xl font-bold text-stone-800 font-serif tracking-tight">
                <Link href={`/contacts/${meeting.contactId}`} className="hover:text-stone-600 transition">
                  {meeting.contactName}
                </Link>
              </h1>
              <div className="text-stone-400 text-sm mt-0.5">
                {meeting.contactRole}
                {meeting.organizationId && (
                  <> @ <Link href={`/organizations/${meeting.organizationId}`} className="hover:text-stone-600 underline decoration-stone-200 underline-offset-2 transition">{meeting.organizationName}</Link></>
                )}
              </div>

              {/* Links inline with header */}
              {meeting.links.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {meeting.links.map((link) => {
                    const info = linkIcons[link.type];
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-stone-500 bg-stone-50 hover:bg-stone-100 hover:text-stone-700 transition"
                      >
                        {info && <span className="text-stone-400 text-[10px]">{info.icon}</span>}
                        {link.label || info?.label || link.type}
                        <span className="text-stone-300">↗</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {meeting.summary && (
            <div className="mb-10 bg-stone-50/80 rounded-xl px-6 py-5 border border-stone-100">
              <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-stone-700 text-sm leading-relaxed">{meeting.summary}</p>
            </div>
          )}

          {/* Meeting Context */}
          {meeting.context && (
            <div className="mb-10">
              <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2.5">Meeting Context</h2>
              <p className="text-stone-600 text-sm leading-relaxed">{meeting.context}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-0 mb-10 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("briefing")}
              className={`px-5 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === "briefing"
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              Briefing
            </button>
            <button
              onClick={() => setActiveTab("context")}
              className={`px-5 py-3 text-sm font-medium transition border-b-2 -mb-px flex items-center gap-1.5 ${
                activeTab === "context"
                  ? "text-stone-800 border-stone-800"
                  : "text-stone-400 border-transparent hover:text-stone-600"
              }`}
            >
              Context
              {meeting.timeline.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "context" ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-400"
                }`}>{meeting.timeline.length}</span>
              )}
            </button>
          </div>

          {/* Briefing Tab */}
          {activeTab === "briefing" && (
            <div className="space-y-12">
              {/* Talking Points */}
              {talkingPoints.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Suggested Talking Points</h2>
                  <ul className="space-y-3">
                    {talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-stone-700 text-sm leading-relaxed">
                        <span className="text-stone-300 mt-px select-none">&bull;</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Background */}
              {meeting.contactBio && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Background</h2>
                  <p className="text-stone-600 text-sm leading-relaxed">{meeting.contactBio}</p>
                </section>
              )}

              {/* Career History */}
              {meeting.career.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-5">Career</h2>
                  <div className="relative">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-stone-100" />
                    <div className="space-y-5">
                      {meeting.career.map((entry) => (
                        <div key={entry.id} className="flex gap-4 pl-0">
                          <div className="relative z-[1] mt-1.5 shrink-0">
                            <div className={`w-[7px] h-[7px] rounded-full ${entry.isCurrent ? 'bg-stone-800' : 'bg-stone-200'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-stone-800 text-sm font-medium">{entry.role}</span>
                              {entry.isCurrent && (
                                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">Current</span>
                              )}
                            </div>
                            <div className="text-stone-500 text-xs mt-0.5">{entry.company}</div>
                            <div className="text-stone-300 text-xs mt-0.5">
                              {entry.startDate}{entry.endDate && ` — ${entry.endDate}`}
                            </div>
                            {entry.description && (
                              <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                                {entry.description}
                                {entry.source && (
                                  <>
                                    {" "}
                                    {entry.sourceUrl ? (
                                      <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-stone-300 hover:text-stone-500 transition">
                                        via {entry.source} <span className="text-[9px]">↗</span>
                                      </a>
                                    ) : (
                                      <span className="text-stone-300">via {entry.source}</span>
                                    )}
                                  </>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Recent News & Activity */}
              {meeting.news.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Recent News & Activity</h2>
                  <div className="space-y-3">
                    {meeting.news.map((item) => (
                      <div key={item.id} className="border border-stone-100 rounded-lg px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-stone-800 text-sm font-medium hover:text-stone-600 transition inline-flex items-center gap-1.5">
                                {item.title}
                                <span className="text-stone-300 text-xs">↗</span>
                              </a>
                            ) : (
                              <div className="text-stone-800 text-sm font-medium">{item.title}</div>
                            )}
                            {item.summary && (
                              <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">{item.summary}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-stone-300 text-xs">{item.date}</div>
                            {item.source && (
                              item.url ? (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-600 text-[10px] uppercase tracking-wider mt-0.5 inline-block transition">
                                  {item.source}
                                </a>
                              ) : (
                                <div className="text-stone-400 text-[10px] uppercase tracking-wider mt-0.5">{item.source}</div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Life Events */}
              {meeting.lifeEvents.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Life Events</h2>
                  <div className="space-y-4">
                    {meeting.lifeEvents.map((event) => (
                      <div key={event.id} className="flex gap-5 items-start">
                        <div className="text-stone-300 text-xs font-mono w-20 shrink-0 mt-0.5 text-right">{event.date}</div>
                        <div className="flex-1">
                          <div className="text-stone-800 text-sm font-medium">{event.event}</div>
                          {event.description && (
                            <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                              {event.description}
                              {event.source && (
                                <>
                                  {" "}
                                  {event.sourceUrl ? (
                                    <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-stone-300 hover:text-stone-500 transition">
                                      via {event.source} <span className="text-[9px]">↗</span>
                                    </a>
                                  ) : (
                                    <span className="text-stone-300">via {event.source}</span>
                                  )}
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Other Notes */}
              {notes.length > 0 && (
                <section>
                  <h2 className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-4">Other Notes</h2>
                  <div className="bg-stone-50/60 rounded-xl border border-stone-100 px-5 py-4 space-y-3">
                    {notes.map((note, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-stone-600 text-sm leading-relaxed">
                        <span className="text-stone-300 mt-0.5 shrink-0 text-xs">--</span>
                        {note}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {meeting.contactLinkedin && (
                  <a
                    href={meeting.contactLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition"
                  >
                    View LinkedIn
                  </a>
                )}
                <button
                  onClick={() => {
                    setShowComments(true);
                    setNewComment("");
                  }}
                  className="px-4 py-2 bg-white text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition border border-gray-200"
                >
                  Dig Deeper
                </button>
              </div>
            </div>
          )}

          {/* Context Tab */}
          {activeTab === "context" && (
            <div>
              {meeting.timeline.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <p className="text-sm">No prior interactions found.</p>
                  <p className="text-xs mt-1">Connect Gmail and calendar to populate your relationship history.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-100" />
                  <div className="space-y-0">
                    {meeting.timeline.map((entry) => {
                      const typeConfig: Record<string, { badge: string; badgeClass: string; icon: string }> = {
                        email: { badge: entry.direction === "inbound" ? "Received" : "Sent", badgeClass: entry.direction === "inbound" ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-500", icon: "✉" },
                        call: { badge: "Call", badgeClass: "bg-blue-100 text-blue-600", icon: "📞" },
                        meeting: { badge: "Meeting", badgeClass: "bg-amber-100 text-amber-700", icon: "🤝" },
                        intro: { badge: "Intro", badgeClass: "bg-violet-100 text-violet-600", icon: "👋" },
                        note: { badge: "Note", badgeClass: "bg-stone-100 text-stone-500", icon: "📝" },
                      };
                      const config = typeConfig[entry.type] || typeConfig.note;
                      return (
                        <div key={entry.id} className="flex gap-4 pl-0 py-4 relative">
                          <div className="relative z-[1] shrink-0 w-[31px] flex items-start justify-center pt-0.5">
                            <span className="text-sm">{config.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${config.badgeClass}`}>
                                  {config.badge}
                                </span>
                                {entry.channel && (
                                  <span className="text-stone-300 text-[10px] uppercase tracking-wider">{entry.channel}</span>
                                )}
                                {entry.duration && (
                                  <span className="text-stone-300 text-[10px]">{entry.duration}</span>
                                )}
                              </div>
                              <span className="text-stone-300 text-xs shrink-0">{entry.date}</span>
                            </div>
                            <div className="text-stone-800 text-sm font-medium mb-1">{entry.title}</div>
                            {entry.type === "email" && entry.fromAddress && (
                              <div className="text-stone-400 text-xs mb-1">
                                {entry.direction === "inbound"
                                  ? <><span className="text-stone-500">{entry.fromAddress}</span> → you</>
                                  : <>you → <span className="text-stone-500">{entry.toAddress}</span></>
                                }
                              </div>
                            )}
                            {entry.description && (
                              <p className="text-stone-400 text-xs leading-relaxed">{entry.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-8 pt-4 border-t border-gray-100">
                <p className="text-xs text-stone-300 text-center">Synced from Gmail & Calendar &middot; Last updated Feb 9, 2026</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Dig Deeper Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowComments(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-stone-800 text-sm">Ask Lauren</h3>
                <p className="text-xs text-stone-400 mt-0.5">Request deeper research on {meeting.contactName}</p>
              </div>
              <button
                onClick={() => setShowComments(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition"
              >
                <span className="text-lg leading-none">&times;</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {comments.length === 0 && (
                <div className="text-center py-10 text-stone-400">
                  <div className="text-2xl mb-2">?</div>
                  <p className="text-sm font-medium text-stone-500">What do you want to know?</p>
                  <p className="text-xs mt-1">Lauren will research and get back to you.</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {[
                      `${meeting.contactName}'s investment thesis`,
                      "Mutual connections",
                      "Recent social media posts",
                      "Competitors to discuss",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setNewComment(suggestion);
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className={`p-4 rounded-xl ${
                  comment.isAI ? 'bg-stone-50 border border-stone-200' : 'bg-white border border-stone-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      comment.isAI ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {comment.avatar}
                    </div>
                    <span className="text-sm font-medium text-stone-700">{comment.user}</span>
                    {comment.isAI && (
                      <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded font-medium">AI</span>
                    )}
                    <span className="text-xs text-stone-300 ml-auto">{comment.time}</span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{comment.text}</p>
                  {comment.status === "pending" && !comment.isAI && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-stone-400">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                      Lauren is researching this...
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Ask anything about this person..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition"
                  autoFocus
                />
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm hover:bg-stone-800 transition font-medium"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
