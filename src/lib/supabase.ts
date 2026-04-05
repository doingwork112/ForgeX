import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use supabase-js directly — stores session in localStorage which persists
// across browser restarts (unlike session cookies which disappear on close).
// All pages in this app are "use client" so SSR auth is not needed.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: "forgex-auth",
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          banner_color: string | null;
          role: "creator" | "buyer" | "both";
          currently_building: string | null;
          stripe_account_id: string | null;
          website: string | null;
          twitter: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      apps: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          tagline: string;
          description: string;
          category: string;
          tags: string[];
          price_basic: number;
          price_custom: number | null;
          deposit: number;
          pwa_demo_url: string | null;
          demo_url: string | null;
          rating: number;
          sold: number;
          status: "active" | "draft" | "paused";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["apps"]["Row"], "created_at" | "rating" | "sold">;
        Update: Partial<Database["public"]["Tables"]["apps"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          app_id: string;
          buyer_id: string;
          seller_id: string;
          plan: "basic" | "custom";
          total_price: number;
          deposit_paid: number;
          tail_payment: number;
          status: "deposit_paid" | "in_progress" | "completed" | "refunded";
          payment_intent_id: string | null;
          custom_note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          app_id: string;
          order_id: string;
          reviewer_id: string;
          seller_id: string;
          rating: number;
          body: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      bounties: {
        Row: {
          id: string;
          poster_id: string;
          title: string;
          description: string;
          budget: number;
          category: string;
          status: "open" | "claimed" | "completed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bounties"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["bounties"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          parent_id: string | null;
          repost_of: string | null;
          image_url: string | null;
          tag: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["posts"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          value: 1 | -1;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["votes"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["votes"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          from_id: string;
          to_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["messages"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["follows"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["follows"]["Insert"]>;
      };
    };
  };
};
