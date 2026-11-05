"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { createEvent, getJwtToken } from "@/lib/api";

const TYPES = ["Cleanup", "Plantation", "Donation", "Blood Donation", "Education", "Winter Relief", "Health Camp"];

function CreateContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", eventType: "Cleanup", location: "", eventDate: "", thumbnail: "", description: "" });

  if (!isPending && !user) { toast.error("Create korte login lagbe!", { id: "login-required" }); router.push("/login"); return null; }
  if (!user) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.eventDate || !form.description) return toast.error("Sob required field puron koro");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (new Date(form.eventDate) < today) return toast.error("Date ajker pore hote hobe");
    setLoading(true);
    try {
      await getJwtToken(user.email);
      const res = await createEvent({ ...form, creatorEmail: user.email, creatorName: user.name, createdAt: new Date().toISOString() });
      if (res?.insertedId || res?.acknowledged) { toast.success("Event create hoye gese!"); router.push("/upcoming"); }
      else toast.error("Create holo na");
    } catch { toast.error("Create holo na"); }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text- font-black">Create New Event</h1>
      <p className="text-slate-500 text-sm mt-1">Tomar elakar jonno ekta valo kaj suru koro.</p>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded- p-6 sm:p-8 mt-6 flex flex-col gap-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Event Title - ex: Cox's Bazar Beach Cleanup" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select name="eventType" value={form.eventType} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none text-sm">{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
        </div>
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location - ex: Cox's Bazar Sea Beach" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
        <input name="thumbnail" value={form.thumbnail} onChange={handleChange} placeholder="Thumbnail Image URL" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event er details likho - ki korbo, kokhon asbe, ki anbe..." rows={5} className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm resize-none" />
        <button disabled={loading} className="bg-[#1E3A8A] text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-60">{loading ? "Creating..." : "Create Event →"}</button>
      </form>
    </div>
  );
}

export default function Create() { return <Suspense><CreateContent /></Suspense>; }