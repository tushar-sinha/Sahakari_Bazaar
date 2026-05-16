"use client";

import Image from "next/image";
import { FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";
import type { CommunityPost } from "@/lib/profile-types";
import { useState } from "react";

interface CommunityPostsSectionProps {
  posts: CommunityPost[];
}

export default function CommunityPostsSection({
  posts,
}: CommunityPostsSectionProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📢</span> Community Posts
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Latest updates and insights from our community
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <div key={post.id} className="p-6 hover:bg-gray-50 transition">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">{post.author}</p>
                <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

            {/* Post Image */}
            {post.image && (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={post.image}
                  alt="Post image"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 text-xs">
              <span className="flex items-center gap-1">
                <FiHeart size={16} /> {post.likes} likes
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle size={16} /> {post.comments} comments
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 transition ${
                  likedPosts.has(post.id)
                    ? "text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                <FiHeart
                  size={18}
                  fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <FiMessageCircle size={18} />
                <span className="text-sm">Comment</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                <FiShare2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
