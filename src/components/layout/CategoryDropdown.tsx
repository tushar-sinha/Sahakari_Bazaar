"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

interface Category {
  name: string;
  href: string;
}

interface CategoryGroup {
  genre: string;
  categories: Category[];
}

const categoryGroups: CategoryGroup[] = [
  {
    genre: "Grocery & Staples",
    categories: [
      { name: "Atta, Rice & Dal", href: "/products?category=atta-rice-dal" },
      { name: "Oil, Ghee & Masala", href: "/products?category=oil-ghee-masala" },
    ],
  },
  {
    genre: "Fresh & Dairy",
    categories: [
      { name: "Fruits & Vegetables", href: "/products?category=fruits-vegetables" },
      { name: "Dairy, Bread & Eggs", href: "/products?category=dairy-bread-eggs" },
    ],
  },
  {
    genre: "Snacks & Drinks",
    categories: [
      { name: "Snacks & Biscuits", href: "/products?category=snacks-biscuits" },
      { name: "Beverages", href: "/products?category=beverages" },
    ],
  },
  {
    genre: "Home & Lifestyle",
    categories: [
      { name: "Cleaning & Household", href: "/products?category=cleaning-household" },
      { name: "Home & Kitchen", href: "/products?category=home-kitchen" },
      { name: "Beauty & Personal Care", href: "/products?category=beauty-personal-care" },
    ],
  },
  {
    genre: "Electronics & Appliances",
    categories: [
      { name: "Mobile & Laptops", href: "/products?category=mobile-laptops" },
      { name: "Washing Machines", href: "/products?category=washing-machines" },
      { name: "Refrigerators & Freezers", href: "/products?category=refrigerators-freezers" },
    ],
  },
  {
    genre: "Fashion & Clothing",
    categories: [
      { name: "Clothing & Fashion", href: "/products?category=clothing-fashion" },
      { name: "Shoes & Footwear", href: "/products?category=shoes-footwear" },
    ],
  },
];

export function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Detect if mobile based on screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      
      // Update position on scroll and resize
      const handleUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);
      
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      updateDropdownPosition();
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150); // Small delay to allow moving to dropdown
    }
  };

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
  };

  const handleToggle = () => {
    if (isMobile) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={isMobile ? handleToggle : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Browse all categories"
        className="flex items-center gap-2 px-2 py-2 font-medium text-white rounded transition-all duration-200 whitespace-nowrap"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>All</span>
        <FiChevronDown
          size={16}
          className={`transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`fixed min-w-max bg-white rounded-b-xl shadow-2xl border border-gray-100 py-6 px-8 z-[100] transition-all duration-300 ease-out will-change-transform ${
          isOpen
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          transformOrigin: "top left",
          transform: isOpen ? "scaleY(1)" : "scaleY(0.95)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid Layout - 3 columns */}
        <div className="grid grid-cols-3 gap-12 max-w-7xl">
          {categoryGroups.map((group) => (
            <div key={group.genre} className="flex flex-col">
              {/* Genre Header with accent dot */}
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 pb-2 border-b-2 border-green-200">
                <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></span>
                {group.genre}
              </h3>

              {/* Category Links */}
              <ul className="space-y-2">
                {group.categories.map((category) => (
                  <li key={category.href}>
                    <Link
                      href={category.href}
                      onClick={handleItemClick}
                      className="text-sm text-gray-600 hover:text-green-600 hover:font-medium transition-all duration-150 block py-2 px-3 hover:bg-green-50 rounded-md hover:translate-x-1"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Bottom CTA Section */}
        <div className="flex gap-4">
          <Link
            href="/stores"
            className="flex-1 text-sm text-center px-4 py-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold hover:from-green-100 hover:to-emerald-100 transition-all duration-200 hover:shadow-md active:scale-95"
            onClick={handleItemClick}
          >
            📍 Find Nearby Stores
          </Link>
          <Link
            href="/investor-onboarding"
            className="flex-1 text-sm text-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-semibold hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 hover:shadow-md active:scale-95"
            onClick={handleItemClick}
          >
            🤝 Join Community
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[99] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
