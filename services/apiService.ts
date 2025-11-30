import { supabase, Service, Testimonial, BlogPost, ServiceRequest, AdminUser, SiteSetting, Product, Order } from './supabase';

// Services API
export const getServices = async (language: 'en' | 'ar' = 'en', activeOnly: boolean = true): Promise<Service[]> => {
  let query = supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Testimonials API
export const getTestimonials = async (activeOnly: boolean = true): Promise<Testimonial[]> => {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(testimonial)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTestimonial = async (id: string, updates: Partial<Testimonial>): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Blog Posts API
export const getBlogPosts = async (publishedOnly: boolean = true): Promise<BlogPost[]> => {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('sort_order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) throw error;
  return data;
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(blogPost)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Service Requests API
export const getServiceRequests = async (): Promise<ServiceRequest[]> => {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createServiceRequest = async (request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest> => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert(request)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateServiceRequest = async (id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> => {
  const { data, error } = await supabase
    .from('service_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteServiceRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('service_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Admin Users API
export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAdminUserByEmail = async (email: string): Promise<AdminUser | null> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found" error
  return data;
};

export const createAdminUser = async (user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>): Promise<AdminUser> => {
  const { data, error } = await supabase
    .from('admin_users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAdminUserLastLogin = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

// Site Settings API
export const getSiteSettings = async (publicOnly: boolean = true): Promise<SiteSetting[]> => {
  let query = supabase
    .from('site_settings')
    .select('*')
    .order('key', { ascending: true });

  if (publicOnly) {
    query = query.eq('is_public', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getSiteSettingByKey = async (key: string): Promise<SiteSetting | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) throw error;
  return data;
};

export const updateSiteSetting = async (key: string, updates: Partial<SiteSetting>): Promise<SiteSetting> => {
  const { data, error } = await supabase
    .from('site_settings')
    .update(updates)
    .eq('key', key)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createSiteSetting = async (setting: Omit<SiteSetting, 'id' | 'created_at' | 'updated_at'>): Promise<SiteSetting> => {
  const { data, error } = await supabase
    .from('site_settings')
    .insert(setting)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Utility functions
export const getLocalizedContent = (item: Service | Testimonial | BlogPost | Product, language: 'en' | 'ar') => {
  if (language === 'ar') {
    return {
      ...item,
      title: (item as any).title_ar || (item as any).title,
      description: (item as any).description_ar || (item as any).description,
      excerpt: (item as any).excerpt_ar || (item as any).excerpt,
      content: (item as any).content_ar || (item as any).content,
      price_start: (item as any).price_start_ar || (item as any).price_start,
      meta_title: (item as any).meta_title_ar || (item as any).meta_title_en,
      meta_description: (item as any).meta_description_ar || (item as any).meta_description_en,
      meta_keywords: (item as any).meta_keywords_ar || (item as any).meta_keywords_en,
    };
  }
  return {
    ...item,
    title: (item as any).title_en || (item as any).title,
    description: (item as any).description_en || (item as any).description,
    excerpt: (item as any).excerpt_en || (item as any).excerpt,
    content: (item as any).content_en || (item as any).content,
    price_start: (item as any).price_start_en || (item as any).price_start,
    meta_title: (item as any).meta_title_en,
    meta_description: (item as any).meta_description_en,
    meta_keywords: (item as any).meta_keywords_en,
  };
};

export const getDashboardStats = async () => {
  try {
    const [
      { count: servicesCount },
      { count: requestsCount },
      { count: pendingRequestsCount },
      { count: blogsCount }
    ] = await Promise.all([
      supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('service_requests').select('*', { count: 'exact', head: true }),
      supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true)
    ]);

    return {
      totalServices: servicesCount || 0,
      totalRequests: requestsCount || 0,
      pendingRequests: pendingRequestsCount || 0,
      totalBlogs: blogsCount || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalServices: 0,
      totalRequests: 0,
      pendingRequests: 0,
      totalBlogs: 0
    };
  }
};

// Products API
export const getProducts = async (activeOnly: boolean = true): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Orders API
export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};