import { FiStar } from "react-icons/fi";
import type { BusinessProfile } from "@/lib/profile-types";

interface RatingsSectionProps {
  profile: BusinessProfile;
}

export default function RatingsSection({ profile }: RatingsSectionProps) {
  const { averageRating, totalReviews, ratingBreakdown, topReviews } = profile;

  // Calculate percentages
  const total =
    ratingBreakdown.fiveStar +
    ratingBreakdown.fourStar +
    ratingBreakdown.threeStar +
    ratingBreakdown.twoStar +
    ratingBreakdown.oneStar;

  const getRatingPercentage = (count: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(0) : 0;
  };

  const RatingBar = ({
    stars,
    count,
  }: {
    stars: number;
    count: number;
  }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-600 w-12">
        {stars}★
      </span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-yellow-400 h-full rounded-full transition-all"
          style={{ width: `${getRatingPercentage(count)}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
    </div>
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#FEF8E0] rounded-xl border border-[#B2AC88]/30 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[#B2AC88]/20">
        <h2 className="text-2xl font-bold text-[#2D5A27] flex items-center gap-2">
          <span className="text-3xl">⭐</span> Trust & Ratings
        </h2>
        <p className="text-[#4a5f47] text-sm mt-1">
          What customers are saying about us
        </p>
      </div>

      <div className="p-6">
        {/* Overall Rating Summary */}
        <div className="bg-gradient-to-r from-[#F7F1E7] to-[#E7E0C5] rounded-lg p-6 mb-8 border border-[#B2AC88]/20">
          <div className="text-center mb-4">
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={32}
                  fill={i < Math.round(averageRating) ? "#FBBF24" : "#E5E7EB"}
                  stroke="none"
                />
              ))}
            </div>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {averageRating.toFixed(1)}
            </p>
            <p className="text-gray-600">
              Based on {totalReviews.toLocaleString()} reviews
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Rating Breakdown
          </h3>
          <div className="space-y-3">
            <RatingBar stars={5} count={ratingBreakdown.fiveStar} />
            <RatingBar stars={4} count={ratingBreakdown.fourStar} />
            <RatingBar stars={3} count={ratingBreakdown.threeStar} />
            <RatingBar stars={2} count={ratingBreakdown.twoStar} />
            <RatingBar stars={1} count={ratingBreakdown.oneStar} />
          </div>
        </div>

        {/* Top Reviews */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Reviews
          </h3>
          <div className="space-y-4">
            {topReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-[#2D5A27]">
                      {review.reviewer}
                    </p>
                    <p className="text-xs text-[#6c7a5e]">
                      {formatDate(review.date)}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={16}
                        fill={
                          i < review.rating ? "#FBBF24" : "#E5E7EB"
                        }
                        stroke="none"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <button className="hover:text-blue-600 transition">
                    👍 Helpful ({review.helpful})
                  </button>
                  <button className="hover:text-red-600 transition">
                    👎 Not Helpful
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Reviews Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button className="text-blue-600 hover:text-blue-700 font-semibold transition">
            View all {totalReviews} reviews →
          </button>
        </div>
      </div>
    </div>
  );
}
