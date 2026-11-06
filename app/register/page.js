"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Please fill all fields");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!/[A-Z]/.test(password)) return toast.error("Password must have an uppercase letter");
    if (!/[a-z]/.test(password)) return toast.error("Password must have a lowercase letter");

    setLoading(true);
    try {
      const res = await signUp.email({
        name,
        email,
        password,
        image: photo || undefined,
      });
      if (res.error) {
        toast.error(res.error.message || "Register failed");
      } else {
        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch {
      toast.error("Register failed, try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border rounded-[1.5rem] p-6 sm:p-8">
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-black">M</span>
          <h1 className="text-2xl font-black mt-3">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join ManobSheba today</p>
        </div>

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Photo URL (Optional)</label>
            <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://..." className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
          </div>
          <div>
            <label className="text-sm font-bold">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Min 6 chars, 1 Upper + 1 Lower" className="w-full mt-1 px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none text-sm" />
            <p className="text-xs text-slate-400 mt-1">Must have uppercase, lowercase and min 6 characters.</p>
          </div>
          <button disabled={loading} className="w-full bg-[#1E3A8A] text-white font-bold py-3.5 rounded-full text-sm disabled:opacity-60">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">OR</span>
          <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={signInWithGoogle} className="w-full border font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2">
          <span className="text-lg">G</span> Continue with Google
        </button>

        <p className="text-center text-sm mt-5 text-slate-500">
          Already have an account? <Link href="/login" className="text-[#1E3A8A] dark:text-emerald-400 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}