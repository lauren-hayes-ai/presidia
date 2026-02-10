import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getContact, getMeetingsForContact, getLinksForContact, getCareerForContact, getNewsForContact, getLifeEventsForContact } from "@/db/queries";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/BackButton";

const linkIcons: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  instagram: "Instagram",
  github: "GitHub",
  website: "Website",
  substack: "Substack",
  ycombinator: "Y Combinator",
};

export default async function ContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getContact(Number(id));
  if (!contact) notFound();

  const [meetings, links, career, news, lifeEvents]: any[] = await Promise.all([
    getMeetingsForContact(Number(id)),
    getLinksForContact(Number(id)),
    getCareerForContact(Number(id)),
    getNewsForContact(Number(id)),
    getLifeEventsForContact(Number(id)),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <BackButton />
          <span className="text-stone-200">|</span>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Presidia" width={28} height={28} />
            <span className="text-xl font-bold text-stone-800 font-serif tracking-tight">Presidia</span>
          </Link>
        </div>
        <UserButton afterSignOutUrl="/" />
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-start gap-5 mb-10">
          <img
            src={contact.imageUrl || ""}
            alt={contact.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-stone-800 font-serif tracking-tight">{contact.name}</h1>
            <div className="text-stone-400 text-sm mt-0.5">
              {contact.role}
              {contact.organizationId && (
                <> @ <Link href={`/organizations/${contact.organizationId}`} className="hover:text-stone-600 underline decoration-stone-200 underline-offset-2 transition">{contact.organizationName}</Link></>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Bio */}
          {contact.bio && (
            <section>
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">About</h2>
              <p className="text-stone-600 text-sm leading-relaxed">{contact.bio}</p>
            </section>
          )}

          {/* Links */}
          {links.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Links</h2>
              <div className="flex flex-wrap gap-2">
                {links.map((link: any) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 rounded-lg text-sm text-stone-600 hover:border-gray-200 hover:text-stone-800 transition"
                  >
                    <span className="text-stone-400">{link.label || linkIcons[link.type] || link.type}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Career History */}
          {career.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-4">Career</h2>
              <div className="relative">
                <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-100" />
                <div className="space-y-4">
                  {career.map((entry: any) => (
                    <div key={entry.id} className="flex gap-4 pl-0">
                      <div className="relative z-[1] mt-1.5 shrink-0">
                        <div className={`w-[7px] h-[7px] rounded-full ${entry.isCurrent ? 'bg-stone-800' : 'bg-gray-200'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-stone-800 text-sm font-medium">{entry.role}</span>
                          {entry.isCurrent && (
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">Current</span>
                          )}
                        </div>
                        <div className="text-stone-400 text-xs mt-0.5">{entry.company}</div>
                        <div className="text-stone-300 text-xs mt-0.5">
                          {entry.startDate}{entry.endDate && ` — ${entry.endDate}`}
                        </div>
                        {entry.description && (
                          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
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
          {news.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Recent News & Activity</h2>
              <div className="space-y-3">
                {news.map((item: any) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg px-4 py-3">
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
                          <p className="text-stone-500 text-xs mt-1 leading-relaxed">{item.summary}</p>
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
          {lifeEvents.length > 0 && (
            <section>
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Life Events</h2>
              <div className="space-y-3">
                {lifeEvents.map((event: any) => (
                  <div key={event.id} className="flex gap-4 items-start">
                    <div className="text-stone-300 text-xs font-mono w-20 shrink-0 mt-0.5 text-right">{event.date}</div>
                    <div className="flex-1">
                      <div className="text-stone-800 text-sm font-medium">{event.event}</div>
                      {event.description && (
                        <p className="text-stone-500 text-xs mt-0.5 leading-relaxed">
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

          {/* Meetings */}
          <section>
            <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
              Meetings ({meetings.length})
            </h2>
            <div className="space-y-2">
              {meetings.map((m: any) => (
                <Link
                  key={m.id}
                  href={`/briefings/${m.briefingId}/meetings/${m.id}`}
                  className="flex items-center gap-4 border border-gray-100 rounded-lg px-4 py-3 hover:border-gray-200 hover:shadow-sm transition group"
                >
                  <div className="text-xs text-stone-300 font-mono w-20 shrink-0">{m.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-stone-800 text-sm font-medium">{m.briefingTitle}</div>
                    <div className="text-stone-400 text-xs">{m.briefingDate}</div>
                  </div>
                  <span className="text-stone-300 group-hover:text-stone-400 transition text-sm">&rarr;</span>
                </Link>
              ))}
              {meetings.length === 0 && (
                <p className="text-stone-400 text-sm">No meetings yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
