import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbUrl = process.env.DATABASE_URL ?? `file:${path.join(__dirname, "sahakari.db")}`;

const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Categories ──────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "fruits-vegetables" },
      update: {},
      create: { name: "Fruits & Vegetables", slug: "fruits-vegetables", image: "/images/categories/fruits-vegetables.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "dairy-bread-eggs" },
      update: {},
      create: { name: "Dairy, Bread & Eggs", slug: "dairy-bread-eggs", image: "/images/categories/dairy.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "atta-rice-dal" },
      update: {},
      create: { name: "Atta, Rice & Dal", slug: "atta-rice-dal", image: "/images/categories/atta-rice.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "oil-ghee-masala" },
      update: {},
      create: { name: "Oil, Ghee & Masala", slug: "oil-ghee-masala", image: "/images/categories/oil-masala.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "snacks-biscuits" },
      update: {},
      create: { name: "Snacks & Biscuits", slug: "snacks-biscuits", image: "/images/categories/snacks.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "beverages" },
      update: {},
      create: { name: "Beverages", slug: "beverages", image: "/images/categories/beverages.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "cleaning-household" },
      update: {},
      create: { name: "Cleaning & Household", slug: "cleaning-household", image: "/images/categories/cleaning.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "personal-care" },
      update: {},
      create: { name: "Personal Care", slug: "personal-care", image: "/images/categories/personal-care.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "home-kitchen" },
      update: {},
      create: { name: "Home & Kitchen", slug: "home-kitchen", image: "/images/categories/home-kitchen.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "beauty-personal-care" },
      update: {},
      create: { name: "Beauty & Personal Care", slug: "beauty-personal-care", image: "/images/categories/beauty-personal-care.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "clothing-shoes-jewelry" },
      update: {},
      create: { name: "Clothing, Shoes & Jewelry", slug: "clothing-shoes-jewelry", image: "/images/categories/clothing-shoes-jewelry.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "electronics-accessories" },
      update: {},
      create: { name: "Electronics & Accessories", slug: "electronics-accessories", image: "/images/categories/electronics-accessories.svg" },
    }),
    prisma.category.upsert({
      where: { slug: "grocery-gourmet-food" },
      update: {},
      create: { name: "Grocery & Gourmet Food", slug: "grocery-gourmet-food", image: "/images/categories/grocery-gourmet-food.svg" },
    }),
  ]);

  // ── Store Partners (demo) ───────────────────────────────────────────
  const store1 = await prisma.storePartner.upsert({
    where: { mobile: "9876543210" },
    update: {},
    create: {
      storeName: "Sahakari Kirana Store",
      ownerName: "Rajesh Patel",
      mobile: "9876543210",
      email: "rajesh@sahakari.com",
      address: "Shop 12, Market Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      latitude: 18.5204,
      longitude: 73.8567,
      category: "grocery",
    },
  });

  const store2 = await prisma.storePartner.upsert({
    where: { mobile: "9876543211" },
    update: {},
    create: {
      storeName: "Green Fresh Mart",
      ownerName: "Anita Sharma",
      mobile: "9876543211",
      email: "anita@greenfresh.com",
      address: "45, MG Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411002",
      latitude: 18.5314,
      longitude: 73.8446,
      category: "grocery",
    },
  });

  const store3 = await prisma.storePartner.upsert({
    where: { mobile: "9876543212" },
    update: {},
    create: {
      storeName: "Desi Organics",
      ownerName: "Vikram Singh",
      mobile: "9876543212",
      email: "vikram@desiorganics.com",
      address: "78, FC Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      latitude: 18.5270,
      longitude: 73.8410,
      category: "grocery",
    },
  });

  // More stores spread across Pune metro area (within 20km)
  const additionalStores = [
    {
      storeName: "Koregaon Park Grocers",
      ownerName: "Meera Deshmukh",
      mobile: "9876543213",
      email: "meera@kpgrocers.com",
      address: "Lane 5, Koregaon Park",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      latitude: 18.5362,
      longitude: 73.8930,
      category: "grocery",
    },
    {
      storeName: "Baner Fresh Market",
      ownerName: "Suresh Kulkarni",
      mobile: "9876543214",
      email: "suresh@banerfresh.com",
      address: "Baner Road, Near Highway",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411045",
      latitude: 18.5590,
      longitude: 73.7868,
      category: "grocery",
    },
    {
      storeName: "Hadapsar Sahakari Store",
      ownerName: "Priya Jadhav",
      mobile: "9876543215",
      email: "priya@hadapsarstore.com",
      address: "Magarpatta City, Hadapsar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411028",
      latitude: 18.5089,
      longitude: 73.9260,
      category: "grocery",
    },
    {
      storeName: "Wakad Daily Needs",
      ownerName: "Amit Pawar",
      mobile: "9876543216",
      address: "Datta Mandir Road, Wakad",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      latitude: 18.5979,
      longitude: 73.7630,
      category: "grocery",
    },
    {
      storeName: "Kothrud Kirana Center",
      ownerName: "Sunita Bhosale",
      mobile: "9876543217",
      address: "Paud Road, Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038",
      latitude: 18.5074,
      longitude: 73.8077,
      category: "grocery",
    },
    {
      storeName: "Viman Nagar Express Mart",
      ownerName: "Rahul Chavan",
      mobile: "9876543218",
      address: "Dutta Nagar, Viman Nagar",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411014",
      latitude: 18.5679,
      longitude: 73.9143,
      category: "grocery",
    },
    {
      storeName: "Hinjewadi IT Park Store",
      ownerName: "Kavita Mane",
      mobile: "9876543219",
      address: "Phase 1, Hinjewadi",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411057",
      latitude: 18.5912,
      longitude: 73.7380,
      category: "grocery",
    },
    {
      storeName: "Sinhagad Road Bazaar",
      ownerName: "Ganesh Patil",
      mobile: "9876543220",
      address: "Vadgaon Budruk, Sinhagad Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411041",
      latitude: 18.4760,
      longitude: 73.8190,
      category: "grocery",
    },
    {
      storeName: "Aundh Fresh Fare",
      ownerName: "Deepa Rao",
      mobile: "9876543221",
      address: "ITI Road, Aundh",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411007",
      latitude: 18.5580,
      longitude: 73.8086,
      category: "grocery",
    },
    {
      storeName: "Kondhwa Green Grocers",
      ownerName: "Farhan Sheikh",
      mobile: "9876543222",
      address: "NIBM Road, Kondhwa",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411048",
      latitude: 18.4637,
      longitude: 73.8945,
      category: "grocery",
    },
    // Stores outside 20km radius (for demo - these will show as 'outside radius')
    {
      storeName: "Lonavala Hill Mart",
      ownerName: "Ravi Thakur",
      mobile: "9876543223",
      address: "Main Bazaar, Lonavala",
      city: "Lonavala",
      state: "Maharashtra",
      pincode: "410401",
      latitude: 18.7546,
      longitude: 73.4062,
      category: "grocery",
    },
    {
      storeName: "Talegaon Cooperative Store",
      ownerName: "Nilesh More",
      mobile: "9876543224",
      address: "Station Road, Talegaon",
      city: "Talegaon Dabhade",
      state: "Maharashtra",
      pincode: "410507",
      latitude: 18.7350,
      longitude: 73.6757,
      category: "grocery",
    },
  ];

  for (const s of additionalStores) {
    await prisma.storePartner.upsert({
      where: { mobile: s.mobile },
      update: {},
      create: s,
    });
  }

  // ── Products ────────────────────────────────────────────────────────
  const productsData = [
    // Fruits & Vegetables
    { name: "Fresh Tomatoes", slug: "fresh-tomatoes", price: 40, mrp: 50, unit: "1 kg", image: "/images/products/tomato.svg", categorySlug: "fruits-vegetables", storeId: store1.id },
    { name: "Green Capsicum", slug: "green-capsicum", price: 60, mrp: 80, unit: "500 g", image: "/images/products/capsicum.svg", categorySlug: "fruits-vegetables", storeId: store1.id },
    { name: "Onions", slug: "onions", price: 35, mrp: 45, unit: "1 kg", image: "/images/products/onion.svg", categorySlug: "fruits-vegetables", storeId: store2.id },
    { name: "Potatoes", slug: "potatoes", price: 30, mrp: 40, unit: "1 kg", image: "/images/products/potato.svg", categorySlug: "fruits-vegetables", storeId: store2.id },
    { name: "Fresh Bananas", slug: "fresh-bananas", price: 45, mrp: 55, unit: "1 dozen", image: "/images/products/banana.svg", categorySlug: "fruits-vegetables", storeId: store1.id },
    { name: "Apples (Shimla)", slug: "apples-shimla", price: 180, mrp: 220, unit: "1 kg", image: "/images/products/apple.svg", categorySlug: "fruits-vegetables", storeId: store3.id },
    // Dairy
    { name: "Amul Toned Milk", slug: "amul-toned-milk", price: 28, mrp: 30, unit: "500 ml", image: "/images/products/milk.svg", categorySlug: "dairy-bread-eggs", storeId: store1.id },
    { name: "Amul Butter", slug: "amul-butter", price: 56, mrp: 58, unit: "100 g", image: "/images/products/butter.svg", categorySlug: "dairy-bread-eggs", storeId: store1.id },
    { name: "Brown Bread", slug: "brown-bread", price: 40, mrp: 45, unit: "400 g", image: "/images/products/bread.svg", categorySlug: "dairy-bread-eggs", storeId: store2.id },
    { name: "Farm Eggs", slug: "farm-eggs", price: 72, mrp: 85, unit: "12 pcs", image: "/images/products/eggs.svg", categorySlug: "dairy-bread-eggs", storeId: store2.id },
    { name: "Paneer (Fresh)", slug: "paneer-fresh", price: 90, mrp: 110, unit: "200 g", image: "/images/products/paneer.svg", categorySlug: "dairy-bread-eggs", storeId: store3.id },
    { name: "Curd (Dahi)", slug: "curd-dahi", price: 30, mrp: 35, unit: "400 g", image: "/images/products/curd.svg", categorySlug: "dairy-bread-eggs", storeId: store1.id },
    // Atta, Rice & Dal
    { name: "Aashirvaad Atta", slug: "aashirvaad-atta", price: 280, mrp: 320, unit: "5 kg", image: "/images/products/atta.svg", categorySlug: "atta-rice-dal", storeId: store1.id },
    { name: "Basmati Rice", slug: "basmati-rice", price: 320, mrp: 380, unit: "5 kg", image: "/images/products/rice.svg", categorySlug: "atta-rice-dal", storeId: store2.id },
    { name: "Toor Dal", slug: "toor-dal", price: 140, mrp: 165, unit: "1 kg", image: "/images/products/dal.svg", categorySlug: "atta-rice-dal", storeId: store1.id },
    { name: "Moong Dal", slug: "moong-dal", price: 120, mrp: 145, unit: "1 kg", image: "/images/products/moong-dal.svg", categorySlug: "atta-rice-dal", storeId: store3.id },
    // Oil, Ghee & Masala
    { name: "Fortune Sunflower Oil", slug: "fortune-sunflower-oil", price: 140, mrp: 160, unit: "1 L", image: "/images/products/oil.svg", categorySlug: "oil-ghee-masala", storeId: store1.id },
    { name: "Amul Ghee", slug: "amul-ghee", price: 560, mrp: 600, unit: "1 L", image: "/images/products/ghee.svg", categorySlug: "oil-ghee-masala", storeId: store2.id },
    { name: "MDH Garam Masala", slug: "mdh-garam-masala", price: 72, mrp: 85, unit: "100 g", image: "/images/products/masala.svg", categorySlug: "oil-ghee-masala", storeId: store1.id },
    { name: "Turmeric Powder", slug: "turmeric-powder", price: 45, mrp: 55, unit: "200 g", image: "/images/products/turmeric.svg", categorySlug: "oil-ghee-masala", storeId: store3.id },
    // Snacks & Biscuits
    { name: "Lays Classic Salted", slug: "lays-classic-salted", price: 20, mrp: 20, unit: "52 g", image: "/images/products/chips.svg", categorySlug: "snacks-biscuits", storeId: store1.id },
    { name: "Parle-G Biscuits", slug: "parle-g-biscuits", price: 10, mrp: 10, unit: "80 g", image: "/images/products/biscuit.svg", categorySlug: "snacks-biscuits", storeId: store2.id },
    { name: "Haldirams Namkeen", slug: "haldirams-namkeen", price: 45, mrp: 50, unit: "200 g", image: "/images/products/namkeen.svg", categorySlug: "snacks-biscuits", storeId: store1.id },
    { name: "Oreo Cookies", slug: "oreo-cookies", price: 30, mrp: 30, unit: "120 g", image: "/images/products/oreo.svg", categorySlug: "snacks-biscuits", storeId: store3.id },
    // Beverages
    { name: "Coca Cola", slug: "coca-cola", price: 40, mrp: 40, unit: "750 ml", image: "/images/products/cola.svg", categorySlug: "beverages", storeId: store1.id },
    { name: "Tata Tea Gold", slug: "tata-tea-gold", price: 180, mrp: 210, unit: "500 g", image: "/images/products/tea.svg", categorySlug: "beverages", storeId: store2.id },
    { name: "Nescafe Coffee", slug: "nescafe-coffee", price: 220, mrp: 250, unit: "200 g", image: "/images/products/coffee.svg", categorySlug: "beverages", storeId: store1.id },
    { name: "Real Juice (Mango)", slug: "real-juice-mango", price: 95, mrp: 110, unit: "1 L", image: "/images/products/juice.svg", categorySlug: "beverages", storeId: store3.id },
    // Cleaning
    { name: "Surf Excel Detergent", slug: "surf-excel-detergent", price: 120, mrp: 140, unit: "1 kg", image: "/images/products/detergent.svg", categorySlug: "cleaning-household", storeId: store1.id },
    { name: "Vim Dishwash Bar", slug: "vim-dishwash-bar", price: 30, mrp: 35, unit: "200 g", image: "/images/products/dishwash.svg", categorySlug: "cleaning-household", storeId: store2.id },
    { name: "Harpic Toilet Cleaner", slug: "harpic-toilet-cleaner", price: 85, mrp: 99, unit: "500 ml", image: "/images/products/cleaner.svg", categorySlug: "cleaning-household", storeId: store1.id },
    // Personal Care
    { name: "Dove Soap", slug: "dove-soap", price: 48, mrp: 55, unit: "100 g", image: "/images/products/soap.svg", categorySlug: "personal-care", storeId: store1.id },
    { name: "Colgate Toothpaste", slug: "colgate-toothpaste", price: 95, mrp: 110, unit: "200 g", image: "/images/products/toothpaste.svg", categorySlug: "personal-care", storeId: store2.id },
    { name: "Head & Shoulders Shampoo", slug: "head-shoulders-shampoo", price: 190, mrp: 220, unit: "340 ml", image: "/images/products/shampoo.svg", categorySlug: "personal-care", storeId: store3.id },

    // ── Home & Kitchen ─────────────────────────────────────────────────
    { name: "Philips Air Fryer", slug: "philips-air-fryer", price: 8999, mrp: 12999, unit: "1 pc", image: "/images/products/air-fryer.svg", categorySlug: "home-kitchen", storeId: store1.id },
    { name: "Borosil Storage Containers Set", slug: "borosil-storage-containers", price: 1299, mrp: 1599, unit: "24 pcs", image: "/images/products/storage-containers.svg", categorySlug: "home-kitchen", storeId: store2.id },
    { name: "Prestige Induction Cooktop", slug: "prestige-induction-cooktop", price: 2499, mrp: 3499, unit: "1 pc", image: "/images/products/induction-cooktop.svg", categorySlug: "home-kitchen", storeId: store3.id },
    { name: "Milton Thermosteel Bottle", slug: "milton-thermosteel-bottle", price: 899, mrp: 1199, unit: "1 L", image: "/images/products/water-bottle.svg", categorySlug: "home-kitchen", storeId: store1.id },
    { name: "Bamboo Cutting Board Set", slug: "bamboo-cutting-board", price: 599, mrp: 899, unit: "3 pcs", image: "/images/products/cutting-board.svg", categorySlug: "home-kitchen", storeId: store2.id },
    { name: "KitchenAid Stand Mixer", slug: "kitchenaid-stand-mixer", price: 29999, mrp: 39999, unit: "1 pc", image: "/images/products/stand-mixer.svg", categorySlug: "home-kitchen", storeId: store3.id },

    // ── Beauty & Personal Care ─────────────────────────────────────────
    { name: "The Body Shop Vitamin C Serum", slug: "body-shop-vitamin-c-serum", price: 1899, mrp: 2299, unit: "30 ml", image: "/images/products/vitamin-c-serum.svg", categorySlug: "beauty-personal-care", storeId: store1.id },
    { name: "Himalaya Neem Face Wash", slug: "himalaya-neem-face-wash", price: 149, mrp: 175, unit: "150 ml", image: "/images/products/neem-face-wash.svg", categorySlug: "beauty-personal-care", storeId: store2.id },
    { name: "L'Oreal Paris Shampoo", slug: "loreal-paris-shampoo", price: 299, mrp: 349, unit: "340 ml", image: "/images/products/loreal-shampoo.svg", categorySlug: "beauty-personal-care", storeId: store3.id },
    { name: "Maybelline Lash Sensational Mascara", slug: "maybelline-mascara", price: 399, mrp: 499, unit: "1 pc", image: "/images/products/mascara.svg", categorySlug: "beauty-personal-care", storeId: store1.id },
    { name: "Nivea Body Lotion", slug: "nivea-body-lotion", price: 199, mrp: 249, unit: "200 ml", image: "/images/products/body-lotion.svg", categorySlug: "beauty-personal-care", storeId: store2.id },
    { name: "Gillette Mach3 Razor", slug: "gillette-mach3-razor", price: 149, mrp: 199, unit: "1 pc", image: "/images/products/razor.svg", categorySlug: "beauty-personal-care", storeId: store3.id },

    // ── Clothing, Shoes & Jewelry ─────────────────────────────────────
    { name: "Levi's Men's Slim Fit Jeans", slug: "levis-slim-fit-jeans", price: 2999, mrp: 3999, unit: "1 pc", image: "/images/products/jeans.svg", categorySlug: "clothing-shoes-jewelry", storeId: store1.id },
    { name: "Nike Air Max Sneakers", slug: "nike-air-max-sneakers", price: 8999, mrp: 11999, unit: "1 pair", image: "/images/products/sneakers.svg", categorySlug: "clothing-shoes-jewelry", storeId: store2.id },
    { name: "Zara Women's Cotton T-Shirt", slug: "zara-cotton-tshirt", price: 1299, mrp: 1999, unit: "1 pc", image: "/images/products/tshirt.svg", categorySlug: "clothing-shoes-jewelry", storeId: store3.id },
    { name: "H&M Hoodie", slug: "hm-hoodie", price: 1999, mrp: 2499, unit: "1 pc", image: "/images/products/hoodie.svg", categorySlug: "clothing-shoes-jewelry", storeId: store1.id },
    { name: "Puma Sports Shoes", slug: "puma-sports-shoes", price: 3499, mrp: 4999, unit: "1 pair", image: "/images/products/sports-shoes.svg", categorySlug: "clothing-shoes-jewelry", storeId: store2.id },
    { name: "Fossil Leather Watch", slug: "fossil-leather-watch", price: 7999, mrp: 11999, unit: "1 pc", image: "/images/products/watch.svg", categorySlug: "clothing-shoes-jewelry", storeId: store3.id },

    // ── Electronics & Accessories ─────────────────────────────────────
    { name: "Apple AirPods Pro", slug: "apple-airpods-pro", price: 24900, mrp: 27900, unit: "1 pc", image: "/images/products/airpods.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Samsung Galaxy Watch 5", slug: "samsung-galaxy-watch5", price: 29999, mrp: 34999, unit: "1 pc", image: "/images/products/smartwatch.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "Sony WH-1000XM4 Headphones", slug: "sony-wh1000xm4-headphones", price: 29990, mrp: 34990, unit: "1 pc", image: "/images/products/headphones.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "Anker Power Bank", slug: "anker-power-bank", price: 1999, mrp: 2999, unit: "1 pc", image: "/images/products/power-bank.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "JBL Go 3 Portable Speaker", slug: "jbl-go3-speaker", price: 2999, mrp: 3999, unit: "1 pc", image: "/images/products/speaker.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "USB-C to USB Cable", slug: "usb-c-cable", price: 299, mrp: 499, unit: "1 m", image: "/images/products/usb-cable.svg", categorySlug: "electronics-accessories", storeId: store3.id },

    // ── Grocery & Gourmet Food ────────────────────────────────────────
    { name: "Organic Almonds", slug: "organic-almonds", price: 899, mrp: 1099, unit: "500 g", image: "/images/products/almonds.svg", categorySlug: "grocery-gourmet-food", storeId: store1.id },
    { name: "Kellogg's Corn Flakes", slug: "kelloggs-corn-flakes", price: 299, mrp: 349, unit: "500 g", image: "/images/products/corn-flakes.svg", categorySlug: "grocery-gourmet-food", storeId: store2.id },
    { name: "Amul Cheese Slices", slug: "amul-cheese-slices", price: 149, mrp: 179, unit: "200 g", image: "/images/products/cheese-slices.svg", categorySlug: "grocery-gourmet-food", storeId: store3.id },
    { name: "Hershey's Chocolate Syrup", slug: "hersheys-chocolate-syrup", price: 199, mrp: 249, unit: "623 g", image: "/images/products/chocolate-syrup.svg", categorySlug: "grocery-gourmet-food", storeId: store1.id },
    { name: "Quaker Oats", slug: "quaker-oats", price: 199, mrp: 249, unit: "1 kg", image: "/images/products/oats.svg", categorySlug: "grocery-gourmet-food", storeId: store2.id },
    { name: "Nutella Hazelnut Spread", slug: "nutella-spread", price: 399, mrp: 499, unit: "350 g", image: "/images/products/nutella.svg", categorySlug: "grocery-gourmet-food", storeId: store3.id },

    // ── Electronics & Accessories (expanded) ──────────────────────────
    { name: "iPhone 15 Pro", slug: "iphone-15-pro", price: 99999, mrp: 109900, unit: "1 pc", image: "/images/products/smartphone.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", price: 74999, mrp: 79999, unit: "1 pc", image: "/images/products/smartphone.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "Samsung 65\" QLED Smart TV", slug: "samsung-65-qled-tv", price: 65999, mrp: 89999, unit: "1 pc", image: "/images/products/smart-tv.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "MacBook Air M3 (2024)", slug: "macbook-air-m3", price: 114999, mrp: 134900, unit: "1 pc", image: "/images/products/laptop.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Dell Inspiron 15 Laptop", slug: "dell-inspiron-15", price: 54999, mrp: 67999, unit: "1 pc", image: "/images/products/laptop.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "Apple iPad (10th Gen)", slug: "apple-ipad-10th-gen", price: 34900, mrp: 44900, unit: "1 pc", image: "/images/products/tablet.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "Logitech MX Master 3 Mouse", slug: "logitech-mx-master-3", price: 7495, mrp: 9995, unit: "1 pc", image: "/images/products/mouse.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Keychron K2 Wireless Keyboard", slug: "keychron-k2-keyboard", price: 6995, mrp: 8495, unit: "1 pc", image: "/images/products/keyboard.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "Dell 27\" 4K UHD Monitor", slug: "dell-27-4k-monitor", price: 29999, mrp: 38999, unit: "1 pc", image: "/images/products/monitor.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "Samsung 870 EVO SSD 1TB", slug: "samsung-870-evo-ssd-1tb", price: 6299, mrp: 7999, unit: "1 TB", image: "/images/products/ssd.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "GoPro Hero 12 Black", slug: "gopro-hero-12-black", price: 35000, mrp: 44500, unit: "1 pc", image: "/images/products/action-camera.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "Kindle Paperwhite (2023)", slug: "kindle-paperwhite-2023", price: 13999, mrp: 16999, unit: "1 pc", image: "/images/products/kindle.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "Mi 65W Fast Charger", slug: "mi-65w-fast-charger", price: 999, mrp: 1499, unit: "1 pc", image: "/images/products/wireless-charger.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Logitech C920 HD Webcam", slug: "logitech-c920-webcam", price: 6495, mrp: 7995, unit: "1 pc", image: "/images/products/webcam.svg", categorySlug: "electronics-accessories", storeId: store2.id },
    { name: "SanDisk 128GB USB Pendrive", slug: "sandisk-128gb-pendrive", price: 799, mrp: 1199, unit: "128 GB", image: "/images/products/pendrive.svg", categorySlug: "electronics-accessories", storeId: store3.id },
    { name: "Amazon Echo Dot (5th Gen)", slug: "amazon-echo-dot-5", price: 4499, mrp: 5499, unit: "1 pc", image: "/images/products/smart-speaker.svg", categorySlug: "electronics-accessories", storeId: store1.id },
    { name: "Philips Smart LED Bulb 10W", slug: "philips-smart-led-bulb", price: 599, mrp: 899, unit: "1 pc", image: "/images/products/smart-bulb.svg", categorySlug: "electronics-accessories", storeId: store2.id },

    // ── Home & Kitchen (expanded) ─────────────────────────────────────
    { name: "Philips Hand Blender 600W", slug: "philips-hand-blender", price: 1999, mrp: 2999, unit: "1 pc", image: "/images/products/blender.svg", categorySlug: "home-kitchen", storeId: store3.id },
    { name: "Morphy Richards Electric Kettle", slug: "morphy-richards-kettle", price: 1499, mrp: 1999, unit: "1 pc", image: "/images/products/electric-kettle.svg", categorySlug: "home-kitchen", storeId: store1.id },
    { name: "Prestige Aluminium Pressure Cooker 5L", slug: "prestige-pressure-cooker-5l", price: 1799, mrp: 2499, unit: "5 L", image: "/images/products/pressure-cooker.svg", categorySlug: "home-kitchen", storeId: store2.id },
    { name: "Cello Non-Stick Pan Set", slug: "cello-non-stick-pan-set", price: 1299, mrp: 1799, unit: "4 pcs", image: "/images/products/pan-set.svg", categorySlug: "home-kitchen", storeId: store3.id },

    // ── Grocery & Gourmet Food (expanded) ─────────────────────────────
    { name: "Happilo Premium Cashews", slug: "happilo-premium-cashews", price: 599, mrp: 799, unit: "500 g", image: "/images/products/cashews.svg", categorySlug: "grocery-gourmet-food", storeId: store1.id },
    { name: "Dabur Honey 100% Pure", slug: "dabur-honey", price: 199, mrp: 249, unit: "500 g", image: "/images/products/honey.svg", categorySlug: "grocery-gourmet-food", storeId: store2.id },
    { name: "Skippy Creamy Peanut Butter", slug: "skippy-creamy-peanut-butter", price: 399, mrp: 499, unit: "462 g", image: "/images/products/peanut-butter.svg", categorySlug: "grocery-gourmet-food", storeId: store3.id },
    { name: "Monster Energy Drink", slug: "monster-energy-drink", price: 150, mrp: 180, unit: "500 ml", image: "/images/products/energy-drink.svg", categorySlug: "grocery-gourmet-food", storeId: store1.id },
    { name: "Pillsbury Maida All-Purpose Flour", slug: "pillsbury-maida-flour", price: 55, mrp: 65, unit: "1 kg", image: "/images/products/flour.svg", categorySlug: "grocery-gourmet-food", storeId: store2.id },

    // ── Clothing, Shoes & Jewelry (expanded) ──────────────────────────
    { name: "Fabindia Handloom Cotton Kurta", slug: "fabindia-cotton-kurta", price: 1495, mrp: 1995, unit: "1 pc", image: "/images/products/kurta.svg", categorySlug: "clothing-shoes-jewelry", storeId: store1.id },
    { name: "Woodland Men's Formal Shoes", slug: "woodland-formal-shoes", price: 3499, mrp: 4999, unit: "1 pair", image: "/images/products/formal-shoes.svg", categorySlug: "clothing-shoes-jewelry", storeId: store2.id },
    { name: "Wildcraft Backpack 30L", slug: "wildcraft-backpack-30l", price: 1999, mrp: 2999, unit: "1 pc", image: "/images/products/backpack.svg", categorySlug: "clothing-shoes-jewelry", storeId: store3.id },
    { name: "Tommy Hilfiger Leather Belt", slug: "tommy-hilfiger-leather-belt", price: 1299, mrp: 1799, unit: "1 pc", image: "/images/products/belt.svg", categorySlug: "clothing-shoes-jewelry", storeId: store1.id },
    { name: "Ray-Ban Aviator Sunglasses", slug: "ray-ban-aviator-sunglasses", price: 3990, mrp: 5990, unit: "1 pc", image: "/images/products/sunglasses.svg", categorySlug: "clothing-shoes-jewelry", storeId: store2.id },

    // ── Beauty & Personal Care (expanded) ─────────────────────────────
    { name: "Biotique Bio Papaya Face Scrub", slug: "biotique-papaya-scrub", price: 149, mrp: 199, unit: "75 g", image: "/images/products/scrub.svg", categorySlug: "beauty-personal-care", storeId: store3.id },
    { name: "WOW Skin Science Onion Hair Oil", slug: "wow-onion-hair-oil", price: 349, mrp: 449, unit: "200 ml", image: "/images/products/hair-oil.svg", categorySlug: "beauty-personal-care", storeId: store1.id },
    { name: "Minimalist SPF 50 Sunscreen", slug: "minimalist-spf50-sunscreen", price: 449, mrp: 599, unit: "50 ml", image: "/images/products/sunscreen.svg", categorySlug: "beauty-personal-care", storeId: store2.id },

    // ── Fruits & Vegetables (expanded) ────────────────────────────────
    { name: "Sweet Corn", slug: "sweet-corn", price: 40, mrp: 55, unit: "4 pcs", image: "/images/products/corn.svg", categorySlug: "fruits-vegetables", storeId: store1.id },
    { name: "Fresh Watermelon", slug: "fresh-watermelon", price: 80, mrp: 100, unit: "1 pc (~2 kg)", image: "/images/products/watermelon.svg", categorySlug: "fruits-vegetables", storeId: store2.id },
    { name: "Alphonso Mangoes", slug: "alphonso-mangoes", price: 349, mrp: 449, unit: "1 kg", image: "/images/products/mango.svg", categorySlug: "fruits-vegetables", storeId: store3.id },
    { name: "Fresh Baby Spinach", slug: "fresh-baby-spinach", price: 28, mrp: 38, unit: "250 g", image: "/images/products/spinach.svg", categorySlug: "fruits-vegetables", storeId: store1.id },

    // ── Dairy, Bread & Eggs (expanded) ────────────────────────────────
    { name: "Britannia Fruit Cake", slug: "britannia-fruit-cake", price: 50, mrp: 55, unit: "60 g", image: "/images/products/cake.svg", categorySlug: "dairy-bread-eggs", storeId: store2.id },
  ];

  for (const p of productsData) {
    const cat = categories.find(
      (c) => c.slug === p.categorySlug
    );
    if (!cat) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        mrp: p.mrp,
        unit: p.unit,
        image: p.image,
        categoryId: cat.id,
        storeId: p.storeId,
      },
    });
  }

  // ── Demo Investor ────────────────────────────────────────────────────
  await prisma.investor.upsert({
    where: { mobile: "9999999999" },
    update: {},
    create: {
      name: "Demo Investor",
      mobile: "9999999999",
      email: "demo@sahakari.com",
      address: "123, Demo Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      profession: "Entrepreneur",
      investment: 50000,
      notes: "Seed demo investor",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
