"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle, useSession } from "@/lib/auth-client";
import { getJwtToken, clearToken } from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const tokenFetched = useRef(false);

  // Google diye fire asle token banano - 1 bar e, bar bar na
  useEffect(() => {
    if (userEmail && !tokenFetched.current) {
      tokenFetched.current = true;
      getJwtToken(userEmail);
    }
    if (!userEmail) {
      tokenFetched.current = false;
    }
  }, [userEmail]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn.email({ email, password });
      if (res?.error) {
        toast.error(res.error.message || "Login failed");
      } else {
        // Purano token muche notun JWT banao
        clearToken();
        await getJwtToken(email);
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error("Google login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#F0F7FF] dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8 border border-blue-100 dark:border-slate-800">
        <h1 className="text-3xl font-black text-center text-slate-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-center text-slate-500 mt-2 text-sm">
          Login to ManobSheba to join events
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-5 text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-800 dark:text-emerald-400 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}