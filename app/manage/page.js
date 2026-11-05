"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { getMyEvents, deleteEvent, updateEvent, getJwtToken } from "@/lib/api";

function ManageContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", location: "", description: "" });

  useEffect(() => {
    if (!isPending && !user) { toast.error("Manage korte login lagbe!", { id: "login-required" }); router.push("/login"); return; }
    if (user) {
      getJwtToken(user.email).then(() => getMyEvents(user.email)).then((d) => { setEvents(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    }
  }, [user, isPending, router]);

  const handleDelete = async (id) => {
    if (!confirm("Delete korba?")) return;
    await getJwtToken(user.email);
    await deleteEvent(id);
    setEvents(events.filter((e) => e._id !== id));
    toast.success("Deleted!");
  };

  const startEdit = (ev) => { setEditing(ev._id); setEditForm({ title: ev.title, location: ev.location, description: ev.description }); };

  const saveEdit = async (id) => {
    await getJwtToken(user.email);
    await updateEvent(id, editForm);
    setEvents(events.map((e) => e._id === id ? { ...e, ...editForm } : e));
    setEditing(null);
    toast.success("Updated!");
  };

  if (isPending || loading) return <div className="max-w-5xl mx-auto px-4 py-10"><div className="h- bg-slate-200 dark:bg-slate-800 rounded- animate-pulse" /></div>;
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text- font-black">Manage My Events</h1>
      <p className="text-slate-500 text-sm mt-1">Tumi {events.length} ta event create korecho.</p>
      {events.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded- mt-6"><p className="text-4xl">📝</p><p className="font-bold mt-3">Ekhono event create koro nai</p><Link href="/create" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-full text-sm font-bold">Create Event</Link></div>
      ) : (
        <div className="flex flex-col gap-4 mt-6">
          {events.map((ev) => (
            <div key={ev._id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                {editing === ev._id ? (
                  <div className="flex flex-col gap-2">
                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="px-3 py-2 rounded-lg border outline-none text-sm bg-transparent" />
                    <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="px-3 py-2 rounded-lg border outline-none text-sm bg-transparent" />
                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="px-3 py-2 rounded-lg border outline-none text-sm bg-transparent" />
                  </div>
                ) : (
                  <>
                    <p className="font-bold">{ev.title}</p>
                    <p className="text-sm text-slate-500 mt-1">📍 {ev.location} • {ev.eventType} • {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString("en-GB") : ""}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {editing === ev._id ? (
                  <>
                    <button onClick={() => saveEdit(ev._id)} className="bg-[#10B981] text-white px-4 py-2 rounded-full text-xs font-bold">Save</button>
                    <button onClick={() => setEditing(null)} className="border px-4 py-2 rounded-full text-xs font-bold">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(ev)} className="bg-[#1E3A8A] text-white px-4 py-2 rounded-full text-xs font-bold">Edit</button>
                    <button onClick={() => handleDelete(ev._id)} className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Manage() { return <Suspense><ManageContent /></Suspense>; }