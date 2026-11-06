"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getEvents, deleteEvent } from "@/lib/api";
import toast from "react-hot-toast";

export default function ManageEventsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login first", { id: "login-required" });
      router.push("/login");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (user?.email) {
      getEvents().then((d) => {
        const mine = (Array.isArray(d) ? d : []).filter((e) => e.creatorEmail === user.email);
        setEvents(mine);
      }).catch(() => setEvents([])).finally(() => setLoading(false));
    }
  }, [user?.email]);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await deleteEvent(id);
      if (res?.deletedCount > 0 || res?.acknowledged) {
        toast.success("Event deleted!");
        setEvents(events.filter((e) => e._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (isPending || loading) return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">My Events</h1>
          <p className="text-sm text-slate-500 mt-1">Manage events you created ({events.length})</p>
        </div>
        <Link href="/create-event" className="bg-[#1E3A8A] text-white text-sm font-bold px-5 py-3 rounded-full">+ Create New</Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-10 text-center mt-6">
          <p className="text-slate-500">You haven&apos;t created any event yet.</p>
          <Link href="/create-event" className="inline-block mt-4 bg-[#1E3A8A] text-white font-bold px-6 py-3 rounded-full text-sm">Create First Event</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {events.map((ev) => (
            <div key={ev._id} className="bg-white dark:bg-slate-900 border rounded-[1.5rem] overflow-hidden flex flex-col">
              <img src={ev.thumbnail || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"} alt={ev.title} className="w-full h-48 object-cover" />
              <div className="p-5 flex flex-col flex-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full w-fit">{ev.eventType}</span>
                <h3 className="font-bold text-lg leading-snug mt-2 line-clamp-2">{ev.title}</h3>
                <p className="text-sm text-slate-500 mt-1">📍 {ev.location} • 📅 {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/edit-event/${ev._id}`} className="flex-1 text-center bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-full">Edit</Link>
                  <button onClick={() => handleDelete(ev._id)} className="flex-1 bg-red-100 text-red-600 text-sm font-bold py-2.5 rounded-full">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}