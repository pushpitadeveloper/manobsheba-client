"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getEvents } from "@/lib/api";
import toast from "react-hot-toast";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getEvents({ limit: 6 })
      .then((d) => setEvents(Array.isArray(d) ? d.slice(0, 6) : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    toast.success("Subscribed!");
    setEmail("");
  };

  return (
    <div>
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="bg-[#EEF2FF] dark:bg-slate-900 rounded- overflow-hidden grid md:grid-cols-2">
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <span className="bg-white dark:bg-slate-800 text-[#1E3A8A] dark:text-emerald-400 text-xs font-black tracking-widest px-4 py-2 rounded-full w-fit">
              HUMANITY • TOGETHER • HOPE
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mt-5">
              Stand Beside People.
              <br />
              <span className="text-[#1E3A8A] dark:text-emerald-400">Serve Humanity.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Join blood donation camps, free teaching programs, cleanup drives and food distribution near you. Meet good people and make your city better.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/upcoming" className="bg-[#1E3A8A] text-white font-bold px-7 py-3.5 rounded-full text-sm">
                Explore Upcoming
              </Link>
              <Link href="/create-event" className="bg-white dark:bg-slate-800 font-bold px-7 py-3.5 rounded-full text-sm border">
                + Create Event
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-4">No fees. Just show up with a kind heart.</p>
          </div>
          <div className="relative min-h-">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
              alt="Volunteers helping community"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white rounded-2xl px-5 py-4 shadow-xl">
              <p className="font-black">1,800+ Volunteers</p>
              <p className="text-sm text-slate-500">Joined events across Bangladesh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-3 gap-3 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border">
          <p className="text-2xl sm:text-3xl font-black text-[#1E3A8A] dark:text-emerald-400">120+</p>
          <p className="text-xs sm:text-sm text-slate-500">Events Done</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border">
          <p className="text-2xl sm:text-3xl font-black text-[#1E3A8A] dark:text-emerald-400">1,800+</p>
          <p className="text-xs sm:text-sm text-slate-500">Volunteers</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border">
          <p className="text-2xl sm:text-3xl font-black text-[#1E3A8A] dark:text-emerald-400">15+</p>
          <p className="text-xs sm:text-sm text-slate-500">Districts</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl sm:text-4xl font-black text-center">Why Join ManobSheba?</h2>
        <p className="text-center text-slate-500 mt-2">Small help, big change for your community.</p>
        <div className="grid sm:grid-cols-3 gap-5 mt-8">
          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6">
            <p className="text-4xl">🩸</p>
            <h3 className="font-black text-xl mt-3">Blood Donation</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Donate blood and save lives. Find nearby blood donation camps and urgent requests.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6">
            <p className="text-4xl">📚</p>
            <h3 className="font-black text-xl mt-3">Free Teaching</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Teach street children and help poor students. One hour of your time can change a life.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6">
            <p className="text-4xl">🌱</p>
            <h3 className="font-black text-xl mt-3">Clean & Green</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Join cleanup drives and tree plantation to make your area clean and green.</p>
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black">Recent Upcoming Events</h2>
            <p className="text-slate-500 mt-1 text-sm">Pick one and join the change.</p>
          </div>
          <Link href="/upcoming" className="hidden sm:block font-bold text-[#1E3A8A] dark:text-emerald-400 text-sm">View All →</Link>
        </div>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : events.length === 0 ? (
          <p className="text-center text-slate-500 mt-8">No upcoming events yet. Create the first one!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {events.map((ev) => <EventCard key={ev._id} event={ev} />)}
          </div>
        )}
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl sm:text-4xl font-black text-center">Moments of Kindness</h2>
        <p className="text-center text-slate-500 mt-2 text-sm">Photos from our community events.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80" alt="Food donation" className="w-full h-44 sm:h-56 object-cover rounded-2xl" />
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Helping children" className="w-full h-44 sm:h-56 object-cover rounded-2xl" />
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80" alt="Tree plantation" className="w-full h-44 sm:h-56 object-cover rounded-2xl" />
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80" alt="Health camp" className="w-full h-44 sm:h-56 object-cover rounded-2xl" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-[#1E3A8A] text-white rounded- p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-black">Stay Updated With Good News</h2>
          <p className="text-blue-200 mt-2 text-sm">Get weekly updates about new events near you.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full text-slate-900 outline-none text-sm"
            />
            <button className="bg-emerald-500 font-bold px-7 py-3.5 rounded-full text-sm">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}