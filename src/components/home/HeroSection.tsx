"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="hero-gradient text-gray-900">
      <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-black/20 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              🌾 India&apos;s First Cooperative Grocery Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
              Fresh Groceries,
              <br />
              <span className="text-[#1e40af]">Fair Prices.</span>
            </h1>
            <p className="text-gray-700 text-lg mb-8 max-w-lg leading-relaxed">
              From local cooperative stores to your doorstep. Quality groceries
              at wholesale prices — powered by community, not corporations.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                href="/products"
                className="bg-[#ffd814] text-gray-900 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-[#f0c800] transition-colors active:scale-95 text-center"
              >
                Start Shopping →
              </Link>
              <Link
                href="/investor-onboarding"
                className="border-2 border-gray-900 px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors text-center"
              >
                Join our Community
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 text-sm text-gray-600">
              <span>✅ 10-min delivery</span>
              <span>✅ No minimum order</span>
              <span>✅ Fresh guarantee</span>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative w-80 h-80">
              {/* Decorative circles */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-blue-500/10 rounded-full" />
              <div className="absolute inset-8 bg-blue-600/15 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🛒</div>
                  <div className="font-bold text-xl">Sahakari</div>
                  <div className="text-gray-600 text-sm">Bazaar</div>
                  <div className="mt-3 bg-blue-500/20 rounded-full px-4 py-1 text-xs">
                    Delivering freshness daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
