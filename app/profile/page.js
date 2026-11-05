"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function ProfileContent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  if (!isPending && !user) { router.push("/login"); return null; }
  if (!user) return <div className="max-w-md mx-auto px-4 py-12"><div className="h- bg-slate-200 dark:bg-slate-800 rounded- animate-pulse" /></div>;

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
        <div className="mt-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-left text-sm">
          <p><span className="font-bold">Name:</span> {user.name}</p>
          <p className="mt-2"><span className="font-bold">Email:</span> {user.email}</p>
          <p className="mt-2"><span className="font-bold">Verified:</span> {user.emailVerified ? "Yes ✅" : "No"}</p>
          <p className="mt-2"><span className="font-bold">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "Recently"}</p>
        </div>
        <p className="text-xs text-slate-400 mt-4">ManobSheba Volunteer • Manusher pase, manobotar jonno</p>
      </div>
    </div>
  );
}

export default function Profile() { return <Suspense><ProfileContent /></Suspense>; }