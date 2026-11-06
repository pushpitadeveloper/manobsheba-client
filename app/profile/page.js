"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please login first", { id: "login-required" });
      router.push("/login");
    }
    if (user) {
      setName(user.name || "");
      setPhoto(user.image || "");
    }
  }, [isPending, user, router]);

  async function handleSave(e) {
    e.preventDefault();
    if (!name) return toast.error("Name is required");
    setSaving(true);
    try {
      const res = await updateUser({ name, image: photo });
      if (res.error) toast.error(res.error.message || "Update failed");
      else {
        toast.success("Profile updated!");
        window.location.reload();
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-6 sm:p-8 text-center">
        <img src={photo || "https://i.ibb.co/5GzXkwq/user.png"} alt={name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100" />
        <h1 className="text-2xl font-black mt-3">{user.name}</h1>
        <p className="text-sm text-slate-500">{user.email}</p>

        <form onSubmit={handleSave} className="mt-6 space-y-4 text-left">
          <div>
            <label className="text-sm font-bold">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Photo URL</label>
            <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://..." className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <button disabled={saving} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-60">
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}