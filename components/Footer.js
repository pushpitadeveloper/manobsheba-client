import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center font-black text-xl">M</div>
            <p className="font-black text-">ManobSheba</p>
          </div>
          <p className="mt-4 text-blue-100 text-sm leading-relaxed">
            Manusher pase, manobotar jonno. Amra eksathe somaj er jonno kaj kori - poribesh, sikkha, rokto dan, ar manobotar sebay.
          </p>
          <p className="mt-4 text-sm text-blue-200">Email: hello@manobsheba.org</p>
        </div>

        <div>
          <p className="font-bold text-lg mb-4">Quick Links</p>
          <div className="flex flex-col gap-2 text-blue-100 text-sm">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/upcoming" className="hover:text-white">Upcoming Events</Link>
            <Link href="/create" className="hover:text-white">Create Event</Link>
            <Link href="/joined" className="hover:text-white">Joined Events</Link>
            <Link href="/profile" className="hover:text-white">Profile</Link>
          </div>
        </div>

        <div>
          <p className="font-bold text-lg mb-4">Event Types</p>
          <div className="flex flex-col gap-2 text-blue-100 text-sm">
            <Link href="/upcoming?type=Cleanup" className="hover:text-white">Cleanup</Link>
            <Link href="/upcoming?type=Plantation" className="hover:text-white">Plantation</Link>
            <Link href="/upcoming?type=Donation" className="hover:text-white">Donation</Link>
            <Link href="/upcoming?type=Blood Donation" className="hover:text-white">Blood Donation</Link>
            <Link href="/upcoming?type=Education" className="hover:text-white">Education & Teaching</Link>
            <Link href="/upcoming?type=Winter Relief" className="hover:text-white">Winter Relief</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-5 text-center text-sm text-blue-200">
        © 2026 ManobSheba. Sob odhikar songrokkhito. Manobotar sebay.
      </div>
    </footer>
  );
}