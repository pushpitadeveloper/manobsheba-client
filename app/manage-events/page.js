"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getMyEvents, deleteEvent } from "@/lib/api";
import toast from "react-hot-toast";

export default function ManageEventsPage() {
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
        const data = await getMyEvents(userEmail);
        const list = data.events || data.data || (Array.isArray(data) ? data : []);
        setEvents(list);
      } catch (err) {
        toast.error(err.message || "Failed to load my events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isPending, userEmail, router]);

  async function handleDelete(id, title) {
    const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!ok) return;
    try {
      // FIX: lib/api er deleteEvent - token expire hole auto retry dibe
      await deleteEvent(id, userEmail);
      setEvents((prev) => prev.filter((e) => String(e._id) !== String(id)));
      toast.success("Event deleted successfully");
    } catch (err) {
      // Server e jodi Forbidden ase, mane creatorEmail mile nai
      toast.error(err.message || "Failed to delete");
    }
  }

  if (isPending || loading) {
    return <p className="text-center py-20 text-slate-500">Loading your events...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black">My Events</h1>
          <p className="text-slate-500 mt-1">Manage events you created ({events.length})</p>
        </div>
        <Link href="/create-event" className="bg-[#1E3A8A] text-white font-bold px-5 py-3 rounded-full text-sm">
          + Create New
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border">
          <p className="text-slate-500">You have not created any events yet.</p>
          <Link href="/create-event" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-full text-sm font-bold">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const dateStr = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ev.date ? new Date(ev.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
            const img = ev.thumbnail || ev.imageUrl || ev.image || "";
            return (
              <div key={ev._id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border overflow-hidden">
                {img && <img src={img} alt={ev.title} className="w-full h-48 object-cover" />}
                <div className="p-5">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
                    {ev.eventType}
                  </span>
                  <h3 className="text-xl font-black mt-3 line-clamp-1">{ev.title}</h3>
                  <p className="text-sm text-slate-500 mt-2">📍 {ev.location} • 📅 {dateStr}</p>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/edit-event/${ev._id}`} className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-full text-sm">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(ev._id, ev.title)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold py-2.5 rounded-full text-sm">
                      Delete
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