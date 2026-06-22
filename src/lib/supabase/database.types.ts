export type MaratonicaConfigRow = {
  id: number;
  enabled: boolean;
  headline: string;
  participation: string;
  event_date_label: string;
  countdown_at: string;
  event_end_at: string;
  description: string;
  prayer_phone: string;
  prayer_phone_hint: string;
  updated_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RegistroWebConfigRow = {
  id: number;
  year: number;
  title: string;
  intro: string;
  updated_at: string;
};

export type RegistroWebDocumentRow = {
  id: string;
  sort_order: number;
  description: string;
  file_url: string | null;
  file_name: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  name: string;
  place: string;
  text: string;
  sort_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      maratonica_config: {
        Row: MaratonicaConfigRow;
        Insert: Omit<MaratonicaConfigRow, "updated_at"> & { updated_at?: string };
        Update: Partial<Omit<MaratonicaConfigRow, "id">>;
        Relationships: [];
      };
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<{
          email: string;
        }>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Omit<BlogPostRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<BlogPostRow, "id">>;
        Relationships: [];
      };
      registro_web_config: {
        Row: RegistroWebConfigRow;
        Insert: Omit<RegistroWebConfigRow, "updated_at"> & { updated_at?: string };
        Update: Partial<Omit<RegistroWebConfigRow, "id">>;
        Relationships: [];
      };
      registro_web_documents: {
        Row: RegistroWebDocumentRow;
        Insert: Omit<RegistroWebDocumentRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<RegistroWebDocumentRow, "id">>;
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Omit<TestimonialRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<TestimonialRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
