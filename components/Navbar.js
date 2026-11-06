"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import toast from "react-hot-toast";

function NavbarContent() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [theme, setTheme] = useState("light");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const saved = localStorage.getItem("manobsheba-theme") || "light";
    setTheme(saved);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("manobsheba-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  async function handleLogout() {
    await signOut();
    clearToken();
    toast.success("Logged out successfully");
    setDrop(false);
    setOpen(false);
    router.push("/");
  }

  const linkCls = (href) =>
    pathname === href
      ? "text-blue-800 dark:text-emerald-400 font-bold"
      : "text-slate-600 dark:text-slate-300 hover:text-blue-800 font-medium";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-blue-100 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xl font-black">M</span>
          <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Manob<span className="text-emerald-500">Sheba</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <Link href="/" className={linkCls("/")}>Home</Link>
          <Link href="/upcoming" className={linkCls("/upcoming")}>Upcoming Events</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-lg" aria-label="Toggle theme">
            {theme === "dark" ? "☀" : "🌙"}
          </button>

          {!user ? (
            <Link href="/login" className="hidden sm:inline-block bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-full text-sm">Login</Link>
          ) : (
            <div className="relative">
              <button onClick={() => setDrop(!drop)} className="flex items-center gap-2" title={user.name}>
                <img src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=1E3A8A&color=fff`} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400" />
                <span className="hidden lg:block text-sm font-bold max-w- truncate">{user.name}</span>
                <span className="text-xs">▼</span>
              </button>
              {drop && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-800 p-2">
                  <p className="px-3 py-2 text-sm font-bold truncate">{user.name}</p>
                  <p className="px-3 pb-2 text-xs text-slate-500 truncate">{user.email}</p>
                  <Link href="/create-event" onClick={() => setDrop(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 font-medium text-sm">Create Event</Link>
                  <Link href="/manage-events" onClick={() => setDrop(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 font-medium text-sm">Manage Events</Link>
                  <Link href="/joined-events" onClick={() => setDrop(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 font-medium text-sm">Joined Events</Link>
                  <Link href="/profile" onClick={() => setDrop(false)} className="block px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 font-medium text-sm">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 font-medium text-sm">Logout</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl" aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-blue-100 dark:border-slate-800 px-4 py-4 space-y-1 bg-white dark:bg-slate-950">
          <Link href="/" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Home</Link>
          <Link href="/upcoming" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Upcoming Events</Link>
          {user ? (
            <>
              <Link href="/create-event" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Create Event</Link>
              <Link href="/manage-events" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Manage Events</Link>
              <Link href="/joined-events" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Joined Events</Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="block px-3 py-3 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-800">My Profile</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-3 rounded-xl font-bold text-rose-600">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="block text-center bg-[#1E3A8A] text-white font-bold px-3 py-3 rounded-full mt-2">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className="h- bg-white dark:bg-slate-950 border-b border-blue-100 dark:border-slate-800" />}>
      <NavbarContent />
    </Suspense>
  );
}