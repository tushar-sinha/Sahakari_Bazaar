"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { InvestorFormData } from "@/lib/types";
import {
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiHeart,
} from "react-icons/fi";

const initialForm: InvestorFormData = {
  name: "",
  mobile: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  profession: "",
  investment: "",
  notes: "",
};

export default function InvestorOnboardingPage() {
  const [form, setForm] = useState<InvestorFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          investment: form.investment ? parseFloat(form.investment) : null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        toast.success("Registration successful!");
      } else {
        toast.error(data.error || "Registration failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to Sahakari Bazaar!
          </h1>
          <p className="text-gray-500 mb-8 text-lg">
            Thank you for your interest in joining our cooperative network.
            Our team will contact you within 24-48 hours to discuss the next
            steps.
          </p>
          <div className="bg-green-50 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-green-800 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                Our team will verify your details
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                You&apos;ll receive a call to discuss investment plans
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                Complete KYC and cooperative membership formalities
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={16} />
                Start earning returns from Day 1 of operations
              </li>
            </ul>
          </div>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-block bg-green-50 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          🤝 Join the Cooperative Movement
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Become an Investor Partner
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Like Amul transformed dairy, we&apos;re building India&apos;s largest
          cooperative-based grocery network. Invest, earn returns, and
          empower local communities.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: FiTrendingUp,
            title: "Attractive Returns",
            desc: "18-24% annual returns on your investment",
            color: "bg-blue-50 text-blue-600",
          },
          {
            icon: FiShield,
            title: "Secure Investment",
            desc: "Cooperative model ensures shared risk",
            color: "bg-green-50 text-green-600",
          },
          {
            icon: FiUsers,
            title: "Community Impact",
            desc: "Empower local stores and farmers",
            color: "bg-orange-50 text-orange-600",
          },
          {
            icon: FiHeart,
            title: "Social Good",
            desc: "Build sustainable local economies",
            color: "bg-pink-50 text-pink-600",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="bg-white rounded-xl p-5 border border-gray-100 text-center"
          >
            <div
              className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${b.color}`}
            >
              <b.icon size={22} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Investor Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  pattern="[0-9]{10}"
                  value={form.mobile}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <textarea
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="input-field"
                rows={2}
                placeholder="House/flat no, street, area, landmark..."
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  name="state"
                  required
                  value={form.state}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select State</option>
                  {[
                    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
                    "Chhattisgarh", "Goa", "Gujarat", "Haryana",
                    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
                    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
                    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
                    "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
                    "Uttar Pradesh", "Uttarakhand", "West Bengal",
                    "Delhi", "Chandigarh", "Puducherry",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  pattern="[0-9]{6}"
                  value={form.pincode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession *
                </label>
                <select
                  name="profession"
                  required
                  value={form.profession}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Profession</option>
                  <option value="Business">Business Owner</option>
                  <option value="Professional">Professional (Doctor, Engineer, etc.)</option>
                  <option value="Government">Government Employee</option>
                  <option value="Farmer">Farmer / Agriculturist</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Interest (₹)
                </label>
                <input
                  type="number"
                  name="investment"
                  value={form.investment}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. 50000"
                  min="1000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input-field"
                rows={3}
                placeholder="Any questions or specific interests..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Registration →"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted by our team regarding
              cooperative membership and investment opportunities.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
