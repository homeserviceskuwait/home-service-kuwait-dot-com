export interface Service {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  iconName: string; // We will use a mapping for icons
  imageUrl: string;
  priceStart: string;
  priceStart_ar?: string;
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