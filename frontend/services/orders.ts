import { api } from "../lib/api";

const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') return value;
  }
  return null;
};

export interface Order {
  id: string;
  gigId: string;
  clientId: string;
  freelancerId: string;
  status: "pending" | "in_progress" | "delivered" | "completed" | "cancelled" | "cancellation_requested" | "late";
  price: number;
  requirements: string;
  dueDate?: string;
  isLate?: boolean;
  deliveryFile?: string;
  deliveryNotes?: string;
  cancellationReason?: string;
  cancellationApproved?: boolean;
  cancellationRequestedBy?: string;
  createdAt: string;
  updatedAt: string;
  review?: Review;
  gig: {
    title: string;
    id: string;
  };
  client: {
    name: string;
    id: string;
  };
  freelancer: {
    name: string;
    id: string;
  };
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender?: {
    name: string;
  };
}

export interface Balance {
  amount: number;
}

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  order?: {
    client: {
      name: string;
      id: string;
    };
    gig: {
      title: string;
      id: string;
    };
  };
}

type EmptyObject = Record<string, never>;

export const orderService = {
  createOrder: async (gigId: string, requirements: string) => {
    return api.post<Order, { gigId: string; requirements: string }>("/orders", { gigId, requirements });
  },

  fetchOrders: async () => {
    try {
      const response = await api.get<Order[]>("/orders");
      return response;
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },

  fetchOrder: async (id: string) => {
    return api.get<Order>(`/orders/${id}`);
  },

  deliverOrder: async (orderId: string, file: File | null, notes: string) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("notes", notes);

    const token = getToken();
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/deliver`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  approveDelivery: async (orderId: string) => {
    return api.post<Order, EmptyObject>(`/orders/${orderId}/approve`, {});
  },

  rejectDelivery: async (orderId: string) => {
    return api.post<Order, EmptyObject>(`/orders/${orderId}/reject`, {});
  },

  requestCancellation: async (orderId: string, reason: string) => {
    return api.post<Order, { reason: string }>(`/orders/${orderId}/cancel`, { reason });
  },

  approveCancellation: async (orderId: string) => {
    return api.post<Order, EmptyObject>(`/orders/${orderId}/approve-cancellation`, {});
  },

  rejectCancellation: async (orderId: string) => {
    return api.post<Order, EmptyObject>(`/orders/${orderId}/reject-cancellation`, {});
  },

  addReview: async (orderId: string, rating: number, comment?: string) => {
    return api.post<Review, { rating: number; comment?: string }>(`/orders/${orderId}/review`, { rating, comment });
  },

  addMessage: async (orderId: string, content: string): Promise<Message> => {
    return api.post<Message, { content: string }>(`/orders/${orderId}/messages`, {
      content,
    });
  },

  getOrderMessages: async (orderId: string): Promise<Message[]> => {
    return api.get<Message[]>(`/orders/${orderId}/messages`);
  },

  getBalance: async (): Promise<Balance> => {
    return api.get<Balance>("/balance");
  },

  addBalance: async (amount: number): Promise<any> => {
    return api.post<any, { amount: number }>("/auth/add-balance", { amount });
  },
  
  getFreelancerReviews: async (freelancerId: string): Promise<Review[]> => {
    return api.get<Review[]>(`/orders/freelancer/${freelancerId}/reviews`);
  },

  updateOrderStatus: async (orderId: string, status: "pending" | "in_progress" | "completed" | "cancelled") => {
    return api.patch<Order, { status: string }>(`/orders/${orderId}/status`, { status });
  },
}; 