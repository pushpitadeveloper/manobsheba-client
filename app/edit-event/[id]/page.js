"use client";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getEventById, updateEvent } from "@/lib/api";
import toast from "react-hot-toast";

const TYPES = ["Cleanup", "Plantation", "Donation", "Blood", "Education", "Winter Relief", "Health", "Food"];

function EditContent({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  // FIX: server er sathe milay - eventDate + thumbnail, date / imageUrl na
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    eventType: "Cleanup",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetched = useRef(false);

  const todayStr = new Date().toISOString().split("T")[0];

  // Event load
  useEffect(() => {
    if (!id || fetched.current) return;
    fetched.current = true;

    async function load() {
      try {
        const data = await getEventById(id);
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
          // FIX: ev.eventDate, ev.date na. Puranota thakle fallback
          eventDate: ev.eventDate ? String(ev.eventDate).slice(0, 10) : ev.date ? String(ev.date).slice(0, 10) : "",
          eventType: ev.eventType || "Cleanup",
          // FIX: ev.thumbnail, ev.imageUrl na
          thumbnail: ev.thumbnail || ev.imageUrl || ev.image || "",
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
    // Assignment: sob field lagbe
    if (!form.title || !form.description || !form.location || !form.eventDate || !form.eventType || !form.thumbnail) {
      toast.error("Please fill all required fields");
      return;
    }
    // Assignment: date present + future hote hobe
    if (new Date(form.eventDate) < new Date(todayStr)) {
      toast.error("Event date must be present and future");
      return;
    }
    setSaving(true);
    try {
      // FIX: lib/api er updateEvent use korchi - token expire hole auto retry dibe
      // Ar _id pathacchi na, sudhu server er field gulo pathacchi
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        eventDate: form.eventDate,
        eventType: form.eventType,
        thumbnail: form.thumbnail,
      };
      await updateEvent(id, payload, userEmail);
      toast.success("Event updated successfully");
      router.push("/manage-events");
    } catch (err) {
      toast.error(err.message || "Update failed");
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
          <label className="block text-sm font-bold mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="Describe your event" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Location *</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="Dhaka" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Date *</label>
            <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} min={todayStr} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
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
            <label className="block text-sm font-bold mb-1">Image URL *</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" placeholder="https://..." />
          </div>
        </div>

        {form.thumbnail && (
          <img src={form.thumbnail} alt="preview" className="w-full h-48 object-cover rounded-xl" />
        )}

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