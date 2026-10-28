# THE GENTLEMEN — Premium Barbershop & Grooming Studio

A portfolio-grade commercial website and interactive appointment booking experience for an upscale men's barbershop and grooming studio based in Zamalek, Cairo.

Built strictly with **modern semantic HTML5, CSS3, Vanilla JavaScript (ES6+), and Bootstrap 5**, without React, Tailwind, or backend database dependencies.

---

## 💈 Brand Identity & Design System

- **Brand Name:** THE GENTLEMEN
- **Tagline:** Fine Grooming Studio & Heritage Sanctuary
- **Location:** 14 El-Gezira Street, Zamalek, Cairo, Egypt
- **Visual Aesthetic:** Modern classic luxury, editorial typography, dark charcoal and warm espresso tones with muted bronze accents and warm ivory contrast panels.

### Color Palette
| Color | Hex | Role |
| :--- | :--- | :--- |
| **Charcoal** | `#171714` | Primary deep dark canvas |
| **Deep Charcoal** | `#0F0F0D` | Navbars, headers, and footer background |
| **Dark Espresso** | `#29231E` | Luxury cards, widgets, and sidebar panels |
| **Muted Bronze** | `#B58A56` | Primary accent, metallic trim, CTAs, and active highlights |
| **Bronze Hover** | `#CFA572` | Interactive button hover states |
| **Warm Ivory** | `#F3EDE3` | Editorial contrast sections, crisp serif headers |
| **Muted Ivory** | `#A89F93` | High-legibility body prose |

### Typography
- **Headings & Display:** `Playfair Display` (Google Fonts, serif)
- **Body & Controls:** `Manrope` (Google Fonts, geometric sans-serif)

---

## 🚀 Key Features

### 1. Multi-Page Structure
1. **Home (`index.html`)**
   - Full-width cinematic hero with animated badge and dual CTAs
   - Brand heritage story section with warm ivory editorial contrast
   - Curated featured services grid with direct booking deep-links
   - "Why Discerning Gentlemen Choose Us" architectural value proposition
   - Resident Master Barbers preview with ratings and specialty tags
   - Studio photo gallery grid with hover overlay transitions
   - Patrons' testimonials with identified demo indicators
   - Zamalek studio operating hours, location details, and final booking CTA

2. **Services (`services.html`)**
   - Category filtering pills (*All Services, Haircuts & Styling, Beard Craft, Traditional Shave, Luxury Packages*)
   - Itemized descriptions, duration in minutes, and transparent pricing in Egyptian Pounds (EGP)
   - Feature checklists for every service
   - What every chair session includes (consultation, eucalyptus hot towel, straight razor perimeter, complimentary lounge refreshments)
   - Frequently asked questions accordion

3. **Our Barbers (`barbers.html`)**
   - In-depth profiles for 3 fictional master barbers:
     - **Marcus Vance** — Master Barber & Creative Director (12+ Years Exp)
     - **Julian Thorne** — Senior Fade Specialist & Beard Artisan (8+ Years Exp)
     - **David Sterling** — Traditional Shave Craftsman & Stylist (10+ Years Exp)
   - Working schedules, core specialties tags, and direct "Book with [Name]" deep links
   - "Tools of the Trade" heritage section

4. **Interactive Booking Engine (`booking.html`)**
   - **Step 1: Service Selection** with category tabs, live duration and price preview
   - **Step 2: Barber Selection** with "Any Available Master Barber" or specific craftsman
   - **Step 3: Interactive Calendar** with month/year navigation, disabled past dates, and barber rest days detection
   - **Step 4: Smart Time Slot Generator** calculating barber shifts, service duration fit, demo occupied slots, and browser-saved appointments to prevent collisions
   - **Step 5: Customer Details Form** with real-time regex validation (Name, Email, Phone, Special Notes)
   - **Step 6: Review & Final Confirmation** displaying live receipt breakdown and cancellation policy
   - **Receipt & Confirmation Screen:**
     - Generates unique reference code (`TG-XXXXXX`)
     - Instant `.ics` calendar file download for Google Calendar, Apple Calendar, and Outlook
     - Direct shortcuts to view in "My Bookings" or book another appointment
   - **URL Query Parameters Support:**
     - `?service=<serviceId>` (preselects service)
     - `?barber=<barberId>` (preselects barber)
     - `?reschedule=<refId>` (loads existing appointment to reschedule without duplicate bookings)

5. **My Bookings Dashboard (`my-bookings.html`)**
   - Displays all appointments stored in browser `localStorage`
   - Filter tabs: *All Bookings, Upcoming, Past/Completed, Cancelled*
   - Real-time countdown / date formatting
   - One-click **Rescheduling** (returns to booking wizard with existing details pre-filled)
   - One-click **Cancellation** with confirmation modal dialog
   - Export `.ics` calendar invite per booking
   - Polished empty state with instant "Load Demo Sample Bookings" button
   - Data management controls: "Reset Demo Data" and "Clear All Records"

6. **Contact & Location (`contact.html`)**
   - Studio address, telephone concierge, direct email channels
   - Studio operating hours breakdown
   - Interactive contact form with real-time frontend validation
   - Simulated transmission feedback informing user that no real emails are sent
   - Stylized dark placeholder map with direct Google Maps route link

---

## 🛠️ Strict Tech Stack

```text
├── HTML5                 (Semantic tags, ARIA attributes, structured metadata)
├── CSS3                  (Custom properties, Flexbox/Grid, clamp typography)
├── Vanilla JS (ES6+)     (Modular design pattern, event delegation, no frameworks)
├── Bootstrap 5.3.3       (Grid system, utility classes, modal engine via CDN)
└── Bootstrap Icons 1.11  (High-definition vector iconography via CDN)
```

No external runtime packages, TypeScript, React, Tailwind, or backend databases are required.

---

## 📁 Project Directory Structure

```text
portfolio/
├── index.html                   # Home page
├── services.html                # Services menu & pricing
├── barbers.html                 # Barber profiles & team philosophy
├── booking.html                 # 6-step interactive booking engine
├── my-bookings.html             # Client appointment management dashboard
├── contact.html                 # Contact info, inquiry form, and location map
├── README.md                    # Project documentation
│
└── assets/
    ├── css/
    │   ├── style.css            # Design tokens, typography, luxury components
    │   └── responsive.css       # Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+)
    │
    ├── images/
    │   ├── hero-barbershop.webp # Studio hero photography
    │   ├── about-interior.webp  # Heritage lounge interior
    │   ├── service-haircut.webp # Classic haircut & fade photography
    │   ├── service-beard.webp   # Beard trim & line-up photography
    │   ├── service-shave.webp   # Traditional hot towel shave photography
    │   ├── barber-01.webp       # Marcus Vance portrait
    │   ├── barber-02.webp       # Julian Thorne portrait
    │   ├── barber-03.webp       # David Sterling portrait
    │   ├── gallery-01.webp      # Gallery highlight 1
    │   ├── gallery-02.webp      # Gallery highlight 2
    │   └── gallery-03.webp      # Gallery highlight 3
    │
    └── js/
        ├── data.js              # Centralized mock data (services, barbers, seed slots)
        ├── storage.js           # Robust LocalStorage CRUD operations & error handling
        ├── validation.js        # Input sanitization & regex validators with live feedback
        ├── booking.js           # Multi-step wizard engine, calendar & collision checker
        └── main.js              # Global navbar scroll, active links, toasts & modals
```

---

## ⚡ How to Run Locally

Because this is a pure static frontend project, no build step (`npm run build`) or backend setup is required.

### Option 1: Double-click
Simply open `index.html` in any modern web browser (Chrome, Safari, Edge, Firefox).

### Option 2: Using Python's built-in HTTP server
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 3: Using Node / npx
```bash
npx serve .
```

---

## 🚢 Deployment to GitHub Pages or Vercel

### Deploying to GitHub Pages
1. Push the project repository to GitHub.
2. In the GitHub repository settings, navigate to **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose `main` (or `master`) branch and `/ (root)` folder.
5. Click **Save**. The website is live in seconds.

### Deploying to Vercel
1. Run `npx vercel` or import the GitHub repository in your Vercel Dashboard.
2. Leave build command empty (static HTML project).
3. Click **Deploy**.

---

## 🔒 Frontend-Only Demonstration Notice

- **Demo State:** All bookings and form messages created on this website are simulated.
- **Data Persistence:** Reservations are stored exclusively in the browser's `localStorage` under the key `the_gentlemen_bookings_v2`.
- **Payment & Live Synch:** No actual payment is processed and no appointments are synchronized across different devices or external reservation servers.
