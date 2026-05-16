import type {
  BusinessProfile,
  CommunityPost,
  Review,
  RatingBreakdown,
} from "@/lib/profile-types";

// ─── Mock Data for Different Business Types ────────────────────────

const commonRatingBreakdown: RatingBreakdown = {
  fiveStar: 45,
  fourStar: 28,
  threeStar: 15,
  twoStar: 8,
  oneStar: 4,
};

const communityPostsRetailer: CommunityPost[] = [
  {
    id: "1",
    author: "Rajesh Kumar",
    content: "Fresh organic vegetables arrived today! Check our new collection of pesticide-free produce. 🥬",
    image: "/images/categories/vegetables.jpg",
    timestamp: new Date("2024-04-27"),
    likes: 234,
    comments: 45,
  },
  {
    id: "2",
    author: "Rajesh Kumar",
    content: "Special offer this week: 30% off on all dairy products. Limited stock available!",
    image: "/images/categories/dairy.jpg",
    timestamp: new Date("2024-04-25"),
    likes: 156,
    comments: 32,
  },
  {
    id: "3",
    author: "Rajesh Kumar",
    content: "Thank you to all our customers for supporting local farming. Your purchase makes a difference! 💚",
    timestamp: new Date("2024-04-23"),
    likes: 89,
    comments: 18,
  },
];

const communityPostsService: CommunityPost[] = [
  {
    id: "1",
    author: "Arjun Singh",
    content: "Just completed a beautiful wooden wardrobe for a client. Traditional craftsmanship meets modern design! 🪑",
    image: "/images/categories/furniture.jpg",
    timestamp: new Date("2024-04-27"),
    likes: 312,
    comments: 67,
  },
  {
    id: "2",
    author: "Arjun Singh",
    content: "Open for custom orders! Design your own furniture with me. Free consultation call available.",
    timestamp: new Date("2024-04-25"),
    likes: 198,
    comments: 42,
  },
  {
    id: "3",
    author: "Arjun Singh",
    content: "Excited to share my latest project with you all. 3D custom design feature now available!",
    image: "/images/categories/design.jpg",
    timestamp: new Date("2024-04-22"),
    likes: 245,
    comments: 55,
  },
];

const topReviews: Review[] = [
  {
    id: "1",
    reviewer: "Priya Sharma",
    rating: 5,
    comment: "Excellent quality and very responsive. Highly recommend!",
    date: new Date("2024-04-15"),
    helpful: 123,
  },
  {
    id: "2",
    reviewer: "Amit Patel",
    rating: 5,
    comment: "Great customer service and timely delivery. Very happy!",
    date: new Date("2024-04-10"),
    helpful: 98,
  },
  {
    id: "3",
    reviewer: "Neha Gupta",
    rating: 4,
    comment: "Good quality but could improve packaging.",
    date: new Date("2024-04-05"),
    helpful: 67,
  },
];

// ─── Mock Profile: Grocery Retailer ────────────────────────────────

export const mockRetailerProfile: BusinessProfile = {
  id: "profile-001",
  userId: "user-001",
  businessName: "Fresh Valley Organic Store",
  ownerName: "Rajesh Kumar",
  businessType: "Retailer",
  bio: "Providing fresh, organic, and locally-sourced groceries to the community for over 5 years. We believe in supporting local farmers and sustainable farming practices.",
  profileImage: "/images/categories/store.svg",
  coverImage: "/images/categories/vegetables.jpg",
  location: "123 Main Street, Market Complex",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560001",
  phone: "+91-9876-543-210",
  email: "rajesh@freshvalley.com",
  website: "www.freshvalley.com",
  followers: 3421,
  isFollowing: false,
  
  communityPosts: communityPostsRetailer,
  
  products: [
    {
      id: "prod-001",
      name: "Organic Spinach",
      description: "Fresh, pesticide-free spinach",
      price: 45,
      mrp: 60,
      image: "/images/categories/vegetables.jpg",
      category: "Vegetables",
      inStock: true,
    },
    {
      id: "prod-002",
      name: "Free-range Eggs",
      description: "Farm fresh eggs from happy chickens",
      price: 120,
      mrp: 150,
      image: "/images/categories/dairy.jpg",
      category: "Dairy",
      inStock: true,
    },
    {
      id: "prod-003",
      name: "Cow Milk (1L)",
      description: "Pure, unpasteurized cow milk",
      price: 55,
      mrp: 70,
      image: "/images/categories/dairy.jpg",
      category: "Dairy",
      inStock: true,
    },
    {
      id: "prod-004",
      name: "Organic Tomatoes",
      description: "Fresh red tomatoes",
      price: 35,
      mrp: 50,
      image: "/images/categories/vegetables.jpg",
      category: "Vegetables",
      inStock: true,
    },
  ],
  
  averageRating: 4.6,
  totalReviews: 342,
  ratingBreakdown: commonRatingBreakdown,
  topReviews: topReviews,
};

// ─── Mock Profile: Service Provider (Carpenter) ──────────────────

export const mockServiceProfile: BusinessProfile = {
  id: "profile-002",
  userId: "user-002",
  businessName: "Arjun's Custom Carpentry",
  ownerName: "Arjun Singh",
  businessType: "Service",
  serviceCategory: "Carpenter",
  bio: "Master carpenter with 12 years of experience. Specializing in custom wooden furniture, interior design, and renovation. All work is done with premium quality materials and attention to detail.",
  profileImage: "/images/categories/services.jpg",
  coverImage: "/images/categories/furniture.jpg",
  location: "Workshop #42, Craft Lane",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  phone: "+91-9876-123-456",
  email: "arjun@customcarpentry.com",
  website: "www.customcarpentry.com",
  followers: 2156,
  isFollowing: false,
  
  communityPosts: communityPostsService,
  
  portfolio: [
    {
      id: "port-001",
      title: "Modern Wooden Wardrobe",
      description: "Custom wardrobe with walnut finish and soft-close doors",
      image: "/images/categories/furniture.jpg",
      category: "Wardrobes",
      date: new Date("2024-04-20"),
    },
    {
      id: "port-002",
      title: "Dining Table Set",
      description: "6-seater teakwood dining table with chairs",
      image: "/images/categories/furniture.jpg",
      category: "Dining",
      date: new Date("2024-04-15"),
    },
    {
      id: "port-003",
      title: "Custom Kitchen Cabinet",
      description: "Modular kitchen with storage optimization",
      image: "/images/categories/furniture.jpg",
      category: "Kitchen",
      date: new Date("2024-04-10"),
    },
    {
      id: "port-004",
      title: "Office Desk & Shelves",
      description: "L-shaped desk with floating shelves",
      image: "/images/categories/furniture.jpg",
      category: "Office",
      date: new Date("2024-04-05"),
    },
  ],
  
  averageRating: 4.8,
  totalReviews: 156,
  ratingBreakdown: {
    fiveStar: 128,
    fourStar: 22,
    threeStar: 4,
    twoStar: 2,
    oneStar: 0,
  },
  topReviews: topReviews,
};

// ─── Mock Profile: Creator (YouTuber/Content Creator) ───────────

export const mockCreatorProfile: BusinessProfile = {
  id: "profile-003",
  userId: "user-003",
  businessName: "Tech Talks with Priya",
  ownerName: "Priya Verma",
  businessType: "Creator",
  bio: "Tech educator and content creator. I share tutorials on web development, design, and entrepreneurship. Join my community for exclusive courses and mentorship.",
  profileImage: "/images/categories/profile.jpg",
  coverImage: "/images/categories/tech.jpg",
  location: "Delhi",
  city: "Delhi",
  state: "Delhi",
  pincode: "110001",
  phone: "+91-9876-789-012",
  email: "priya@techtalks.com",
  website: "www.techtalks.com",
  followers: 8934,
  isFollowing: false,
  
  communityPosts: [
    {
      id: "1",
      author: "Priya Verma",
      content: "🚀 New video live! 'Building a Full-Stack App with Next.js' - Link in bio. Subscribe for more tech content!",
      timestamp: new Date("2024-04-27"),
      likes: 1234,
      comments: 234,
    },
    {
      id: "2",
      author: "Priya Verma",
      content: "Excited to announce my new course: 'Mastering TypeScript in 30 Days'. Early bird discount available!",
      timestamp: new Date("2024-04-25"),
      likes: 892,
      comments: 156,
    },
    {
      id: "3",
      author: "Priya Verma",
      content: "Thank you all for 8K followers! Let's celebrate with a live Q&A session this Friday at 7 PM IST.",
      timestamp: new Date("2024-04-22"),
      likes: 567,
      comments: 89,
    },
  ],
  
  products: [
    {
      id: "course-001",
      name: "Web Development Masterclass",
      description: "Complete guide to modern web development",
      price: 2999,
      mrp: 4999,
      image: "/images/categories/online-course.jpg",
      category: "Courses",
      inStock: true,
    },
    {
      id: "course-002",
      name: "UI/UX Design Bootcamp",
      description: "Learn design principles and tools",
      price: 1999,
      mrp: 3499,
      image: "/images/categories/design.jpg",
      category: "Courses",
      inStock: true,
    },
  ],
  
  averageRating: 4.9,
  totalReviews: 289,
  ratingBreakdown: {
    fiveStar: 267,
    fourStar: 18,
    threeStar: 3,
    twoStar: 1,
    oneStar: 0,
  },
  topReviews: topReviews,
};

// ─── Function to fetch profile by type (mock) ────────────────────

export function getMockProfileByBusinessType(businessType: string) {
  switch (businessType) {
    case "Service":
      return mockServiceProfile;
    case "Creator":
      return mockCreatorProfile;
    case "Retailer":
    default:
      return mockRetailerProfile;
  }
}

// ─── Function to get mock profile by ID ──────────────────────────

export function getMockProfileById(id: string) {
  const profiles = [
    mockRetailerProfile,
    mockServiceProfile,
    mockCreatorProfile,
  ];
  return profiles.find((p) => p.id === id) || mockRetailerProfile;
}
