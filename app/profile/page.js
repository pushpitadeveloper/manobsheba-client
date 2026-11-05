"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/lib/auth-client";

function ProfileContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isPending && !user) { router.push("/login"); return null; }
  if (!user) return <div className="max-w-md mx-auto px-4 py-12"><div className="h- bg-slate-200 dark:bg-slate-800 rounded- animate-pulse" /></div>;

  const startEdit = () => { setName(user.name || ""); setPhoto(user.image || ""); setEditing(true); };

  const saveProfile = async () => {
    if (!name) return toast.error("Name dao");
    setSaving(true);
    const { error } = await authClient.updateUser({ name, image: photo || undefined });
    if (error) { toast.error("Update holo na"); setSaving(false); return; }
    toast.success("Profile updated! Refresh koro.");
    setEditing(false);
    setSaving(false);
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded- p-8 text-center shadow-lg border border-slate-100 dark:border-slate-800">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#10B981]" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-black text-3xl mx-auto">{user.name?.[0]?.toUpperCase()}</div>
        )}
        <h1 className="text- font-black mt-4">{user.name}</h1>
        <p className="text-slate-500 text-sm mt-1">{user.email}</p>

        {editing ? (
          <div className="mt-6 flex flex-col gap-3 text-left">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Name" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
            <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="New Photo URL" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
            <div className="flex gap-2">
              <button onClick={saveProfile} disabled={saving} className="flex-1 bg-[#10B981] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">{saving ? "Saving..." : "Save"}</button>
              <button onClick={() => setEditing(false)} className="flex-1 border py-3 rounded-xl font-bold text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-left text-sm">
              <p><span className="font-bold">Name:</span> {user.name}</p>
              <p className="mt-2"><span className="font-bold">Email:</span> {user.email}</p>
              <p className="mt-2"><span className="font-bold">Verified:</span> {user.emailVerified ? "Yes ✅" : "No"}</p>
            </div>
            <button onClick={startEdit} className="mt-5 bg-[#1E3A8A] text-white px-6 py-2.5 rounded-full font-bold text-sm">Edit Profile</button>
          </>
        )}
        <p className="text-xs text-slate-400 mt-4">ManobSheba Volunteer • Manusher pase, manobotar jonno</p>
      </div>
    </div>
  );
}

export default function Profile() { return <Suspense><ProfileContent /></Suspense>; }