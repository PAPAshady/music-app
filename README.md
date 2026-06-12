# VioTune 🎧

A full-stack music streaming platform built with React and Supabase, featuring real-time playback, recommendations, synced lyrics, and a role-based admin system.

🌐 Live Demo: https://muzik-site.netlify.app  
📊 Admin Dashboard: https://viotune-dashboard.netlify.app  
📦 Admin Repo: https://github.com/papashady/viotune-dashboard  

---

## ✨ Overview

VioTune is a modern music streaming platform where users can discover, play, and manage music with a personalized experience.

It includes a complete backend powered by Supabase and a separate admin system for content management and analytics.

The goal of this project was to simulate a real-world production architecture with scalable frontend state management and backend integration.

---

## ⚙️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Redux Toolkit
- TanStack Query
- Tailwind CSS 4
- Framer Motion
- Swiper
- React Hook Form
- Zod

### Backend (Supabase)
- Authentication (Email/Password + Google + GitHub OAuth)
- PostgreSQL Database
- File Storage (audio, images, avatars)
- Row Level Security (RLS)

---

## 🔥 Core Features

### 🎵 Music Experience
- Full music playback system (songs, albums, playlists)
- Playlist creation, editing, and deletion (user-specific data)
- Favorites system for songs and albums
- Global search across all music entities
- Genre and artist metadata browsing

---

### 🧠 Recommendation System
A hybrid recommendation engine combining:

- User behavior (recent plays, favorites)
- Metadata similarity (genres, artists, tags)
- Rule-based logic (trending songs, albums, playlists)

---

### 🎤 Synced Lyrics System
- Timestamp-based synced lyrics stored in database
- Auto-highlighting of current lyric line during playback
- Manual lyric navigation toggle
- Smooth sing-along experience

---

### 👤 Authentication & User System
- Email/password authentication
- Google OAuth
- GitHub OAuth
- User profile customization (avatar + metadata)
- Secure Supabase Row Level Security (RLS)

---

### 🧭 UI & State Architecture
- Complex UI state managed with Redux Toolkit
- URL-synced state for navigation-aware UI behavior
- Server state handled with TanStack Query
- Responsive UI with animations (Framer Motion)

---

## 🛠 Admin System (Separate Repository)

A dedicated admin dashboard for managing platform content and analytics:

- CRUD operations for songs, albums, artists, genres
- Analytics dashboard
- Role-based access control (Admin / Super Admin)
- Separate frontend + deployment

📦 Repo: https://github.com/papashady/viotune-dashboard  
🌐 Live: https://viotune-dashboard.netlify.app  

---

## 🧱 Architecture Highlights

- Supabase as full backend solution (DB + Auth + Storage)
- Role-based access control (User / Admin / Super Admin)
- Separation of user-facing app and admin system
- Scalable music entity modeling
- Hybrid state management (Redux + React Query)

---

## 🚧 Challenges Solved

- Building recommendation system without ML tools
- Implementing synced lyrics with timestamp precision
- Managing complex UI state across routes
- Designing Supabase RLS for multi-role security
- Coordinating frontend + backend architecture alone

---

## 📌 What This Project Demonstrates

- Full-stack application design
- Production-style authentication flows
- Advanced frontend state management
- Backend integration with Supabase
- Real-world feature engineering and system design
