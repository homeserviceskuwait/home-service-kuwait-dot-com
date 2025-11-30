export interface Service {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  iconName: string;
  imageUrl: string;
  priceStart: string;
  priceStart_ar?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
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
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  excerpt: string;
  excerpt_ar?: string;
  date: string;
  imageUrl: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
}

export enum ChatSender {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
}

export interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  amount: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  is_active: boolean;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  meta_keywords_en?: string;
  meta_keywords_ar?: string;
}