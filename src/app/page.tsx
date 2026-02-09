import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Presidia" width={40} height={40} />
          <span className="text-2xl font-bold text-green-900 font-serif">Presidia</span>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm text-stone-600 hover:text-green-800 transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition">
                Get Started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <OrganizationSwitcher 
              appearance={{
                elements: {
                  rootBox: "text-stone-700",
                  organizationSwitcherTrigger: "text-stone-600 hover:text-green-800",
                }
              }}
            />
            <Link href="/dashboard" className="px-4 py-2 text-sm text-stone-600 hover:text-green-800 transition">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="mb-8">
          <Image src="/logo.svg" alt="Presidia Seal" width={140} height={140} className="mx-auto" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-green-900 mb-6 font-serif leading-tight">
          Daily Intelligence,<br />
          <span className="text-green-600">Delivered.</span>
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mb-12">
          AI-powered meeting prep, research insights, and daily briefings for your entire organization.
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="px-8 py-4 text-lg bg-green-700 text-white rounded-xl hover:bg-green-800 transition shadow-lg font-semibold">
              Start Free Trial
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link 
            href="/dashboard"
            className="px-8 py-4 text-lg bg-green-700 text-white rounded-xl hover:bg-green-800 transition shadow-lg font-semibold"
          >
            Go to Dashboard
          </Link>
        </SignedIn>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-8 py-16 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2 font-serif">Meeting Intelligence</h3>
          <p className="text-stone-600">Deep research on everyone you meet. Know who they are before you shake hands.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
          <div className="text-3xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2 font-serif">Organization-Wide</h3>
          <p className="text-stone-600">Shared briefings for your team. Everyone stays informed, aligned, and prepared.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
          <div className="text-3xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-green-900 mb-2 font-serif">Interactive</h3>
          <p className="text-stone-600">Ask questions, request deeper dives, and get real-time updates on your briefings.</p>
        </div>
      </div>

      <footer className="text-center py-8 text-stone-500 text-sm border-t border-stone-200 bg-white">
        © 2026 Presidia. All rights reserved.
      </footer>
    </main>
  );
}
