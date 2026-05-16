import Image from "next/image";
import type { BusinessProfile } from "@/lib/profile-types";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

interface ProfileHeaderProps {
  profile: BusinessProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
      {/* Cover Image */}
      <div className="absolute inset-0">
        <Image
          src={profile.coverImage}
          alt={profile.businessName}
          fill
          className="object-cover opacity-40"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent"></div>

      {/* Header Content */}
      <div className="relative h-full flex items-end px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center gap-3 text-white">
          <Link href="/" className="hover:bg-white hover:bg-opacity-10 p-2 rounded-lg transition">
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <p className="text-sm text-blue-100">
              {profile.businessType === "Service"
                ? profile.serviceCategory
                : profile.businessType}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">{profile.businessName}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
