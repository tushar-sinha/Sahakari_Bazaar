"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";

interface BannerSlide {
  id: number;
  headline: string;
  subtext: string;
  actionLabel: string;
  actionHref: string;
  imageAlt: string;
  imageDescription: string;
  bgGradient: string;
}

const COMMUNITY_SLIDES: BannerSlide[] = [
  {
    id: 1,
    headline: "Our Streets, Our Responsibility.",
    subtext: "Join our weekly plastic collection drive. Let's keep our neighborhood pristine.",
    actionLabel: "Join the Next Drive",
    actionHref: "#plastic-drive",
    imageAlt: "Community volunteers collecting plastic waste",
    imageDescription: "Plastic Pollution - The Clean-Up",
    bgGradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 2,
    headline: "Lungs of the City.",
    subtext: "We've planted 500 trees this year. Help us reach 1,000 by joining our Saturday planting sessions.",
    actionLabel: "Register to Plant",
    actionHref: "#tree-plantation",
    imageAlt: "Hands planting a tree sapling",
    imageDescription: "Tree Plantation - Urban Greening",
    bgGradient: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    headline: "Your Voice in Our Design.",
    subtext: "Participate in our community town hall to discuss better waste management and pedestrian-friendly zones.",
    actionLabel: "Share Your Ideas",
    actionHref: "#city-planning",
    imageAlt: "Community members discussing plans around a table",
    imageDescription: "City Planning - The Vision",
    bgGradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 4,
    headline: "The Heartbeat of Fresh Valley.",
    subtext: "Monthly updates on our social impact and the stories of the people making it happen.",
    actionLabel: "Read Our Stories",
    actionHref: "#community-stories",
    imageAlt: "Community success stories collage",
    imageDescription: "News & Media - Community Spotlight",
    bgGradient: "from-orange-500 to-red-600",
  },
  {
    id: 5,
    headline: "More Than Neighbors, A Community.",
    subtext: "From organic gardening workshops to weekend flea markets. See what's happening this week.",
    actionLabel: "View Event Calendar",
    actionHref: "#events",
    imageAlt: "Community gathering under string lights",
    imageDescription: "Events & Gatherings - Social Connection",
    bgGradient: "from-purple-500 to-pink-600",
  },
];

export default function CommunityBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % COMMUNITY_SLIDES.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % COMMUNITY_SLIDES.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000); // Resume autoplay after 8 seconds
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + COMMUNITY_SLIDES.length) % COMMUNITY_SLIDES.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const slide = COMMUNITY_SLIDES[currentSlide];

  return (
    <div className="relative w-full h-68 md:h-80 overflow-hidden bg-gray-900">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`}></div>

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Pattern overlay for community feel */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <pattern id="dots" x="10" y="10" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="white" />
          </pattern>
          <rect width="100" height="100" fill="url(#dots)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center px-[40px]">
        {/* Left Side - Text Content */}
        <div className="flex-1 text-white max-w-2xl pl-6 pr-6">
          <div className="mb-2 text-sm font-semibold opacity-90 tracking-wide">
            {slide.imageDescription}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {slide.headline}
          </h2>
          <p className="text-base md:text-lg opacity-95 mb-6 max-w-lg">
            {slide.subtext}
          </p>

          {/* Action Button */}
          <Link
            href={slide.actionHref}
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {slide.actionLabel}
          </Link>
        </div>

        {/* Right Side - Decorative Element */}
        <div className="hidden lg:flex flex-1 items-center justify-center opacity-20 pointer-events-none">
          <div className="text-white text-9xl">🤝</div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors duration-200 z-20"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors duration-200 z-20"
        aria-label="Next slide"
      >
        <FiChevronRight size={32} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {COMMUNITY_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white bg-opacity-50 w-2 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
