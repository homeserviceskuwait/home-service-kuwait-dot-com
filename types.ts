export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // We will use a mapping for icons
  imageUrl: string;
  priceStart: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location?: string;
  comment: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
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