"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createEvent } from "@/lib/api";
import toast from "react-hot-toast";

const TYPES = ["Cleanup", "Plantation", "Donation", "Blood", "Education", "Winter Relief", "Food Drive", "Health Camp", "Others"];

export default function CreateEventPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    eventType: "",
    location: "",
    eventDate: "",
    thumbnail: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first to create an event", { id: "login-required" });
      return router.push("/login");
    }
    if (!form.title || !form.eventType || !form.location || !form.eventDate || !form.description) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        creatorEmail: user.email,
        creatorName: user.name,
      };
      const res = await createEvent(payload);
      if (res?.insertedId || res?.acknowledged || res?._id) {
        toast.success("Event created successfully!");
        router.push("/upcoming");
      } else {
        toast.error(res?.message || "Failed to create event");
      }
    } catch {
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return <p className="text-center py-20 text-slate-500">Loading...</p>;
  }

  if (!user) {
    toast.error("Please login first to create an event", { id: "login-required" });
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-6 sm:p-8">
        <h1 className="text-3xl font-black">Create New Event</h1>
        <p className="text-sm text-slate-500 mt-1">Help your community by creating an event.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Event Title *</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="e.g. Blood Donation Camp - Dhaka" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold">Event Type *</label>
              <select name="eventType" value={form.eventType} onChange={onChange} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm">
                <option value="">Select Type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold">Event Date *</label>
              <input name="eventDate" value={form.eventDate} onChange={onChange} type="date" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold">Location *</label>
            <input name="location" value={form.location} onChange={onChange} placeholder="e.g. Mirpur 10, Dhaka" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>

          <div>
            <label className="text-sm font-bold">Thumbnail Image URL</label>
            <input name="thumbnail" value={form.thumbnail} onChange={onChange} placeholder="https://images.unsplash.com/..." className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
            {form.thumbnail && (
              <img src={form.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-xl mt-3" />
            )}
          </div>

          <div>
            <label className="text-sm font-bold">Description *</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={5} placeholder="Write about your event, what volunteers will do, what to bring..." className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm resize-none" />
          </div>

          <button disabled={loading} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-60">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
