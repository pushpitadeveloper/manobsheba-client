"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getJoinedEvents, leaveJoinedEvent, getEventById } from "@/lib/api";
import toast from "react-hot-toast";

export default function JoinedEventsPage() {
  const { data: session, isPending } = useSession();
  const userEmail = session?.user?.email || "";
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (!userEmail) {
      router.push("/login");
      return;
    }
    if (loaded.current) return;
    loaded.current = true;

    async function load() {
      try {
        const data = await getJoinedEvents(userEmail);
        const joinedList = data.joined || data.data || (Array.isArray(data) ? data : []);

        // Joined e date/location thake na, tai prottek event er details ano
        const enriched = await Promise.all(
          joinedList.map(async (j) => {
            try {
              const ed = await getEventById(j.eventId);
              const ev = ed.event || ed.data || ed;
              return {
                _id: j.eventId,
                joinedId: j._id,
                title: ev?.title || j.eventTitle || "Event",
                thumbnail: ev?.thumbnail || j.thumbnail || "",
                location: ev?.location || "—",
                eventDate: ev?.eventDate || ev?.date || j.eventDate || "",
                eventType: ev?.eventType || "Event",
                joinedAt: j.joinedAt,
              };
            } catch {
              // Event delete hoye gele oita bad dao
              return null;
            }
          })
        );
        // Date diye sort - kacher event age
        const filtered = enriched.filter(Boolean).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setEvents(filtered);
      } catch (err) {
        toast.error(err.message || "Failed to load joined events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isPending, userEmail, router]);

  async function handleLeave(eventId, title) {
    const ok = window.confirm(`Leave "${title}"?`);
    if (!ok) return;
    try {
      await leaveJoinedEvent(eventId, userEmail);
      setEvents((prev) => prev.filter((e) => String(e._id) !== String(eventId)));
      toast.success("Left event successfully");
    } catch (err) {
      toast.error(err.message || "Failed to leave event");
    }
  }

  if (isPending || loading) {
    return <p className="text-center py-20 text-slate-500">Loading joined events...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black">Joined Events</h1>
      <p className="text-slate-500 mt-1">Events you joined ({events.length})</p>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border mt-6">
          <p className="text-slate-500">You have not joined any events yet.</p>
          <Link href="/upcoming" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-full text-sm font-bold">
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {events.map((ev) => {
            const dateStr = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
            return (
              <div key={ev._id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border overflow-hidden">
                {ev.thumbnail && <img src={ev.thumbnail} alt={ev.title} className="w-full h-48 object-cover" />}
                <div className="p-5">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                    {ev.eventType}
                  </span>
                  <h3 className="text-xl font-black mt-3 line-clamp-1">{ev.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">📍 {ev.location} • 📅 {dateStr}</p>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/events/${ev._id}`} className="flex-1 text-center bg-[#1E3A8A] text-white font-bold py-2.5 rounded-full text-sm">
                      View
                    </Link>
                    <button onClick={() => handleLeave(ev._id, ev.title)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2.5 rounded-full text-sm">
                      Leave
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}