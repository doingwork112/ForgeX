export interface BuyerReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  rating: number;
  content: string;
  appName: string;
  createdAt: string;
  verified: boolean;
}

export const buyerReviews: BuyerReview[] = [
  {
    id: "rev-1",
    authorName: "James Park",
    authorAvatar: "JP",
    authorUsername: "jamespark",
    rating: 5,
    content: "InvoiceFlow is exactly what I needed. Clean code, great documentation. Had it deployed and customized in under a day. Alex was also super responsive to a couple questions I had.",
    appName: "InvoiceFlow",
    createdAt: "2026-03-28T10:30:00Z",
    verified: true,
  },
  {
    id: "rev-2",
    authorName: "Lucy Brown",
    authorAvatar: "LB",
    authorUsername: "lucybrown",
    rating: 5,
    content: "Saved me weeks of work. The Stripe integration alone was worth the price. Would buy again from this seller without hesitation.",
    appName: "InvoiceFlow",
    createdAt: "2026-03-20T16:45:00Z",
    verified: true,
  },
  {
    id: "rev-3",
    authorName: "Kevin Lee",
    authorAvatar: "KL",
    authorUsername: "kevinlee",
    rating: 4,
    content: "Really solid codebase. MIT license so I could customize freely. Only minor thing — would love a dark mode option out of the box. Overall great buy.",
    appName: "InvoiceFlow",
    createdAt: "2026-03-15T11:00:00Z",
    verified: true,
  },
  {
    id: "rev-4",
    authorName: "Sophia Martinez",
    authorAvatar: "SM",
    authorUsername: "sophiam",
    rating: 5,
    content: "Delivery was fast, code quality is professional level. This is what ForgeX is all about — you can actually trust the sellers here.",
    appName: "InvoiceFlow",
    createdAt: "2026-03-31T09:00:00Z",
    verified: false,
  },
];

export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  category: string;
  price: number;
  demoUrl: string;
  screenshots: string[];
  videoUrl?: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    sold: number;
  };
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  references: string[];
  budget: number;
  deadline: string | null;
  category: string;
  status: "open" | "in_progress" | "completed";
  submissions: number;
  poster: {
    name: string;
    avatar: string;
  };
}

export const categories = [
  "All",
  "SaaS",
  "E-Commerce",
  "Social",
  "Tools",
  "Restaurant",
  "Booking",
  "Finance",
  "Education",
  "Health",
];

export const techStacks = [
  "Next.js",
  "React",
  "React Native",
  "Flutter",
  "Vue",
  "Node.js",
  "Python",
  "Supabase",
  "Firebase",
  "Stripe",
  "OpenAI",
  "Tailwind CSS",
];

export const apps: App[] = [
  {
    id: "1",
    name: "InvoiceFlow",
    tagline: "AI-powered invoicing for freelancers",
    description:
      "InvoiceFlow automates your entire billing workflow. Generate professional invoices from natural language, track payments in real-time, and send smart reminders that actually get you paid faster.",
    features: [
      "AI invoice generation from text descriptions",
      "Stripe & PayPal payment integration",
      "Automated payment reminders with smart scheduling",
      "Client portal with invoice history",
      "Multi-currency support (50+ currencies)",
      "Tax calculation engine for 30+ countries",
    ],
    techStack: ["Next.js", "Stripe", "OpenAI", "Supabase", "Tailwind CSS"],
    category: "Finance",
    price: 499,
    demoUrl: "https://demo-invoiceflow.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "Alex Chen", avatar: "AC", rating: 4.9, sold: 23 },
  },
  {
    id: "2",
    name: "FitTrackr",
    tagline: "Cross-platform fitness app with social",
    description:
      "FitTrackr is a complete fitness tracking experience. Log workouts, follow AI-generated training plans, compete with friends, and track your progress with detailed analytics.",
    features: [
      "200+ exercise library with video demos",
      "AI-generated workout plans based on goals",
      "Social feed & friend challenges",
      "Apple Health / Google Fit sync",
      "Progress photos with body composition tracking",
      "Push notification reminders",
    ],
    techStack: ["React Native", "Firebase", "Node.js"],
    category: "Health",
    price: 349,
    demoUrl: "https://demo-fittrackr.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "Maria Lopez", avatar: "ML", rating: 4.8, sold: 15 },
  },
  {
    id: "3",
    name: "TableSync",
    tagline: "Restaurant reservation & management system",
    description:
      "TableSync handles everything from online reservations to kitchen workflow. Guests book through a beautiful public page, staff manages seating in real-time, and owners get analytics on every metric that matters.",
    features: [
      "Public booking page with real-time availability",
      "Table layout editor with drag-and-drop",
      "Waitlist management with SMS notifications",
      "Kitchen display system (KDS)",
      "Revenue & occupancy analytics dashboard",
      "Multi-location support",
    ],
    techStack: ["Next.js", "Supabase", "Tailwind CSS", "Stripe"],
    category: "Restaurant",
    price: 599,
    demoUrl: "https://demo-tablesync.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "James Wu", avatar: "JW", rating: 5.0, sold: 8 },
  },
  {
    id: "4",
    name: "ShopBase",
    tagline: "Headless e-commerce starter with admin",
    description:
      "ShopBase is a production-ready headless e-commerce solution. Beautiful storefront, powerful admin dashboard, Stripe checkout, and inventory management — all ready to deploy in minutes.",
    features: [
      "Responsive storefront with product pages",
      "Admin dashboard with order management",
      "Stripe checkout with subscription support",
      "Inventory tracking with low-stock alerts",
      "Customer accounts with order history",
      "SEO-optimized with sitemap generation",
    ],
    techStack: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
    category: "E-Commerce",
    price: 449,
    demoUrl: "https://demo-shopbase.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "Sarah Kim", avatar: "SK", rating: 4.7, sold: 31 },
  },
  {
    id: "5",
    name: "CodeReviewAI",
    tagline: "Automated PR reviewer powered by GPT-4",
    description:
      "CodeReviewAI plugs into your GitHub repos and reviews every pull request automatically. It catches bugs, suggests improvements, enforces style guides, and learns your team's patterns over time.",
    features: [
      "GitHub App — one-click install per repo",
      "Line-by-line code review comments",
      "Custom style guide rules (YAML config)",
      "Security vulnerability detection",
      "Performance anti-pattern flagging",
      "Weekly team quality score report",
    ],
    techStack: ["Next.js", "OpenAI", "Node.js", "Python"],
    category: "Tools",
    price: 699,
    demoUrl: "https://demo-codereviewai.vercel.app",
    screenshots: ["/placeholder-app.svg", "/placeholder-app.svg"],
    seller: { name: "Dev Studio", avatar: "DS", rating: 4.9, sold: 42 },
  },
  {
    id: "6",
    name: "BookEase",
    tagline: "Appointment booking for service businesses",
    description:
      "BookEase lets your clients book appointments through a clean public page. Manage your calendar, accept payments, send automated reminders, and reduce no-shows by 60%.",
    features: [
      "Customizable public booking page",
      "Google Calendar & Outlook sync",
      "Stripe payment collection at booking",
      "SMS & email reminders (automated)",
      "Staff management with individual schedules",
      "Analytics: bookings, revenue, no-show rate",
    ],
    techStack: ["Next.js", "Supabase", "Stripe", "Tailwind CSS"],
    category: "Booking",
    price: 399,
    demoUrl: "https://demo-bookease.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "Olivia Park", avatar: "OP", rating: 4.8, sold: 19 },
  },
  {
    id: "7",
    name: "LearnHub",
    tagline: "Online course platform with video hosting",
    description:
      "LearnHub is a complete LMS. Create courses with video lessons, quizzes, and certificates. Students get a beautiful learning experience, creators get powerful analytics and Stripe payouts.",
    features: [
      "Course builder with drag-and-drop lessons",
      "Video hosting with adaptive streaming",
      "Quiz engine with auto-grading",
      "Certificate generation (PDF)",
      "Student progress tracking",
      "Stripe Connect for creator payouts",
    ],
    techStack: ["Next.js", "Firebase", "Stripe", "Tailwind CSS"],
    category: "Education",
    price: 549,
    demoUrl: "https://demo-learnhub.vercel.app",
    screenshots: [
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
      "/placeholder-app.svg",
    ],
    seller: { name: "Ryan Torres", avatar: "RT", rating: 4.6, sold: 11 },
  },
  {
    id: "8",
    name: "ChatDesk",
    tagline: "Customer support chat with AI auto-replies",
    description:
      "ChatDesk embeds a chat widget on your site and routes conversations to your team. The AI assistant handles common questions automatically, escalating to humans only when needed.",
    features: [
      "Embeddable chat widget (one script tag)",
      "AI auto-replies trained on your docs",
      "Team inbox with assignment & tags",
      "Canned responses library",
      "Customer satisfaction surveys",
      "Slack & email integration",
    ],
    techStack: ["React", "Node.js", "OpenAI", "Supabase"],
    category: "SaaS",
    price: 379,
    demoUrl: "https://demo-chatdesk.vercel.app",
    screenshots: ["/placeholder-app.svg", "/placeholder-app.svg"],
    seller: { name: "Nina Patel", avatar: "NP", rating: 4.7, sold: 27 },
  },
];

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  totalSold: number;
  totalRevenue: number;
  joinedAt: string;
  appIds: string[];
}

export interface Order {
  id: string;
  appId: string;
  appName: string;
  appPrice: number;
  buyerName: string;
  buyerEmail: string;
  buyerAvatar: string;
  platformFee: number;
  sellerEarnings: number;
  status: "pending_delivery" | "delivered" | "complete";
  createdAt: string;
  deliveryUrl?: string;
}

export const sellers: Seller[] = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    avatar: "AC",
    bio: "Full-stack developer specializing in SaaS products. 5+ years building production apps with Next.js and Supabase.",
    rating: 4.9,
    totalSold: 23,
    totalRevenue: 11477,
    joinedAt: "2025-06-01",
    appIds: ["1"],
  },
  {
    id: "sarah-kim",
    name: "Sarah Kim",
    avatar: "SK",
    bio: "E-commerce specialist. Built 30+ Shopify alternatives and headless commerce solutions for clients worldwide.",
    rating: 4.7,
    totalSold: 31,
    totalRevenue: 13919,
    joinedAt: "2025-04-15",
    appIds: ["4"],
  },
  {
    id: "dev-studio",
    name: "Dev Studio",
    avatar: "DS",
    bio: "Boutique dev agency. We build developer tools and AI-powered SaaS apps. All code is tested, documented, and production-ready.",
    rating: 4.9,
    totalSold: 42,
    totalRevenue: 29358,
    joinedAt: "2025-01-10",
    appIds: ["5"],
  },
  {
    id: "nina-patel",
    name: "Nina Patel",
    avatar: "NP",
    bio: "Product engineer with a focus on real-time communication apps. Previously at Intercom.",
    rating: 4.7,
    totalSold: 27,
    totalRevenue: 10233,
    joinedAt: "2025-07-20",
    appIds: ["8"],
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord-001",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "James Park",
    buyerEmail: "james.park@example.com",
    buyerAvatar: "JP",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "complete",
    createdAt: "2026-03-28T10:30:00Z",
    deliveryUrl: "https://github.com/alexchen/invoiceflow-delivery",
  },
  {
    id: "ord-002",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "Rachel Green",
    buyerEmail: "rachel.g@example.com",
    buyerAvatar: "RG",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "delivered",
    createdAt: "2026-03-26T14:20:00Z",
    deliveryUrl: "https://github.com/alexchen/invoiceflow-delivery",
  },
  {
    id: "ord-003",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "Tom Wilson",
    buyerEmail: "tom.w@startupco.io",
    buyerAvatar: "TW",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "pending_delivery",
    createdAt: "2026-03-30T08:15:00Z",
  },
  {
    id: "ord-004",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "Lucy Brown",
    buyerEmail: "lucy@freelancer.me",
    buyerAvatar: "LB",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "complete",
    createdAt: "2026-03-20T16:45:00Z",
    deliveryUrl: "https://github.com/alexchen/invoiceflow-delivery",
  },
  {
    id: "ord-005",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "Kevin Lee",
    buyerEmail: "kevin@techcorp.dev",
    buyerAvatar: "KL",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "complete",
    createdAt: "2026-03-15T11:00:00Z",
    deliveryUrl: "https://github.com/alexchen/invoiceflow-delivery",
  },
  {
    id: "ord-006",
    appId: "1",
    appName: "InvoiceFlow",
    appPrice: 499,
    buyerName: "Sophia Martinez",
    buyerEmail: "s.martinez@agency.co",
    buyerAvatar: "SM",
    platformFee: 74.85,
    sellerEarnings: 424.15,
    status: "pending_delivery",
    createdAt: "2026-03-31T09:00:00Z",
  },
];

export interface ForgePost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  tag: "#buildinpublic" | "#launch" | "#feedback" | "#collab";
  reactions: { fire: number; bulb: number; clap: number; eyes: number };
  comments: number;
  createdAt: string;
  appRef?: { id: string; name: string };
}

export interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  bannerGradient: string;
  bio: string;
  currentlyBuilding: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  joinedAt: string;
  badges: { id: string; label: string; icon: string; color: string }[];
  appIds: string[];
  stats: { posts: number; sales: number; reputation: number };
}

export const forgePosts: ForgePost[] = [
  {
    id: "fp-1",
    authorName: "Alex Chen",
    authorAvatar: "AC",
    authorUsername: "alexchen",
    content: "Just shipped v2 of InvoiceFlow with AI-powered invoice generation. Went from idea to production in 3 weeks. The hardest part wasn't the code — it was pricing it right. 🚀",
    tag: "#launch",
    reactions: { fire: 34, bulb: 12, clap: 28, eyes: 7 },
    comments: 11,
    createdAt: "2026-03-31T14:30:00Z",
    appRef: { id: "1", name: "InvoiceFlow" },
  },
  {
    id: "fp-2",
    authorName: "Sarah Kim",
    authorAvatar: "SK",
    authorUsername: "sarahkim",
    content: "Day 14 of building ShopBase in public. Completed the Stripe webhook integration today. The documentation is actually great once you stop trying to skim it lol. Tomorrow: admin dashboard.",
    tag: "#buildinpublic",
    reactions: { fire: 21, bulb: 18, clap: 14, eyes: 9 },
    comments: 6,
    createdAt: "2026-03-30T09:15:00Z",
    appRef: { id: "4", name: "ShopBase" },
  },
  {
    id: "fp-3",
    authorName: "Dev Studio",
    authorAvatar: "DS",
    authorUsername: "devstudio",
    content: "Hot take: most 'AI-powered' tools are just wrappers with a lot of prompt engineering. CodeReviewAI actually trains on your repo history so reviews improve over time. Happy to explain the architecture in the comments.",
    tag: "#feedback",
    reactions: { fire: 47, bulb: 39, clap: 22, eyes: 31 },
    comments: 24,
    createdAt: "2026-03-29T18:00:00Z",
    appRef: { id: "5", name: "CodeReviewAI" },
  },
  {
    id: "fp-4",
    authorName: "Nina Patel",
    authorAvatar: "NP",
    authorUsername: "ninapatel",
    content: "Looking for a React Native dev to collab on a meditation app bounty. Budget is $1.2k, timeline 6 weeks. Strong design already done, need solid mobile dev. DM me or reply here!",
    tag: "#collab",
    reactions: { fire: 8, bulb: 5, clap: 3, eyes: 19 },
    comments: 7,
    createdAt: "2026-03-29T11:30:00Z",
  },
  {
    id: "fp-5",
    authorName: "James Wu",
    authorAvatar: "JW",
    authorUsername: "jameswu",
    content: "TableSync crossed $5k in sales this month. Never thought a restaurant reservation app would be my best seller. The restaurant industry is genuinely underserved by modern software.",
    tag: "#buildinpublic",
    reactions: { fire: 62, bulb: 14, clap: 53, eyes: 11 },
    comments: 18,
    createdAt: "2026-03-28T16:45:00Z",
    appRef: { id: "3", name: "TableSync" },
  },
  {
    id: "fp-6",
    authorName: "Olivia Park",
    authorAvatar: "OP",
    authorUsername: "oliviapark",
    content: "Honest question for the community: how do you handle app support after selling? I've been spending ~5 hours/week on support emails for BookEase. Is that normal? Worth charging for it?",
    tag: "#feedback",
    reactions: { fire: 11, bulb: 28, clap: 9, eyes: 14 },
    comments: 22,
    createdAt: "2026-03-27T10:00:00Z",
    appRef: { id: "6", name: "BookEase" },
  },
  {
    id: "fp-7",
    authorName: "Ryan Torres",
    authorAvatar: "RT",
    authorUsername: "ryantor",
    content: "LearnHub getting its first enterprise inquiry today — a coding bootcamp wants to license it for 200 students. No idea how to price enterprise. Thread on what I'm thinking 👇",
    tag: "#buildinpublic",
    reactions: { fire: 29, bulb: 33, clap: 18, eyes: 22 },
    comments: 15,
    createdAt: "2026-03-26T13:20:00Z",
    appRef: { id: "7", name: "LearnHub" },
  },
];

export const userProfiles: UserProfile[] = [
  {
    username: "alexchen",
    name: "Alex Chen",
    avatar: "AC",
    bannerGradient: "from-[#1D9E75] to-[#0d6e52]",
    bio: "Full-stack dev. Building SaaS tools that actually make money. 5+ years with Next.js & Supabase.",
    currentlyBuilding: "InvoiceFlow v3 with recurring billing",
    location: "San Francisco, CA",
    website: "alexchen.dev",
    twitter: "alexchendev",
    github: "alexchen",
    joinedAt: "2025-06-01",
    badges: [
      { id: "top-seller", label: "Top Seller", icon: "🏆", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      { id: "first-sale", label: "First Sale", icon: "💰", color: "bg-green-100 text-green-700 border-green-200" },
      { id: "builder", label: "Builder", icon: "🔨", color: "bg-blue-100 text-blue-700 border-blue-200" },
      { id: "community", label: "Community Star", icon: "⭐", color: "bg-purple-100 text-purple-700 border-purple-200" },
    ],
    appIds: ["1"],
    stats: { posts: 24, sales: 23, reputation: 412 },
  },
  {
    username: "sarahkim",
    name: "Sarah Kim",
    avatar: "SK",
    bannerGradient: "from-purple-500 to-pink-500",
    bio: "E-commerce specialist. Built 30+ headless commerce solutions. All products MIT licensed.",
    currentlyBuilding: "ShopBase Pro with multi-vendor support",
    location: "Seoul, Korea",
    website: "sarahkim.io",
    twitter: "sarahkimdev",
    github: "sarahkim",
    joinedAt: "2025-04-15",
    badges: [
      { id: "first-sale", label: "First Sale", icon: "💰", color: "bg-green-100 text-green-700 border-green-200" },
      { id: "builder", label: "Builder", icon: "🔨", color: "bg-blue-100 text-blue-700 border-blue-200" },
    ],
    appIds: ["4"],
    stats: { posts: 31, sales: 31, reputation: 287 },
  },
];

export const mockPurchases = [
  { id: "pur-001", appId: "5", appName: "CodeReviewAI", price: 699, purchasedAt: "2026-03-10T10:00:00Z", deliveryUrl: "https://github.com/devstudio/codereviewai-delivery" },
  { id: "pur-002", appId: "3", appName: "TableSync", price: 599, purchasedAt: "2026-02-28T14:00:00Z", deliveryUrl: "https://github.com/jameswu/tablesync-delivery" },
];

export const bounties: Bounty[] = [
  {
    id: "1",
    title: "Uber-style food delivery app",
    description:
      "I need a complete food delivery app similar to Uber Eats. Must include: customer app (browse restaurants, order food, real-time tracking), restaurant dashboard (manage menu, accept/reject orders), and driver app (accept deliveries, navigation). Payment via Stripe. Need both iOS and Android.",
    references: ["https://ubereats.com", "https://doordash.com"],
    budget: 2500,
    deadline: "2026-05-15",
    category: "Restaurant",
    status: "open",
    submissions: 3,
    poster: { name: "Mark Johnson", avatar: "MJ" },
  },
  {
    id: "2",
    title: "AI-powered resume builder with ATS scoring",
    description:
      "Looking for a web app that helps users build resumes optimized for ATS systems. Features needed: template selection, AI-powered content suggestions based on job descriptions, ATS compatibility score, PDF export, and cover letter generation. Should integrate with LinkedIn for profile import.",
    references: ["https://resume.io", "https://novoresume.com"],
    budget: 800,
    deadline: "2026-04-30",
    category: "Tools",
    status: "open",
    submissions: 7,
    poster: { name: "Lisa Chen", avatar: "LC" },
  },
  {
    id: "3",
    title: "Pet sitting marketplace",
    description:
      "Need a two-sided marketplace for pet sitting services. Pet owners can search for sitters by location, view profiles/reviews, and book services. Sitters can set availability, pricing, and manage bookings. Include in-app messaging, payment processing, and review system.",
    references: ["https://rover.com"],
    budget: 1200,
    deadline: null,
    category: "Social",
    status: "open",
    submissions: 2,
    poster: { name: "Emma Davis", avatar: "ED" },
  },
  {
    id: "4",
    title: "Inventory management for small retail",
    description:
      "Simple but powerful inventory management system for a small retail chain (3 locations). Need: barcode scanning, stock transfers between locations, low-stock alerts, purchase order generation, and sales reporting. Must work on tablets for warehouse staff.",
    references: ["https://www.sortly.com"],
    budget: 1500,
    deadline: "2026-06-01",
    category: "E-Commerce",
    status: "in_progress",
    submissions: 4,
    poster: { name: "Tom Harris", avatar: "TH" },
  },
  {
    id: "5",
    title: "Habit tracker with social accountability",
    description:
      "A habit tracking app where users can create habits, track streaks, and join accountability groups. Key features: daily check-ins, streak tracking with visual calendar, group challenges, push notification reminders, and progress sharing to social media. Want a gamification layer with XP and levels.",
    references: ["https://habitica.com", "https://streaksapp.com"],
    budget: 600,
    deadline: "2026-04-15",
    category: "Health",
    status: "open",
    submissions: 5,
    poster: { name: "Amy Zhang", avatar: "AZ" },
  },
  {
    id: "6",
    title: "Freelancer time tracking & invoicing",
    description:
      "Need a clean time tracking tool for freelancers that auto-generates invoices. Features: timer with project/task tagging, weekly timesheets, one-click invoice generation from tracked hours, client management, and payment tracking. Stripe integration for online payments.",
    references: ["https://toggl.com", "https://freshbooks.com"],
    budget: 900,
    deadline: "2026-05-01",
    category: "Finance",
    status: "open",
    submissions: 6,
    poster: { name: "Carlos Rivera", avatar: "CR" },
  },
];
