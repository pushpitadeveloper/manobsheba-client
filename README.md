# ManobSheba - Manusher Pase, Manobotar Jonno

Live: https://manobsheba-client.vercel.app
Server: https://manobsheba-server.onrender.com

Social Development Events Platform. Manush eksathe poribesh, sikkha, rokto dan ar manobotar sebay kaj kore.

## Features
- Home with banner, features, recent 6 events, gallery, newsletter
- Upcoming with search + type filter (Footer theke click korle filter hoy)
- Event Details public + Join Event
- Create Event with validation + future date check
- Manage My Events - Edit / Delete own events only
- Joined Events - Date onujayi sajano + Leave
- Email + Password + Google Login (BetterAuth)
- Register with Name / Email / photoURL / Password (Upper + Lower + Min 6)
- JWT protected API
- Dark / Light Theme Toggle
- Responsive mobile friendly

## Tech Stack
- Next.js 16 (App Router), Tailwind CSS, BetterAuth, react-hot-toast
- Express, MongoDB, Mongoose, JWT

## Routes
- `/` Home
- `/upcoming` Upcoming Events
- `/events/[id]` Event Details
- `/login` Login
- `/register` Register
- `/create` Create Event (Private)
- `/manage` Manage Events (Private)
- `/joined` Joined Events (Private)
- `/profile` Profile (Private)

## Local Run
```bash
cd manobsheba-client
npm install
npm run dev