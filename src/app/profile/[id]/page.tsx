"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUserPlus,
  FiMessageCircle,
  FiStar,
  FiEdit2,
  FiInstagram,
} from "react-icons/fi";
import { getMockProfileById } from "@/lib/profile-mock-data";
import type { BusinessProfile } from "@/lib/profile-types";
import CommunityBanner from "@/components/profile/CommunityBanner";
import BusinessSection from "@/components/profile/BusinessSection";
import AboutSection from "@/components/profile/AboutSection";
import RatingsSection from "@/components/profile/RatingsSection";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}


type ProfileInfoDraft = {
  businessName: string;
  ownerName: string;
  city: string;
  location: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  profileImage: string;
};

type AboutDraft = {
  bio: string;
  businessType: string;
  serviceCategory?: string;
  state: string;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [isEditingProfileInfo, setIsEditingProfileInfo] = useState(false);
  const [isEditingAboutSection, setIsEditingAboutSection] = useState(false);
  const [profileInfoDraft, setProfileInfoDraft] = useState<ProfileInfoDraft | null>(null);
  const [aboutDraft, setAboutDraft] = useState<AboutDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "about" | "ratings">("products");

  const isOwner = Boolean(
    session?.user?.id &&
      (resolvedParams?.id === session.user.id || profile?.userId === session.user.id)
  );

  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchProfile = async () => {
      try {
        // Try to fetch real store data from the API
        const response = await fetch(`/api/stores/${resolvedParams.id}`);
        
        if (response.ok) {
          const store = await response.json();
          
          // Convert store to business profile
          const businessProfile: BusinessProfile = {
            id: store.id,
            userId: store.id,
            businessName: store.storeName,
            ownerName: store.ownerName,
            businessType: store.category?.includes("Teacher") ? "Creator" : 
                         store.category?.includes("Carpenter") || 
                         store.category?.includes("Plumber") ||
                         store.category?.includes("Electrician") ? "Service" : "Retailer",
            bio: store.bio || `Welcome to ${store.storeName}! We provide quality service in ${store.category || "our field"}. Located in ${store.city}, we have been serving the community with dedication.`,
            profileImage: "/images/categories/store.svg",
            coverImage: "/images/categories/marketplace.jpg",
            location: store.address,
            city: store.city,
            state: store.state,
            pincode: store.pincode,
            phone: store.mobile || "+91-9876-543-210",
            email: store.email || `contact@${store.storeName.replace(/\s+/g, "").toLowerCase()}.com`,
            website: store.website,
            followers: Math.floor(Math.random() * 5000) + 100,
            isFollowing: false,
            communityPosts: [
              {
                id: "1",
                author: store.ownerName,
                content: `Welcome to ${store.storeName}! We're excited to serve you. Visit us at ${store.address}, ${store.city}.`,
                timestamp: new Date(),
                likes: Math.floor(Math.random() * 200),
                comments: Math.floor(Math.random() * 50),
              },
            ],
            products: store.products?.map((product: any) => ({
              id: product.id,
              name: product.name,
              description: product.description || "",
              price: product.price,
              mrp: product.mrp,
              image: product.image,
              category: product.category?.name || "",
              inStock: product.inStock,
            })) || [],
            portfolio: [],
            averageRating: 4.5,
            totalReviews: Math.floor(Math.random() * 500) + 50,
            ratingBreakdown: {
              fiveStar: 45,
              fourStar: 28,
              threeStar: 15,
              twoStar: 8,
              oneStar: 4,
            },
            topReviews: [
              {
                id: "1",
                reviewer: "Customer",
                rating: 5,
                comment: "Great service! Highly recommended.",
                date: new Date(),
                helpful: 45,
              },
            ],
          };
          
          setProfile(businessProfile);
          setIsFollowing(false);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("Store not found, using mock data...");
      }
      
      // Fall back to mock data
      const fetchedProfile = getMockProfileById(resolvedParams.id);
      const ownerFallbackProfile =
        session?.user?.id === resolvedParams.id
          ? {
              ...fetchedProfile,
              ownerName: session.user.name ?? fetchedProfile.ownerName,
              email: session.user.email ?? fetchedProfile.email,
              id: resolvedParams.id,
              userId: resolvedParams.id,
              businessName:
                fetchedProfile.businessName ||
                `${session.user.name ?? "Your"} Service`,
            }
          : fetchedProfile;

      setProfile(ownerFallbackProfile);
      setIsFollowing(ownerFallbackProfile.isFollowing);
      setLoading(false);
    };

    fetchProfile();
  }, [resolvedParams, session]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleEditProfileInfo = () => {
    if (!profile) return;
    setProfileInfoDraft({
      businessName: profile.businessName || "",
      ownerName: profile.ownerName || "",
      city: profile.city || "",
      location: profile.location || "",
      pincode: profile.pincode || "",
      phone: profile.phone || "",
      email: profile.email || "",
      website: profile.website || "",
      profileImage: profile.profileImage || "",
    });
    setIsEditingProfileInfo(true);
  };

  const handleSaveProfileInfo = async () => {
    if (!profile || !profileInfoDraft || !resolvedParams) return;
    setSaving(true);
    setSaveError(null);

    const payload = {
      businessName: profileInfoDraft.businessName,
      ownerName: profileInfoDraft.ownerName,
      city: profileInfoDraft.city,
      location: profileInfoDraft.location,
      pincode: profileInfoDraft.pincode,
      phone: profileInfoDraft.phone,
      email: profileInfoDraft.email,
      website: profileInfoDraft.website,
      profileImage: profileInfoDraft.profileImage,
    };

    try {
      const response = await fetch(`/api/stores/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setSaveError(data.error || "Unable to save profile info.");
        return;
      }

      setProfile({
        ...profile,
        businessName: profileInfoDraft.businessName,
        ownerName: profileInfoDraft.ownerName,
        city: profileInfoDraft.city,
        location: profileInfoDraft.location,
        pincode: profileInfoDraft.pincode,
        phone: profileInfoDraft.phone,
        email: profileInfoDraft.email,
        website: profileInfoDraft.website,
        profileImage: profileInfoDraft.profileImage,
      });
      setIsEditingProfileInfo(false);
      setProfileInfoDraft(null);
    } catch (error) {
      console.error(error);
      setSaveError("Unable to save profile info.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfileInfo = () => {
    setIsEditingProfileInfo(false);
    setProfileInfoDraft(null);
  };

  const handleEditAboutSection = () => {
    if (!profile) return;
    setAboutDraft({
      bio: profile.bio,
      businessType: profile.businessType,
      serviceCategory: profile.serviceCategory,
      state: profile.state,
    });
    setIsEditingAboutSection(true);
  };

  const handleSaveAboutSection = async () => {
    if (!profile || !aboutDraft || !resolvedParams) return;
    setSaving(true);
    setSaveError(null);

    const payload = {
      businessType: aboutDraft.businessType,
      serviceCategory: aboutDraft.serviceCategory,
      state: aboutDraft.state,
      bio: aboutDraft.bio,
    };

    try {
      const response = await fetch(`/api/stores/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setSaveError(data.error || "Unable to save about section.");
        return;
      }

      setProfile({
        ...profile,
        bio: aboutDraft.bio,
        businessType: aboutDraft.businessType,
        serviceCategory: aboutDraft.serviceCategory,
        state: aboutDraft.state,
      });
      setIsEditingAboutSection(false);
      setAboutDraft(null);
    } catch (error) {
      console.error(error);
      setSaveError("Unable to save about section.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAboutSection = () => {
    setIsEditingAboutSection(false);
    setAboutDraft(null);
  };

  const handleProfileInfoDraftChange = (
    field: keyof ProfileInfoDraft,
    value: string
  ) => {
    setProfileInfoDraft((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  const safeDraftValue = (value: string | undefined | null) => value ?? "";

  const handleAboutDraftChange = (field: keyof AboutDraft, value: string) => {
    setAboutDraft((current) =>
      current ? { ...current, [field]: value } : current
    );
  };

  return (
    <main className="min-h-screen relative bg-slate-50">
      <div className="relative z-10">
      <CommunityBanner />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Message */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {isOwner ? (
            <p className="text-sm text-slate-700 font-medium">
              ✨ This is your public service profile. Customize it to showcase your offerings and help nearby customers find you.
            </p>
          ) : session?.user ? (
            <p className="text-sm text-slate-700 font-medium">
              Viewing a public service profile. This page shows the business details and offerings for this local provider.
            </p>
          ) : (
            <p className="text-sm text-slate-700 font-medium">
              Sign in to manage your own service profile.
            </p>
          )}
          {saveError ? (
            <div className="mt-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {saveError}
            </div>
          ) : null}
        </div>

        {/* Profile Header - Horizontal Layout */}
        <div className="mb-10 relative rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border border-blue-100/50 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Profile Image and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-200">
                <img
                  src={profile?.profileImage || "/images/categories/store.svg"}
                  alt={profile?.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="mb-2">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Fresh Valley Organic Store</p>
                <h1 className="text-4xl font-bold text-slate-900 mb-1">
                  {profile?.businessName}
                </h1>
                <p className="text-lg text-slate-600">{profile?.ownerName}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 my-6 py-4 border-t border-b border-blue-200/50">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-slate-900">{profile?.followers.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Followers</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-yellow-500">{profile?.averageRating.toFixed(1)}★</p>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Rating</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-green-600">5 yrs</p>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Service</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                    isFollowing
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  }`}
                >
                  {isFollowing ? "✓ Following" : "Follow"}
                </button>
                <button className="px-6 py-2.5 rounded-lg bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-500 transition-all shadow-md">
                  💬 Message
                </button>
              </div>
            </div>

            {/* Contact Info - Right Side */}
            <div className="md:flex-shrink-0 md:w-72 text-sm md:text-right">
              <div className="space-y-3">
                <div className="flex md:flex-row-reverse items-start gap-2">
                  <FiMapPin className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <div className="md:text-right">
                    <p className="font-semibold text-slate-900">{profile?.city}</p>
                    <p className="text-slate-600">{profile?.location}</p>
                  </div>
                </div>
                <div className="flex md:flex-row-reverse items-center gap-2">
                  <FiPhone className="text-green-600 flex-shrink-0" size={18} />
                  <a href={`tel:${profile?.phone}`} className="text-blue-600 hover:underline font-medium">
                    {profile?.phone}
                  </a>
                </div>
                <div className="flex md:flex-row-reverse items-center gap-2">
                  <FiMail className="text-purple-600 flex-shrink-0" size={18} />
                  <a href={`mailto:${profile?.email}`} className="text-blue-600 hover:underline font-medium">
                    {profile?.email}
                  </a>
                </div>
                {profile?.website && (
                  <div className="flex md:flex-row-reverse items-center gap-2">
                    <FiInstagram className="text-pink-600 flex-shrink-0" size={18} />
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleEditProfileInfo}
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 shadow-sm"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {isEditingProfileInfo && profileInfoDraft && (
          <div className="mb-8 rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Profile Details</h2>
                  <p className="text-sm text-slate-600">Update your public service profile information visible to nearby users.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Business Name
                  <input
                    value={safeDraftValue(profileInfoDraft.businessName)}
                    onChange={(e) => handleProfileInfoDraftChange("businessName", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Owner Name
                  <input
                    value={safeDraftValue(profileInfoDraft.ownerName)}
                    onChange={(e) => handleProfileInfoDraftChange("ownerName", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  City
                  <input
                    value={safeDraftValue(profileInfoDraft.city)}
                    onChange={(e) => handleProfileInfoDraftChange("city", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Address
                  <input
                    value={safeDraftValue(profileInfoDraft.location)}
                    onChange={(e) => handleProfileInfoDraftChange("location", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Pincode
                  <input
                    value={safeDraftValue(profileInfoDraft.pincode)}
                    onChange={(e) => handleProfileInfoDraftChange("pincode", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Phone
                  <input
                    value={safeDraftValue(profileInfoDraft.phone)}
                    onChange={(e) => handleProfileInfoDraftChange("phone", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                  <input
                    value={safeDraftValue(profileInfoDraft.email)}
                    onChange={(e) => handleProfileInfoDraftChange("email", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                  Website
                  <input
                    value={safeDraftValue(profileInfoDraft.website)}
                    onChange={(e) => handleProfileInfoDraftChange("website", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
                  Cover / Profile Image URL
                  <input
                    value={safeDraftValue(profileInfoDraft.profileImage)}
                    onChange={(e) => handleProfileInfoDraftChange("profileImage", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  onClick={handleCancelProfileInfo}
                  disabled={saving}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfileInfo}
                  disabled={saving}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 flex border-b border-slate-300">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-4 font-bold text-base transition-all relative ${
              activeTab === "products"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📦 Products
            {activeTab === "products" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-6 py-4 font-bold text-base transition-all relative ${
              activeTab === "about"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ℹ️ About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("ratings")}
            className={`px-6 py-4 font-bold text-base transition-all relative ${
              activeTab === "ratings"
                ? "text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⭐ Ratings
            {activeTab === "ratings" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            {/* Products Tab */}
            {activeTab === "products" && (
              <BusinessSection profile={profile} isOwner={isOwner} />
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <AboutSection
                profile={profile}
                editable={isOwner}
                isEditing={isEditingAboutSection}
                draft={aboutDraft}
                isSaving={saving}
                onEdit={handleEditAboutSection}
                onDraftChange={handleAboutDraftChange}
                onSave={handleSaveAboutSection}
                onCancel={handleCancelAboutSection}
              />
            )}

            {/* Ratings Tab */}
            {activeTab === "ratings" && (
              <RatingsSection profile={profile} />
            )}
          </div>
        </div>
      </div>
      </div>  {/* Close content wrapper div */}
    </main>
  );
}
