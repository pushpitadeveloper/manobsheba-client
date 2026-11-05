"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import EventCard from "@/components/EventCard";
import { getRecentEvents } from "@/lib/api";

const FEATURES = [
  { icon: "🌱", title: "Poribesh Rokkha", desc: "Brikkho ropon, beach cleanup ar nodir par poriskar kore poribesh ke sundor rakhi." },
  { icon: "🩸", title: "Rokto Dan", desc: "Rokto dan kormosuchi diye jibon bachai. Ek bag rokto, ekta poribarer hasi." },
  { icon: "📚", title: "Sikkha & Teaching", desc: "Subidhabanchito sishuder jonno free class, boi ar sikkha samogri." },
  { icon: "🤝", title: "Manobotar Seba", desc: "Khaddo dan, shit bostro bitoron ar health camp - manusher pase darai." },
];

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80", label: "Beach Cleanup" },
  { img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80", label: "Tree Plantation" },
  { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80", label: "Food Donation" },
  { img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80", label: "Teaching Kids" },
  { img: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80", label: "Blood Donation" },
  { img: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=80", label: "Health Camp" },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getRecentEvents().then((d) => { setEvents(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email dao!");
    toast.success("Subscribed! Dhonnobad.");
    setEmail("");
  };

  return (
    <div>
      {/* Banner */}
      <section className="relative overflow-hidden bg-[#1E3A8A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col md:grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-[#10B981] text-white text- font-bold px-4 py-1.5 rounded-full">✨ Manobotar Sebay - Bangladesh</span>
            <h1 className="mt-5 text- sm:text- lg:text- font-black leading-[1.05]">Manusher Pase,<br />Manobotar Jonno.</h1>
            <p className="mt-4 text-blue-100 text- sm:text- leading-relaxed max-w-">Tumi eka na. Amra sobai mile poribesh, sikkha ar manobotar jonno kaj kori. Ekta event e join koro, ekta jibon bodle dao.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/upcoming" className="bg-[#10B981] text-white px-6 py-3 rounded-full font-bold text-sm">Explore Events →</Link>
              <Link href="/create" className="bg-white text-[#1E3A8A] px-6 py-3 rounded-full font-bold text-sm">Create Event</Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div><p className="font-black text-2xl">120+</p><p className="text-blue-200">Events</p></div>
              <div><p className="font-black text-2xl">3.5k+</p><p className="text-blue-200">Volunteers</p></div>
              <div><p className="font-black text-2xl">15+</p><p className="text-blue-200">Cities</p></div>
            </div>
          </div>
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1000&q=80" alt="Volunteers" className="w-full h-72 md:h- object-cover rounded-" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 text-slate-800 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div><p className="font-bold text-sm">Next Event: Cox&apos;s Bazar Cleanup</p><p className="text-xs text-slate-500">15 Nov 2026 • Cox&apos;s Bazar</p></div>
              <Link href="/upcoming" className="bg-[#1E3A8A] text-white text-xs font-bold px-4 py-2 rounded-full shrink-0">Join</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <p className="text-center text-[#10B981] font-bold text-sm tracking-wide">AMRA KI KORI</p>
        <h2 className="text-center text- sm:text- font-black mt-2">Amader Kajer Khetro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="font-bold text- mt-4">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent 6 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-end justify-between">
          <div><p className="text-[#10B981] font-bold text-sm">RECENT EVENTS</p><h2 className="text- sm:text- font-black mt-1">Samprotik Events</h2></div>
          <Link href="/upcoming" className="text-[#1E3A8A] dark:text-white font-bold text-sm shrink-0">Sob Dekho →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">{[1, 2, 3].map((i) => <div key={i} className="h- bg-slate-200 dark:bg-slate-800 rounded-[1.5rem] animate-pulse" />)}</div>
        ) : events.length === 0 ? (
          <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-[1.5rem] mt-8"><p className="text-4xl">🌿</p><p className="font-bold mt-3">Ekhono kono event nai</p><p className="text-sm text-slate-500 mt-1">Prothom event ta tumi create koro!</p><Link href="/create" className="inline-block mt-4 bg-[#1E3A8A] text-white px-5 py-2.5 rounded-full text-sm font-bold">Create Event</Link></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">{events.slice(0, 6).map((ev) => <EventCard key={ev._id} event={ev} />)}</div>
        )}
      </section>

      {/* Gallery */}
      <section className="bg-white dark:bg-slate-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text- sm:text- font-black text-center">Amader Kajer Chobi</h2>
          <p className="text-center text-slate-500 text-sm mt-2">Field theke tola kichu muhurto</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {GALLERY.map((g) => (
              <div key={g.label} className="relative rounded-2xl overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.label} className="w-full h- sm:h- object-cover group-hover:scale-105 transition" />
                <span className="absolute bottom-2 left-2 bg-black/60 text-white text- font-semibold px-3 py-1 rounded-full">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-[#10B981] rounded- px-6 py-10 sm:px-10 text-center text-white">
          <h2 className="text- sm:text- font-black">Notun Event er Khobor Pao</h2>
          <p className="text-emerald-50 text-sm sm:text-base mt-2">Soptahe 1 bar, sudhu valo khobor. Spam na.</p>
          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w- mx-auto">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Tomar email" className="flex-1 px-5 py-3 rounded-full text-slate-800 outline-none text-sm" />
            <button className="bg-[#1E3A8A] px-6 py-3 rounded-full font-bold text-sm">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}