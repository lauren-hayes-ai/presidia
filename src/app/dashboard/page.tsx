import { currentUser } from "@clerk/nextjs/server";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

// Real briefing data
const briefings = [
  {
    id: "2026-02-09",
    date: "Sunday, February 9, 2026",
    title: "Daily Briefing",
    meetingCount: 6,
    status: "ready",
    companies: ["Begin Software", "Gem Investments", "Handle", "Abstract", "Spring Street Wealth", "Inflection Capital"],
  },
];

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Presidia" width={32} height={32} />
          <span className="text-xl font-bold text-stone-800 font-serif tracking-tight">Presidia</span>
        </Link>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox: "text-stone-700",
                organizationSwitcherTrigger: "text-stone-500 hover:text-stone-800",
              }
            }}
            afterCreateOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
          <span className="text-stone-400 text-sm">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-800 font-serif tracking-tight">Your Briefings</h1>
            <p className="text-stone-400 mt-1 text-sm">Daily intelligence and meeting prep</p>
          </div>
        </div>

        <div className="grid gap-4">
          {briefings.map((briefing) => (
            <Link
              key={briefing.id}
              href={`/briefings/${briefing.id}`}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400 mb-1 tracking-wide uppercase">{briefing.date}</div>
                  <h2 className="text-xl font-semibold text-stone-800 group-hover:text-stone-900 transition font-serif">
                    {briefing.title}
                  </h2>
                  <div className="flex items-center gap-4 text-stone-400 mt-2 text-sm">
                    <span>{briefing.meetingCount} external meetings</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {briefing.companies.map((company, i) => (
                      <span key={i} className="px-2 py-1 bg-stone-100 text-stone-500 rounded text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-full text-xs font-medium tracking-wide uppercase">
                    {briefing.status}
                  </span>
                  <span className="text-stone-300 group-hover:text-stone-500 transition text-xl">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {briefings.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-stone-800 mb-2 font-serif">No briefings yet</h2>
            <p className="text-stone-400">Your daily briefings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
