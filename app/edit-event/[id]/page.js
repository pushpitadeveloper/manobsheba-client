"use client";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const TYPES = ["Cleanup", "Plantation", "Donation", "Blood", "Education", "Winter Relief", "Health", "Food"];

function EditContent({ params }) {
  // use(params) ekhon Suspense er VITORE
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    eventType: "Cleanup",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetched = useRef(false);

  // Login check
  useEffect(() => {
    if (userEmail === "") return;
    // session load howar por jodi user na thake, login e pathao - eita alada logic, ekhane sudhu fetch
  }, [userEmail]);

  // Event load
  useEffect(() => {
    if (!id || fetched.current) return;
    fetched.current = true;

    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`);
        const data = await res.json();
        const ev = data.event || data.data || data;
        if (!ev || !ev._id) {
          toast.error("Event not found");
          router.push("/manage-events");
          return;
        }
        setForm({
          title: ev.title || "",
          description: ev.description || "",
          location: ev.location || "",
          date: ev.date ? String(ev.date).slice(0, 10) : "",
          eventType: ev.eventType || "Cleanup",
          imageUrl: ev.imageUrl || ev.thumbnail || ev.image || "",
        });
      } catch (err) {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("manobsheba-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }
      toast.success("Event updated successfully");
      router.push("/manage-events");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center py-20 text-slate-500">Loading event...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="block text-sm font-bold mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="Event title" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="Describe your event" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Location *</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="Dhaka" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Event Type</label>
            <select name="eventType" value={form.eventType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="https://..." />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 rounded-full bg-[#1E3A8A] text-white font-bold hover:bg-blue-900 disabled:opacity-50">
          {saving ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}

export default function EditEventPage({ params }) {
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Loading...</p>}>
      <EditContent params={params} />
    </Suspense>
  );
}