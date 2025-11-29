import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Service {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  long_description_en?: string;
  long_description_ar?: string;
  features_en?: string[];
  features_ar?: string[];
  benefits_en?: string[];
  benefits_ar?: string[];
  gallery_images?: string[];
  icon_name: string;
  image_url: string;
  price_start_en: string;
  price_start_ar: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  name_ar?: string;
  role: string;
  role_ar?: string;
  location?: string;
  comment: string;
  comment_ar?: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en?: string;
  content_ar?: string;
  image_url: string;
  date: string;
  slug: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  service_id?: string;
  service_type: string;
  message?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  amount?: string;
  scheduled_date?: string;
  completed_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value_en?: string;
  value_ar?: string;
  type: 'text' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
