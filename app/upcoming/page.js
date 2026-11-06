"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "@/components/EventCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getEvents } from "@/lib/api";

const TYPES = ["All", "Cleanup", "Plantation", "Donation", "Blood", "Education", "Winter Relief", "Food Drive", "Health Camp", "Others"];

// Footer theke asa short type -> dropdown er asol type e map kora
const TYPE_MAP = {
  "Cleanup": "Cleanup",
  "Plantation": "Plantation",
  "Donation": "Donation",
  "Blood": "Blood",
  "Blood Donation": "Blood",
  "Education": "Education",
  "Winter": "Winter Relief",
  "Winter Relief": "Winter Relief",
  "Food": "Food Drive",
  "Health": "Health Camp",
};

function UpcomingContent() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 1. URL theke type porbe - Footer click korle ekhane asbe
  useEffect(() => {
    if (urlType) {
      const mapped = TYPE_MAP[urlType] || urlType;
      if (TYPES.includes(mapped)) {
        setType(mapped);
      } else {
        const found = TYPES.find((t) => t.toLowerCase() === mapped.toLowerCase());
        if (found) setType(found);
      }
    } else {
      setType("All");
    }
  }, [urlType]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    getEvents({ search: debouncedSearch, type: type === "All" ? "" : type })
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, type]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-black">Upcoming Events</h1>
      <p className="text-slate-500 mt-1 text-sm sm:text-base">Find an event you care about and join the change.</p>

      <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-[1.5rem] p-4 sm:p-5 mt-6 flex flex-col md:flex-row gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or location..." className="flex-1 px-5 py-3.5 rounded-full border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-5 py-3.5 rounded-full border bg-slate-50 dark:bg-slate-800 outline-none font-semibold text-sm md:w-56">
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <p className="text-sm text-slate-500 mt-4">{loading ? "Searching events..." : `${events.length} event${events.length !== 1 ? "s" : ""} found`}</p>

      {loading ? <LoadingSkeleton count={6} /> : events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-12 text-center mt-6">
          <p className="text-6xl">🔍</p>
          <h2 className="text-2xl font-black mt-4">No result found</h2>
          <p className="text-slate-500 text-sm mt-2">Try a different search or event type.</p>
          <button onClick={() => { setSearch(""); setType("All"); }} className="mt-5 bg-blue-800 text-white font-bold px-6 py-3 rounded-full text-sm">Clear Filters</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">{events.map((ev) => <EventCard key={ev._id} event={ev} />)}</div>
      )}
    </div>
  );
}

export default function UpcomingPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={6} />}>
      <UpcomingContent />
    </Suspense>
  );
}