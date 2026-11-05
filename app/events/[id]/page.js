"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { getEventById, getJoinedCount, joinEvent, getJwtToken } from "@/lib/api";

function DetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [event, setEvent] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEventById(id).then((d) => { setEvent(d); setLoading(false); }).catch(() => setLoading(false));
    getJoinedCount(id).then((d) => setCount(d?.count || 0)).catch(() => {});
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Join korte login lagbe!", { id: "login-required" });
      router.push("/login");
      return;
    }
    setJoining(true);
    try {
      await getJwtToken(user.email);
      const res = await joinEvent({ eventId: id, eventTitle: event.title, userEmail: user.email, userName: user.name, joinedAt: new Date().toISOString() });
      if (res?.message === "Already joined") toast.error("Tumi already join korecho!");
      else { toast.success("Joined! Dekha hobe event e."); setCount((c) => c + 1); }
    } catch { toast.error("Join holo na, abar try koro"); }
    setJoining(false);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12"><div className="h- bg-slate-200 dark:bg-slate-800 rounded- animate-pulse" /></div>;
  if (!event?._id) return <div className="text-center py-20"><p className="text-4xl">😢</p><p className="font-bold mt-3">Event paoa jay nai</p><Link href="/upcoming" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2 rounded-full text-sm font-bold">Back to Events</Link></div>;

  const dateStr = event.eventDate ? new Date(event.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.thumbnail || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1000&q=80"} alt={event.title} className="w-full h- sm:h- object-cover rounded-" />
      <div className="flex flex-wrap gap-2 mt-6">
        <span className="bg-[#10B981] text-white text- font-bold px-4 py-1.5 rounded-full">{event.eventType}</span>
        <span className="bg-slate-100 dark:bg-slate-800 text- font-semibold px-4 py-1.5 rounded-full">📅 {dateStr}</span>
        <span className="bg-slate-100 dark:bg-slate-800 text- font-semibold px-4 py-1.5 rounded-full">👥 {count} jon join koreche</span>
      </div>
      <h1 className="text- sm:text- font-black mt-4 leading-tight">{event.title}</h1>
      <p className="text-slate-500 mt-2">📍 {event.location} • By {event.creatorName || "Organizer"} ({event.creatorEmail || ""})</p>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-6 whitespace-pre-line">{event.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={handleJoin} disabled={joining} className="bg-[#1E3A8A] text-white px-7 py-3 rounded-full font-bold text-sm disabled:opacity-60">{joining ? "Join hocche..." : "Join Event →"}</button>
        <Link href="/upcoming" className="border border-slate-300 dark:border-slate-700 px-7 py-3 rounded-full font-bold text-sm">Back</Link>
      </div>
    </div>
  );
}

export default function EventDetails() {
  return <Suspense><DetailsContent /></Suspense>;
}