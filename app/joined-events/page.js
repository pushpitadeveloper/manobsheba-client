"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getJoinedEvents, leaveJoinedEvent } from "@/lib/api";
import toast from "react-hot-toast";

export default function JoinedEventsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login first", { id: "login-required" });
      router.push("/login");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (user?.email) {
      getJoinedEvents(user.email).then((d) => {
        const arr = Array.isArray(d) ? d : [];
        arr.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setJoined(arr);
      }).catch(() => setJoined([])).finally(() => setLoading(false));
    }
  }, [user?.email]);

  async function handleLeave(id) {
    if (!confirm("Leave this event?")) return;
    try {
      const res = await leaveJoinedEvent(id);
      if (res?.deletedCount > 0 || res?.acknowledged) {
        toast.success("Left event");
        setJoined(joined.filter((j) => j._id !== id));
      } else {
        toast.error("Failed to leave");
      }
    } catch {
      toast.error("Failed to leave");
    }
  }

  if (isPending || loading) return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black">My Joined Events</h1>
      <p className="text-sm text-slate-500 mt-1">Events you joined, sorted by date ({joined.length})</p>

      {joined.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-10 text-center mt-6">
          <p className="text-slate-500">You haven&apos;t joined any event yet.</p>
          <Link href="/upcoming" className="inline-block mt-4 bg-[#1E3A8A] text-white font-bold px-6 py-3 rounded-full text-sm">Explore Events</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {joined.map((j) => (
            <div key={j._id} className="bg-white dark:bg-slate-900 border rounded-[1.5rem] overflow-hidden flex flex-col">
              <img src={j.thumbnail || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"} alt={j.eventTitle} className="w-full h-48 object-cover" />
              <div className="p-5 flex flex-col flex-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full w-fit">{j.eventType}</span>
                <h3 className="font-bold text-lg leading-snug mt-2 line-clamp-2">{j.eventTitle}</h3>
                <p className="text-sm text-slate-500 mt-1">📍 {j.location} • 📅 {j.eventDate ? new Date(j.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/events/${j.eventId}`} className="flex-1 text-center bg-[#1E3A8A] text-white text-sm font-bold py-2.5 rounded-full">View Details</Link>
                  <button onClick={() => handleLeave(j._id)} className="flex-1 bg-red-100 text-red-600 text-sm font-bold py-2.5 rounded-full">Leave</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}