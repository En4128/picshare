# PicShare — Curated Photo Expeditions

> A minimalist, editorial-style photo sharing platform built for trips, travel journals, and shared memories.

![PicShare](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)

---

## Overview

**PicShare** lets you create a private expedition archive for any trip, upload photos, and share them with others via a QR code, direct link, or invite code — no account required to view.

Designed with an editorial, curated aesthetic inspired by travel journals.

---

## Features

| Feature | Description |
|---|---|
| 🗺️ **Trip Management** | Create and manage multiple trip archives |
| 📸 **Photo Gallery** | Upload and browse photos in a responsive grid |
| ♡ **Favorites** | Heart photos to save them to your favorites list |
| 🔗 **Share via Link** | Generate a shareable direct link to any trip |
| ⬚ **QR Code Sharing** | Generate and download a scannable QR code |
| 🔑 **Invite Code** | Share a code guests paste at `/join` to enter |
| ☁️ **Cloud Storage** | Photos stored in Supabase Storage |
| 🔐 **Authentication** | Email/password login via Supabase Auth |

---

## Tech Stack

- **Frontend** — React 19, React Router v7, Vanilla CSS
- **Build Tool** — Vite 6
- **Backend / Database** — [Supabase](https://supabase.com) (PostgreSQL + Storage + Auth)
- **QR Code** — `qrcode.react`

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone https://github.com/En4128/picshare.git
cd picshare
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Find these in your Supabase dashboard under **Project Settings → API**.

### 4. Set up Supabase

Run the following in your Supabase **SQL Editor**:

```sql
-- Trips table
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  date_range text,
  status text default 'Live',
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Photos table
create table photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  url text,
  color_hex text,
  created_at timestamptz default now()
);
```

Create a **Storage bucket** named `picshare` and set it to **public**.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
picshare/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   └── Navbar.css
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   └── AuthContext.jsx     # Auth context provider
│   ├── pages/
│   │   ├── Landing.jsx         # Home / hero page
│   │   ├── Login.jsx           # Authentication
│   │   ├── Trips.jsx           # All trips list
│   │   ├── CreateTrip.jsx      # New trip form
│   │   ├── TripDashboard.jsx   # Gallery + photo management
│   │   ├── Favorites.jsx       # Favorited photos
│   │   ├── Upload.jsx          # Drag & drop photo uploader
│   │   ├── SharePage.jsx       # QR / link / code sharing
│   │   └── JoinTrip.jsx        # Join via invite code
│   ├── App.jsx                 # Routes
│   ├── index.css               # Global design system
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Sharing a Trip

There are three ways to share a trip with others:

1. **QR Code** — Open the Share page, show or send the QR image. Guests scan it with any phone camera.
2. **Direct Link** — Copy the URL and send it directly. Opens straight in the gallery.
3. **Invite Code** — Share the trip ID. Guests go to `/join` and paste the code.

> No account is required to **view** a trip. Authentication is only needed to **create** or **upload**.

---

## Favorites

In the Gallery, each photo has a **♡ heart button** in the top-left corner. Click it to toggle the photo as a favorite. Favorited photos appear in the **Favorites** tab.

Favorites are stored in `localStorage` per trip — no database changes required.

---

## Deployment

Build for production:

```bash
npm run build
```

Deploy the `dist/` folder to any static host:

- [Vercel](https://vercel.com) — `vercel --prod`
- [Netlify](https://netlify.com) — drag & drop `dist/`
- [Cloudflare Pages](https://pages.cloudflare.com)

> Set the same environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in your hosting platform's settings.

---

## License

MIT © [En4128](https://github.com/En4128)
