# PicShare — Curated Photo Expeditions

> A minimalist, editorial-style photo sharing platform built for trips, travel journals, and shared memories. Designed to look and feel like an elegant, printed travel archive.

---

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Backend" />
  <img src="https://img.shields.io/badge/React--Router-v7.5.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router v7" />
  <img src="https://img.shields.io/badge/License-MIT-black?style=for-the-badge" alt="MIT License" />
</p>

---

## 🗺️ Overview

**PicShare** allows travelers to create private, high-fidelity visual archives for their expeditions, drag-and-drop photos, and share them instantly with friends, family, or the public via QR codes, direct links, or invite codes. 

No account is required for guests to view or upload to a trip — allowing friction-free sharing in real-time, while preserving full administrative control for the trip host.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Trip Management** | Host-exclusive creation of multiple editorialized trip archives. |
| 📸 **Curated Grid** | Upload and browse photo assets in a clean, masonry-like responsive gallery layout. |
| 🎛️ **Host Controls** | Edit trip titles or delete entire trip logs directly from the collections dashboard. |
| 🤍 **Decentralized Favorites** | Heart photos to save them to a local favorites tab, stored on-device in `localStorage`. |
| 🔗 **Frictionless Sharing** | Generate direct copyable share URLs, scannable QR codes, or short invite codes. |
| ☁️ **Cloud Processing** | Instant asset uploading powered by Supabase Storage with dynamic public link retrieval. |
| 🔐 **Secure Host Auth** | Owner authentication using Supabase email/password login. |

---

## 🎨 Visual System & Aesthetic

The application is styled with **Vanilla CSS** under an **editorial, journal-inspired aesthetic** known as **"The Curated Journal"**.

*   **Typography**: Pairings of the elegant serif **Cormorant Garamond** (for display headings) and clean, geometric **DM Sans** (for body text).
*   **Color Palette**: A soft, low-contrast, warm-neutral theme:
    *   `--clr-bg`: `#f7f5f2` (Warm linen canvas)
    *   `--clr-surface`: `#fdfcfb` (Pure paper)
    *   `--clr-surface-low`: `#f0ede8` (Soft shadow white)
    *   `--clr-ink`: `#1a1916` (Warm charcoal black)
    *   `--clr-accent`: `#007aff` (iOS Royal Blue)
*   **Transitions**: Smooth custom-cubic animations (`cubic-bezier(0.22, 1, 0.36, 1)`) with staggered fade-in delays (`.fade-up-d1` through `.fade-up-d5`) on initial page mounts.

---

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19 (v19.1.0)
*   **Routing**: React Router DOM v7 (v7.5.0)
*   **Build Infrastructure**: Vite 6 (v6.3.1) with `@vitejs/plugin-react`
*   **Database & Auth Provider**: [Supabase](https://supabase.com) (PostgreSQL)
*   **Storage Solution**: Supabase Storage (Object Storage buckets)
*   **Utility Libraries**: `qrcode.react` (client-side QR rendering)

---

## 📂 Project Structure

```text
picshare/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Dynamic navigation bar with user session actions
│   │   └── Navbar.css          # Editorial layout styling for top header
│   ├── lib/
│   │   ├── supabase.js         # Initialized Supabase client with environment fallbacks
│   │   └── AuthContext.jsx     # Global authentication state listener & context provider
│   ├── pages/
│   │   ├── Landing.jsx         # Marketing landing page with hero header and preview cards
│   │   ├── Landing.css         # Layout grids and aesthetics for the homepage
│   │   ├── Login.jsx           # Unified login/signup portal for expedition hosts
│   │   ├── Login.css           # Styling for the host authentication card
│   │   ├── Trips.jsx           # Collections directory for host's archives
│   │   ├── Trips.css           # Grid styles for collection overview cards
│   │   ├── CreateTrip.jsx      # Launch form for new trips with drag-and-drop cover image
│   │   ├── TripDashboard.jsx   # Grid gallery view with statistics and photo deletes
│   │   ├── TripDashboard.css   # Masonry gallery rules and action headers
│   │   ├── Favorites.jsx       # Readout page for items saved in local storage
│   │   ├── Upload.jsx          # Multi-file drag-and-drop uploader with progress tracking
│   │   ├── Upload.css          # File dropzone styles and upload progress animations
│   │   ├── SharePage.jsx       # QR, URL, and invite code hub for sharing trips
│   │   └── JoinTrip.jsx        # Landing page for guests entering short invite codes
│   ├── App.jsx                 # Client-side react-router layout and path declarations
│   ├── index.css               # Global typography system, CSS variables, and utility classes
│   └── main.jsx                # DOM mount entry point
├── index.html                  # Core HTML shell (includes Google Font imports)
├── vite.config.js              # Vite React configuration
├── package.json                # Project dependencies and script runner configurations
└── README.md                   # Project documentation
```

---

## ⚙️ Supabase Integration & Setup

### 1. Database Schema
Run the following SQL script in your Supabase **SQL Editor** to create the required tables:

```sql
-- Trips Table
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  date_range text,
  status text default 'Live',
  cover_url text, -- Store URL for the trip's custom preview header
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Photos Table
create table photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  url text not null,
  color_hex text, -- Stored hexadecimal average for background loading previews
  created_at timestamptz default now()
);
```

### 2. Row Level Security (RLS) Policies
To secure database records while keeping the albums publicly shareable, enable RLS and add the following rules:

#### For `trips` Table:
```sql
alter table trips enable row level security;

-- Policy 1: Anyone (including unauthenticated guests) can view trips
create policy "Allow public read access to trips"
  on trips for select
  using (true);

-- Policy 2: Only logged-in users can create new trips
create policy "Allow authenticated users to insert trips"
  on trips for insert
  with check (auth.role() = 'authenticated');

-- Policy 3: Owners can update their own trips (e.g. changing title)
create policy "Allow owners to update their own trips"
  on trips for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy 4: Owners can delete their own trips
create policy "Allow owners to delete their own trips"
  on trips for delete
  using (auth.uid() = user_id);
```

#### For `photos` Table:
```sql
alter table photos enable row level security;

-- Policy 1: Anyone can view photos
create policy "Allow public read access to photos"
  on photos for select
  using (true);

-- Policy 2: Anyone with the trip link can upload photos to it
create policy "Allow anyone to upload photos to trips"
  on photos for insert
  with check (true);

-- Policy 3: Only the trip owner can delete photos associated with their trip
create policy "Allow trip owners to delete photos"
  on photos for delete
  using (
    exists (
      select 1 from trips
      where trips.id = photos.trip_id
      and trips.user_id = auth.uid()
    )
  );
```

### 3. Storage Bucket Configuration
Create a **Storage Bucket** in your Supabase project named `picshare` and set it to **Public**.

Configure the following bucket policies:
*   **Select (Read)**: Allow public read-only access (select) to all objects.
*   **Insert (Upload)**: Allow public upload access (insert) for guests and hosts to save image assets.
*   **Delete (Remove)**: Allow delete access (delete) for removing unwanted assets.

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org) v18 or higher
*   A running [Supabase](https://supabase.com) project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/En4128/picshare.git
   cd picshare
   ```

2. Install the application dependencies:
   ```bash
   npm install
   ```

3. Configure environmental keys:
   Create a `.env.local` file in the root directory and append your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key...
   ```
   *(You can retrieve these credentials in the Supabase Dashboard under **Project Settings ➔ API**)*

4. Launch the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 💻 Deployment

### 1. Build Compilation
Compile the production-ready static assets:
```bash
npm run build
```
This builds and optimizes the codebase into a static `dist/` directory.

### 2. Uploading to Static Hosts
The build target can be served from any major static provider (Netlify, Vercel, Cloudflare Pages, etc.).

*   **Vercel CLI**:
    ```bash
    npm install -g vercel
    vercel --prod
    ```
*   **Netlify CLI**:
    ```bash
    npm install -g netlify-cli
    netlify deploy --prod --dir=dist
    ```

> [!IMPORTANT]
> Ensure you configure the same environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in your hosting provider's dashboard settings.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by [En4128](https://github.com/En4128).
