import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0eb] flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Presidia" width={36} height={36} />
          <span className="text-xl font-bold text-stone-800 font-serif tracking-tight">Presidia</span>
        </div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm text-stone-400 hover:text-stone-700 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="px-4 py-2 text-sm text-stone-500 hover:text-stone-800 transition">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-24">
        <Image src="/logo.svg" alt="Presidia" width={80} height={80} className="mb-8 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 font-serif tracking-tight text-center leading-tight">
          Daily Intelligence,<br />
          <span className="text-stone-400">Delivered.</span>
        </h1>
        <p className="mt-4 text-stone-400 text-center max-w-md">
          AI-powered briefings and meeting prep for your organization.
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="mt-10 px-6 py-3 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 transition tracking-wide">
              Request Access
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="mt-10 px-6 py-3 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 transition tracking-wide"
          >
            Go to Dashboard
          </Link>
        </SignedIn>
      </div>

      <footer className="text-center py-6 text-stone-300 text-xs tracking-wide">
        &copy; 2026 Presidia
      </footer>
    </main>
  );
}
