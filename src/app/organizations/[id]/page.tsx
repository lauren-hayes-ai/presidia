import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getOrganization, getContactsForOrganization, getMeetingsForOrganization } from "@/db/queries";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/BackButton";

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const org = await getOrganization(Number(id));
  if (!org) notFound();

  const [contacts, meetings] = await Promise.all([
    getContactsForOrganization(Number(id)),
    getMeetingsForOrganization(Number(id)),
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
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-stone-800 font-serif tracking-tight">{org.name}</h1>
          {org.description && (
            <p className="text-stone-400 text-sm mt-1">{org.description}</p>
          )}
        </div>

        <div className="space-y-8">
          {/* People */}
          <section>
            <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
              People ({contacts.length})
            </h2>
            <div className="space-y-2">
              {contacts.map((c: any) => (
                <Link
                  key={c.id}
                  href={`/contacts/${c.id}`}
                  className="flex items-center gap-4 border border-gray-100 rounded-lg px-4 py-3 hover:border-gray-200 hover:shadow-sm transition group"
                >
                  <img
                    src={c.imageUrl || ""}
                    alt={c.name}
                    className="w-9 h-9 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-stone-800 text-sm font-medium">{c.name}</div>
                    <div className="text-stone-400 text-xs">{c.role}</div>
                  </div>
                  <span className="text-stone-300 group-hover:text-stone-400 transition text-sm">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>

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
                  <img
                    src={m.contactImage || ""}
                    alt={m.contactName}
                    className="w-9 h-9 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-stone-800 text-sm font-medium">{m.contactName}</div>
                    <div className="text-stone-400 text-xs">{m.briefingDate} &middot; {m.time}</div>
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
