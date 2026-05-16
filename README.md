# Sahakari Bazaar 🛒

**India's First Cooperative-Based Online Grocery Delivery Platform**

Like how Amul transformed India's dairy industry through cooperatives, Sahakari Bazaar is building a community-owned grocery delivery network that empowers local stores and serves communities at fair prices.

---

## How to Run (For Everyone)

### Just double-click `run.bat`

That's it! The app will:
- Install Node.js automatically if needed (using the included installer)
- Set up the database with demo products, categories, and stores
- Open the app in your browser at **http://localhost:3000**

> **First time?** If Node.js isn't installed, the installer will open automatically.
> Just click "Next" through all screens, then close the black window and
> double-click `run.bat` again.

### Troubleshooting

| Problem | Solution |
|---|---|
| "Node.js is not installed" | The installer should launch automatically. Install it, then run `run.bat` again |
| Browser doesn't open | Manually open **http://localhost:3000** in Chrome/Edge |
| Port 3000 already in use | `run.bat` handles this automatically |
| App shows errors | Close the black window and double-click `run.bat` again |
| Map doesn't show stores | Allow location access when the browser asks |

---

## What's Inside the App

| Page | What It Does |
|---|---|
| **Home** | Hero banner, product categories, featured products, daily deals |
| **Products** | Browse & filter grocery products by category |
| **Product Detail** | Single product page with add-to-cart |
| **Cart** | Add/remove items, see total with savings |
| **Checkout** | Place order with delivery address |
| **Wishlist** | Save products for later |
| **Orders** | View order history |
| **Returns / Orders** | Initiate returns |
| **Mobility** | Book cabs, bikes, and trucks with live map tracking |
| **Nearby Stores** | See partner stores on a map near your location |
| **Investor Onboarding** | Register as a cooperative investor (saved to database) |
| **Sign In / Sign Up** | Account authentication |
| **Account** | Manage profile, change password, export/delete account |
| **Profile** | Public profile with posts, ratings, business info |
| **Create Product** | Add a new product listing (store partners) |

---

## What's Included — Nothing Else to Install!

| Item | Included? | Notes |
|---|---|---|
| Source code | ✅ | Complete application |
| node_modules (all libraries) | ✅ | Pre-installed, no internet needed |
| Database | ✅ | SQLite — auto-created on first run |
| Demo data (products, stores) | ✅ | Auto-loaded on first run |
| Node.js installer | ✅ | `node-v24.14.0-x64.msi` — auto-launched if needed |
| **Internet required to run?** | ❌ | **No** — runs 100% offline after Node.js is installed |

The full `node_modules` folder is included. As long as Node.js is installed (the included MSI handles this), the app runs completely offline.

---

## Hosting / Deployment (When Ready to Go Live)

When you want to put this online for public access:

### Option 1: Vercel (Easiest — Free)
1. Create a free account at [vercel.com](https://vercel.com)
2. Push code to GitHub
3. Connect the GitHub repo on Vercel
4. Click "Deploy" — done!
> For production, switch from SQLite to Vercel Postgres or Supabase (free tier available).

### Option 2: Railway (Simple — $5/month)
1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repo → it auto-detects Next.js and deploys

### Option 3: Render (Free tier available)
1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build command: `npm run build`, Start command: `npm start`

### Option 4: VPS / Cloud Server (Full control)
Deploy on any Linux server (AWS, DigitalOcean, etc.):
```bash
git clone <your-repo-url>
cd ECommerce
npm install
npm run build
npm start
```
Use **nginx** as reverse proxy + **PM2** to keep it running.

> For all hosting options, consider migrating from SQLite to PostgreSQL for production scale.

---

## For Developers

### Manual Setup
```bash
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```
Or one-liner: `npm run setup && npm run dev`

### Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Prisma ORM + SQLite** | Database (zero config, no server needed) |
| **NextAuth.js** | Authentication (JWT sessions) |
| **Zustand** | Client-side state management (cart, mobility) |
| **Leaflet** | Interactive maps for store locations and ride tracking |
| **bcryptjs** | Password hashing |
| **react-hot-toast** | In-app notifications |
| **react-icons** | Icon library |

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List all products |
| `POST` | `/api/products` | Create a new product (auth required) |
| `GET` | `/api/categories` | List categories with product count |
| `GET` | `/api/stores?lat=&lng=` | List stores; filter by proximity when coords provided |
| `GET, PUT` | `/api/stores/[id]` | Get or update a single store |
| `GET` | `/api/investors` | List all investors |
| `POST` | `/api/investors` | Register new investor |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | List orders |
| `POST` | `/api/auth/signup` | Register a new customer account |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth sign-in / session |
| `PUT` | `/api/account/update` | Update account details |
| `POST` | `/api/account/change-password` | Change password |
| `GET` | `/api/account/export` | Export account data |
| `POST` | `/api/account/delete` | Delete account |
| `GET, POST` | `/api/mobility/bookings` | List or create a mobility booking |
| `GET, POST` | `/api/mobility/drivers/match` | Query available or match nearest drivers |
| `GET, POST` | `/api/mobility/locations/track` | Get or push live location updates |
| `GET, POST` | `/api/mobility/reviews` | List or submit ride reviews |
| `PATCH` | `/api/mobility/rides/[rideId]/status` | Update ride status |

### Project Structure

```
ECommerce/
├── run.bat                          # Double-click to start!
├── node-v24.14.0-x64.msi           # Node.js installer
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Demo data
├── public/                          # Images and icons
└── src/
    ├── app/                         # Pages and API routes
    │   ├── api/                     # REST API handlers
    │   │   ├── account/             # Profile update, password, export, delete
    │   │   ├── auth/                # NextAuth + signup
    │   │   ├── categories/          # Product categories
    │   │   ├── investors/           # Investor registration
    │   │   ├── mobility/            # Bookings, drivers, tracking, reviews
    │   │   ├── orders/              # Order creation and listing
    │   │   ├── products/            # Product CRUD
    │   │   ├── profile/             # Blog, community, karma, shop
    │   │   └── stores/              # Store listing and detail
    │   ├── account/                 # Account management page
    │   ├── cart/                    # Cart page
    │   ├── checkout/                # Checkout page
    │   ├── investor-onboarding/     # Investor registration page
    │   ├── mobility/                # Cab/bike/truck booking + live tracking
    │   ├── orders/                  # Order history
    │   ├── products/                # Product listing and detail
    │   ├── profile/                 # Public user profiles
    │   ├── returns-orders/          # Returns flow
    │   ├── signin/ & signup/        # Authentication pages
    │   ├── stores/                  # Nearby stores map
    │   └── wishlist/                # Saved products
    ├── components/
    │   ├── home/                    # Hero section, product carousel
    │   ├── layout/                  # Navbar, footer, category dropdown
    │   ├── mobility/                # Booking form, live map, nearby drivers
    │   ├── products/                # Product card, create form, listing
    │   ├── profile/                 # Profile sections (about, ratings, posts…)
    │   └── stores/                  # Store map
    └── lib/                         # Utilities & types
        ├── auth.ts                  # NextAuth config
        ├── cart-store.ts            # Zustand cart + wishlist store
        ├── mobility-socket.ts       # Socket manager, fare calculator, driver matcher
        ├── mobility-store.ts        # Zustand mobility state
        ├── prisma.ts                # Prisma client singleton
        └── types.ts                 # Shared TypeScript types
```

---

## License

Built for demo/investor presentation purposes. Cooperative e-commerce model.
