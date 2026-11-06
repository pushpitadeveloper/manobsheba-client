"use client";
import { useState } from "react";
import Link from "【entity-next¦canonical_name=next】/link";
import { useRouter } from "【entity-next¦canonical_name=next】/navigation";
import { signIn, signInWithGoogle } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const res = await signIn.email({ email, password });
      if (res.error) {
        toast.error(res.error.message || "Login failed");
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch {
      toast.error("Login failed, try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Google login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-6 sm:p-8">
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-black">M</span>
          <h1 className="text-2xl font-black mt-3">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">Login to ManobSheba</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <button disabled={loading} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">OR</span>
          <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={handleGoogle} className="w-full border font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2">
          <span className="text-lg">G</span> Continue with Google
        </button>

        <p className="text-center text-sm mt-5 text-slate-500">
          Don&apos;t have an account? <Link href="/register" className="text-[#1E3A8A] dark:text-emerald-400 font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}