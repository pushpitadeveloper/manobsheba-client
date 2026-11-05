"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { clearToken } from "@/lib/api";

function NavbarContent() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const isActive = (path) => pathname === path ? "text-[#1E3A8A] dark:text-white font-bold" : "text-slate-600 dark:text-slate-300";

  const handleLogout = async () => {
    await signOut();
    clearToken();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xl">M</div>
          <div className="leading-tight">
            <p className="font-black text- sm:text- text-[#1E3A8A] dark:text-white">ManobSheba</p>
            <p className="hidden sm:block text- text-slate-500">Manusher pase, manobotar jonno</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text- font-medium">
          <Link href="/" className={`${isActive("/")} hover:text-[#1E3A8A]`}>Home</Link>
          <Link href="/upcoming" className={`${isActive("/upcoming")} hover:text-[#1E3A8A]`}>Upcoming</Link>
          {user && <Link href="/create" className={`${isActive("/create")} hover:text-[#1E3A8A]`}>Create Event</Link>}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isPending ? (
            <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2 group">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#10B981]" />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold">{user.name?.[0]?.toUpperCase()}</div>
                )}
                <span className="hidden lg:block max-w- truncate text-sm font-semibold group-hover:text-[#1E3A8A]">{user.name}</span>
                <span className="text-xs">▼</span>
              </button>
              {open && (
                <div className="absolute right-0 top- w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 text-sm z-50">
                  <Link href="/create" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Create Event</Link>
                  <Link href="/manage" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Manage Events</Link>
                  <Link href="/joined" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Joined Events</Link>
                  <Link href="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="bg-[#1E3A8A] text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#162E6B]">Login</Link>
          )}

          <button onClick={() => setMobile(!mobile)} className="md:hidden w-9 h-9 flex items-center justify-center text-xl">☰</button>
        </div>
      </div>

      {mobile && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3 text-sm font-medium bg-white dark:bg-slate-900">
          <Link href="/" onClick={() => setMobile(false)}>Home</Link>
          <Link href="/upcoming" onClick={() => setMobile(false)}>Upcoming</Link>
          {user && (
            <>
              <Link href="/create" onClick={() => setMobile(false)}>Create Event</Link>
              <Link href="/manage" onClick={() => setMobile(false)}>Manage Events</Link>
              <Link href="/joined" onClick={() => setMobile(false)}>Joined Events</Link>
              <Link href="/profile" onClick={() => setMobile(false)}>Profile</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense>
      <NavbarContent />
    </Suspense>
  );
}