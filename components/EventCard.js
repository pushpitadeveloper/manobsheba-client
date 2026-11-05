import Link from "next/link";

export default function EventCard({ event }) {
  const dateStr = event?.eventDate ? new Date(event.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-md hover:shadow-xl transition border border-slate-100 dark:border-slate-800 flex flex-col">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"}
          alt={event.title}
          className="w-full h- object-cover"
        />
        <span className="absolute top-3 left-3 bg-[#10B981] text-white text- font-bold px-3 py-1 rounded-full">{event.eventType}</span>
        <span className="absolute bottom-3 right-3 bg-white/95 text-slate-800 text- font-semibold px-3 py-1 rounded-full">📅 {dateStr}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text- leading-snug line-clamp-2">{event.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">📍 {event.location}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 flex-1">{event.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text- text-slate-500">By {event.creatorName || "Organizer"}</span>
          <Link href={`/events/${event._id}`} className="bg-[#1E3A8A] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#162E6B]">View Details →</Link>
        </div>
      </div>
    </div>
  );
}