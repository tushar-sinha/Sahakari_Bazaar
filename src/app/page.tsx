import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import {
  FiTruck,
  FiShield,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const featuredProducts = await prisma.product.findMany({
    take: 12,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const bestDeals = await prisma.product.findMany({
    where: {
      mrp: { gt: 0 },
    },
    include: { category: true },
    orderBy: { price: "asc" },
    take: 8,
  });

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Value Propositions */}
      <section className="max-w-[1400px] mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: FiTruck,
              title: "Free Delivery",
              desc: "On orders above ₹299",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: FiShield,
              title: "Fresh Guarantee",
              desc: "100% quality assured",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: FiUsers,
              title: "Cooperative Model",
              desc: "Community-owned stores",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: FiDollarSign,
              title: "Best Prices",
              desc: "Direct from producers",
              color: "bg-purple-50 text-purple-600",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 flex items-center gap-2 sm:gap-3"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center ${item.color}`}
              >
                <item.icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight">
                  {item.title}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-[1400px] mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="category-card bg-white rounded-xl p-4 text-center border border-gray-100 group"
            >
              <div className="w-20 h-20 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-700 leading-tight">
                {cat.name}
              </h3>
              <span className="text-[10px] text-[var(--color-primary)] font-semibold mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                Shop Now →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🔥 Featured Products
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
            >
              See All →
            </Link>
          </div>
        </div>
        <ProductCarousel products={JSON.parse(JSON.stringify(featuredProducts))} />
      </section>

      {/* Best Deals */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            💰 Best Deals
          </h2>
          <Link
            href="/products"
            className="text-[var(--color-primary)] text-sm font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>
        <ProductCarousel products={JSON.parse(JSON.stringify(bestDeals))} />
      </section>

      {/* Cooperative Banner */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Join the Cooperative Revolution
            </h2>
            <p className="text-green-100 text-lg mb-6 leading-relaxed">
              Like how Amul transformed India&apos;s dairy industry through
              cooperatives, we&apos;re building a community-owned grocery delivery
              network. Invest in your community, earn returns, and help local
              stores thrive.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href="/investor-onboarding"
                className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors text-center"
              >
                Become an Investor →
              </Link>
              <Link
                href="/stores"
                className="border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors text-center"
              >
                Find Nearby Stores
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1400px] mx-auto px-4 mt-12 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "500+", label: "Products Available" },
            { value: "50+", label: "Partner Stores" },
            { value: "10K+", label: "Happy Customers" },
            { value: "25+", label: "Cities Covered" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 text-center border border-gray-100"
            >
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
