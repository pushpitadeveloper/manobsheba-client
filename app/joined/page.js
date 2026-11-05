"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { getJoinedEvents, getEventById, leaveEvent, getJwtToken } from "@/lib/api";

function JoinedContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) { toast.error("Joined dekhte login lagbe!", { id: "login-required" }); router.push("/login"); return; }
    if (user) {
      getJwtToken(user.email).then(() => getJoinedEvents(user.email)).then(async (d) => {
        const list = Array.isArray(d) ? d : [];
        const withDetails = await Promise.all(list.map(async (j) => {
          try { const ev = await getEventById(j.eventId); return { ...j, event: ev }; } catch { return { ...j, event: null }; }
        }));
        withDetails.sort((a, b) => new Date(a.event?.eventDate || 0) - new Date(b.event?.eventDate || 0));
        setItems(withDetails); setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user, isPending, router]);

  const handleLeave = async (eventId) => {
    await getJwtToken(user.email);
    await leaveEvent(eventId, user.email);
    setItems(items.filter((i) => i.eventId !== eventId));
    toast.success("Left event");
  };

  if (isPending || loading) return <div className="max-w-5xl mx-auto px-4 py-10"><div className="h- bg-slate-200 dark:bg-slate-800 rounded- animate-pulse" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text- font-black">My Joined Events</h1>
      <p className="text-slate-500 text-sm mt-1">Tumi {items.length} ta event e join korecho. Date onujayi sajano.</p>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded- mt-6"><p className="text-4xl">🎉</p><p className="font-bold mt-3">Ekhono kono event e join koro nai</p><Link href="/upcoming" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-full text-sm font-bold">Explore Events</Link></div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {items.map((j) => (
            <div key={j._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <p className="font-bold">{j.event?.title || j.eventTitle || "Event"}</p>
                <p className="text-sm text-slate-500 mt-1">📍 {j.event?.location || ""} • 📅 {j.event?.eventDate ? new Date(j.event.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""} • {j.event?.eventType || ""}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {j.event?._id && <Link href={`/events/${j.event._id}`} className="bg-[#1E3A8A] text-white px-4 py-2 rounded-full text-xs font-bold">Details</Link>}
                <button onClick={() => handleLeave(j.eventId)} className="border border-red-200 text-red-600 px-4 py-2 rounded-full text-xs font-bold">Leave</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Joined() { return <Suspense><JoinedContent /></Suspense>; }