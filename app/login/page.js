"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn, signInWithGoogle, useSession } from "@/lib/auth-client";
import { getJwtToken } from "@/lib/api";

function LoginContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (session?.user) { router.push("/"); return null; }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email + password dao");
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    if (error) { toast.error(error.message || "Login holo na"); setLoading(false); return; }
    await getJwtToken(email);
    toast.success("Welcome back!");
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded- p-8 shadow-lg border border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xl mx-auto">M</div>
        <h1 className="text- font-black text-center mt-4">Welcome Back</h1>
        <p className="text-center text-sm text-slate-500 mt-1">ManobSheba te login koro</p>
        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none text-sm" />
          <button disabled={loading} className="bg-[#1E3A8A] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60">{loading ? "Login hocche..." : "Login"}</button>
        </form>
        <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /><span className="text-xs text-slate-400">OR</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /></div>
        <button onClick={async () => { await signInWithGoogle(); }} className="w-full border border-slate-200 dark:border-slate-700 py-3 rounded-xl font-semibold text-sm">Continue with Google</button>
        <p className="text-center text-sm text-slate-500 mt-5">Account nai? <Link href="/register" className="text-[#1E3A8A] dark:text-white font-bold">Register</Link></p>
      </div>
    </div>
  );
}

export default function Login() { return <Suspense><LoginContent /></Suspense>; }