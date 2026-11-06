"use client";
import { use, useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getEventById, updateEvent } from "@/lib/api";
import toast from "react-hot-toast";

const TYPES = ["Cleanup", "Plantation", "Donation", "Blood", "Education", "Winter Relief", "Food Drive", "Health Camp", "Others"];

function EditContent({ id }) {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [form, setForm] = useState({ title: "", eventType: "", location: "", eventDate: "", thumbnail: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login first", { id: "login-required" });
      router.push("/login");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (id) {
      getEventById(id).then((d) => {
        if (d) {
          setForm({
            title: d.title || "",
            eventType: d.eventType || "",
            location: d.location || "",
            eventDate: d.eventDate ? d.eventDate.split("T")[0] : "",
            thumbnail: d.thumbnail || "",
            description: d.description || "",
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateEvent(id, form);
      if (res?.modifiedCount > 0 || res?.acknowledged) {
        toast.success("Event updated!");
        router.push("/manage-events");
      } else {
        toast.error("No changes or update failed");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || loading) return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-6 sm:p-8">
        <h1 className="text-3xl font-black">Edit Event</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Event Title *</label>
            <input name="title" value={form.title} onChange={onChange} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
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
            <input name="location" value={form.location} onChange={onChange} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Thumbnail URL</label>
            <input name="thumbnail" value={form.thumbnail} onChange={onChange} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
            {form.thumbnail && <img src={form.thumbnail} alt="Preview" className="w-full h-48 object-cover rounded-xl mt-3" />}
          </div>
          <div>
            <label className="text-sm font-bold">Description *</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={5} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm resize-none" />
          </div>
          <button disabled={saving} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-60">
            {saving ? "Saving..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditEventPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Loading...</p>}>
      <EditContent id={id} />
    </Suspense>
  );
}