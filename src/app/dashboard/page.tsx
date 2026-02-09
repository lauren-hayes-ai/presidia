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
    <div className="min-h-screen bg-stone-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-stone-200 bg-white">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Presidia" width={32} height={32} />
          <span className="text-xl font-bold text-green-900 font-serif">Presidia</span>
        </Link>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher 
            appearance={{
              elements: {
                rootBox: "text-stone-700",
                organizationSwitcherTrigger: "text-stone-600 hover:text-green-800",
              }
            }}
            afterCreateOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
          />
          <span className="text-stone-500">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900 font-serif">Your Briefings</h1>
            <p className="text-stone-500 mt-1">Daily intelligence and meeting prep</p>
          </div>
        </div>

        <div className="grid gap-4">
          {briefings.map((briefing) => (
            <Link 
              key={briefing.id}
              href={`/briefings/${briefing.id}`}
              className="bg-white border border-stone-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-stone-400 mb-1">{briefing.date}</div>
                  <h2 className="text-xl font-semibold text-green-900 group-hover:text-green-700 transition font-serif">
                    {briefing.title}
                  </h2>
                  <div className="flex items-center gap-4 text-stone-500 mt-2">
                    <span>{briefing.meetingCount} external meetings</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {briefing.companies.map((company, i) => (
                      <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {briefing.status}
                  </span>
                  <span className="text-stone-400 group-hover:text-green-600 transition text-xl">
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
            <h2 className="text-xl font-semibold text-green-900 mb-2 font-serif">No briefings yet</h2>
            <p className="text-stone-500">Your daily briefings will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
