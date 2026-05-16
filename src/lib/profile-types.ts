// ─── Business Profile Types ────────────────────────────────────────

export type BusinessType = 'Retailer' | 'Service' | 'Creator' | 'Wholesaler';
export type ServiceCategory = 'Carpenter' | 'Plumber' | 'Electrician' | 'Designer' | 'Other';

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  businessType: BusinessType;
  serviceCategory?: ServiceCategory;
  bio: string;
  profileImage: string;
  coverImage: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website?: string;
  followers: number;
  isFollowing: boolean;
  
  // Community section
  communityPosts: CommunityPost[];
  
  // Business section
  products?: Product[];
  portfolio?: PortfolioItem[];
  
  // Ratings
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  topReviews: Review[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: Date;
}

export interface RatingBreakdown {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}
