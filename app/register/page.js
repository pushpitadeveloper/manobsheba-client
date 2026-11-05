"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp, signInWithGoogle } from "@/lib/auth-client";
import { getJwtToken } from "@/lib/api";

function RegisterContent() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Sob field puron koro");
    if (password.length < 6) return toast.error("Password min 6 character hote hobe");
    if (!/[A-Z]/.test(password)) return toast.error("Password e 1 ta uppercase lagbe");
    if (!/[a-z]/.test(password)) return toast.error("Password e 1 ta lowercase lagbe");
    setLoading(true);
    const { error } = await signUp.email({ name, email, password, image: photo || undefined });
    if (error) { toast.error(error.message || "Register holo na"); setLoading(false); return; }
    await getJwtToken(email);
    toast.success("Account hoye gese! Welcome.");
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded- p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center font-black text-xl mx-auto">M</div>
        <h1 className="text- font-black text-center mt-4">Join ManobSheba</h1>
        <p className="text-center text-sm text-slate-500 mt-1">Volunteer hisebe join koro</p>
        <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL (optional)" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password - Upper + Lower + Min 6" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <button disabled={loading} className="bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">{loading ? "Account hocche..." : "Register"}</button>
        </form>
        <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /><span className="text-xs text-slate-400">OR</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /></div>
        <button onClick={async () => { await signInWithGoogle(); }} className="w-full border border-slate-200 dark:border-slate-700 py-3 rounded-xl font-semibold text-sm">Continue with Google</button>
        <p className="text-center text-sm text-slate-500 mt-5">Already account ache? <Link href="/login" className="text-[#1E3A8A] dark:text-white font-bold">Login</Link></p>
      </div>
    </div>
  );
}

export default function Register() { return <Suspense><RegisterContent /></Suspense>; }