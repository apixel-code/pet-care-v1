# সুপ্রীম পেট ক্লিনিক - Supreme Pet Clinic PRD

## Original Problem Statement
Build a fully responsive, modern, SEO-optimized website for a veterinary clinic named "সুপ্রীম পেট ক্লিনিক Supreme Pet Clinic" in Savar, Dhaka, Bangladesh. All visible text in fluent, natural Bengali. Emotional copywriting targeting pet owners' fears and transformation. Multi-page structure with Admin Panel.

## User Personas
1. **Pet Owners in Savar** - Primary users seeking veterinary services, appointments
2. **Clinic Admin** - Manages appointments, blog posts, and messages

## Core Requirements
- Multi-page website (Home, Services, Blog, Contact)
- Bengali (Bangla) UI text throughout
- Emotional, direct-response copywriting
- 24/7 service availability messaging
- Contact: +880 1797-993951, +880 1738-139977
- Address: Savar, Dhaka, Bangladesh
- Admin Panel with password-only authentication

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion
- **Backend**: FastAPI + MongoDB
- **Authentication**: Password-only admin access (no email)

## What's Been Implemented (2026-04-09)
### Frontend Pages
- ✅ Homepage with Hero, Why Us, Services preview, CTA sections
- ✅ Services page with 8 service cards
- ✅ Blog page fetching posts from API
- ✅ Blog detail page
- ✅ Contact page with appointment booking and message forms
- ✅ Admin login page (password: supreme2024)
- ✅ Admin dashboard with Appointments, Blogs, Messages tabs

### Backend APIs
- ✅ `/api/appointments` - CRUD for appointments
- ✅ `/api/blogs` - CRUD for blog posts
- ✅ `/api/messages` - CRUD for messages
- ✅ `/api/admin/login` - Password authentication
- ✅ `/api/admin/verify` - Session verification
- ✅ `/api/admin/stats` - Dashboard statistics

### Features
- ✅ Responsive design (mobile + desktop)
- ✅ Bengali fonts (Baloo Da 2, Hind Siliguri)
- ✅ Smooth animations (Framer Motion)
- ✅ Toast notifications
- ✅ Dropdown selects for forms
- ✅ Blog post seeding on startup

## Prioritized Backlog

### P0 (Critical)
- All core features implemented ✅

### P1 (Important)
- [ ] SEO meta tags in each page
- [ ] Google Maps integration for location
- [ ] Image upload for blog posts
- [ ] Email notifications for new appointments

### P2 (Nice to have)
- [ ] SMS notifications via Twilio
- [ ] Online payment integration
- [ ] Appointment calendar view
- [ ] Multi-language support (English toggle)

## Test Credentials
- **Admin Password**: supreme2024
- **Admin URL**: /admin/login

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn/UI, Framer Motion, Axios
- Backend: FastAPI, Motor (MongoDB async driver), Pydantic
- Database: MongoDB
