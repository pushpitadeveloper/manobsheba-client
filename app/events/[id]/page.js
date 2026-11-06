"use client";
import { use, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getEventById, joinEvent, getJoinedEvents } from "@/lib/api";
import toast from "react-hot-toast";

function DetailsContent({ id }) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    getEventById(id)
      .then((d) => setEvent(d))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.email) {
      getJoinedEvents(user.email).then((list) => {
        const found = (Array.isArray(list) ? list : []).some(
          (j) => (j.eventId || j._id) === id || j.eventId === event?._id
        );
        setAlreadyJoined(found);
      }).catch(() => {});
    }
  }, [user?.email, id, event?._id]);

  async function handleJoin() {
    if (!user) {
      toast.error("Please login first to join", { id: "login-required" });
      return router.push("/login");
    }
    if (alreadyJoined) return toast.error("You already joined this event");
    setJoining(true);
    try {
      const res = await joinEvent({
        eventId: event._id,
        userEmail: user.email,
        userName: user.name,
        eventTitle: event.title,
        eventDate: event.eventDate,
        eventType: event.eventType,
        location: event.location,
        thumbnail: event.thumbnail,
      });
      if (res?.insertedId || res?.acknowledged) {
        toast.success("Joined successfully!");
        setAlreadyJoined(true);
      } else {
        toast.error(res?.message || "Failed to join");
      }
    } catch {
      toast.error("Failed to join");
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <p className="text-center py-20 text-slate-500">Loading event...</p>;
  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black">Event not found</h1>
        <Link href="/upcoming" className="inline-block mt-4 bg-[#1E3A8A] text-white font-bold px-6 py-3 rounded-full text-sm">Back to Upcoming</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/upcoming" className="text-sm font-bold text-[#1E3A8A] dark:text-emerald-400">← Back to Upcoming</Link>
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] overflow-hidden mt-4">
        <img src={event.thumbnail || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"} alt={event.title} className="w-full h-64 sm:h-96 object-cover" />
        <div className="p-6 sm:p-8">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-emerald-400 text-xs font-black px-4 py-1.5 rounded-full">{event.eventType}</span>
          <h1 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">{event.title}</h1>

          <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-xs">📅 Date</p>
              <p className="font-bold mt-1">{event.eventDate ? new Date(event.eventDate).toDateString() : "TBA"}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-xs">📍 Location</p>
              <p className="font-bold mt-1">{event.location}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-xs">👤 Organizer</p>
              <p className="font-bold mt-1 truncate">{event.creatorName || event.creatorEmail || "ManobSheba"}</p>
            </div>
          </div>

          <h2 className="font-black text-xl mt-7">About This Event</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-2 whitespace-pre-line">{event.description}</p>

          <button
            onClick={handleJoin}
            disabled={joining || alreadyJoined}
            className={`w-full mt-7 font-bold py-4 rounded-full text-sm ${alreadyJoined ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" : "bg-[#1E3A8A] text-white"}`}
          >
            {alreadyJoined ? "✓ Already Joined" : joining ? "Joining..." : "Join This Event"}
          </button>
          {!user && <p className="text-center text-xs text-slate-400 mt-3">Please login to join this event.</p>}
        </div>
      </div>
    </div>
  );
}

export default function EventDetailsPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Loading...</p>}>
      <DetailsContent id={id} />
    </Suspense>
  );
}