const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authApi = {
  signUp: async (email: string, password: string, fullName: string, phone: string, role: 'user' | 'worker') => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName, phone, role }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  signIn: async (email: string, password: string) => {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  signOut: () => {
    localStorage.removeItem('token');
  },
};

// Profile API
export const profileApi = {
  getMe: () => apiRequest('/profiles/me'),
  getById: (id: string) => apiRequest(`/profiles/${id}`),
  update: (updates: Partial<Profile>) =>
    apiRequest('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Service API
export const serviceApi = {
  getAll: () => apiRequest('/services'),
  getAllForAdmin: () => apiRequest('/services/all'),
  getById: (id: string) => apiRequest(`/services/${id}`),
  toggleStatus: (id: string) => apiRequest(`/services/${id}/toggle`, { method: 'PATCH' }),
};

// Worker API
export const workerApi = {
  getAll: () => apiRequest('/workers'),
  getAllForAdmin: () => apiRequest('/workers/all'),
  getAvailable: (category: string) => apiRequest(`/workers/available/${category}`),
  getById: (id: string) => apiRequest(`/workers/${id}`),
  updateVerification: (id: string, verification_status: 'pending' | 'verified' | 'rejected') =>
    apiRequest(`/workers/${id}/verification`, {
      method: 'PATCH',
      body: JSON.stringify({ verification_status }),
    }),
  update: (id: string, updates: Partial<Worker>) =>
    apiRequest(`/workers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Booking API
export const bookingApi = {
  getAllForAdmin: () => apiRequest('/bookings/all'),
  getMyBookings: () => apiRequest('/bookings/my-bookings'),
  getMyJobs: () => apiRequest('/bookings/my-jobs'),
  getById: (id: string) => apiRequest(`/bookings/${id}`),
  create: (bookingData: {
    service_id: string;
    worker_id?: string;
    booking_date: string;
    booking_time: string;
    address: string;
    notes?: string;
  }) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
  updateStatus: (id: string, status: string) =>
    apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Review API
export const reviewApi = {
  getByWorker: (workerId: string) => apiRequest(`/reviews/worker/${workerId}`),
  create: (reviewData: { booking_id: string; rating: number; comment?: string }) =>
    apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    }),
  update: (id: string, reviewData: { rating: number; comment?: string }) =>
    apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    }),
};

// Types
export type Profile = {
  _id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string | null;
  role: 'user' | 'worker' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: string;
  is_active: boolean;
  created_at: string;
};

export type Worker = {
  _id: string;
  user_id: Profile;
  skills: string[];
  rating: number;
  total_jobs: number;
  availability_status: 'available' | 'busy' | 'offline';
  hourly_rate: number;
  bio: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
};

export type Booking = {
  _id: string;
  user_id: string | Profile;
  worker_id: string | Worker | null;
  service_id: string | Service;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  address: string;
  notes: string | null;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
};

export type Review = {
  _id: string;
  booking_id: string | Booking;
  user_id: string | Profile;
  worker_id: string | Worker;
  rating: number;
  comment: string | null;
  created_at: string;
};

