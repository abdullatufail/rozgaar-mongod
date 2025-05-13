import { api } from "../lib/api";

export interface Freelancer {
  id: string;
  name: string;
  email: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  totalReviews?: number;
  durationDays: number;
  freelancerId: string;
  createdAt: string;
  updatedAt: string;
  freelancer: Freelancer;
}

export async function getGigs(): Promise<Gig[]> {
  try {
    console.log("Fetching gigs from API...");
    const response = await api.get<{ gigs: Gig[], pagination: any }>("/gigs");
    console.log("Raw API gigs response:", response);
    
    // Check if the response is the expected structure with a gigs property
    if (response && typeof response === 'object' && 'gigs' in response && Array.isArray(response.gigs)) {
      return response.gigs;
    }
    
    // Fallback handling for direct array response or unexpected format
    if (Array.isArray(response)) {
      return response;
    }
    
    console.error("API returned unexpected format for gigs:", response);
    return [];
  } catch (error) {
    console.error("Error in getGigs service function:", error);
    throw error;
  }
}

export async function getGig(id: string): Promise<Gig> {
  const response = await api.get<Gig>(`/gigs/${id}`);
  return response;
}



export async function createGig(data: Omit<Gig, "id" | "createdAt" | "updatedAt" | "freelancer">): Promise<Gig> {
  const response = await api.post<Gig, typeof data>("/gigs", data);
  return response;
}

export async function updateGig(id: string, data: Partial<Gig>): Promise<Gig> {
  const response = await api.put<Gig, typeof data>(`/gigs/${id}`, data);
  return response;
}

export async function deleteGig(id: string): Promise<void> {
  await api.delete(`/gigs/${id}`);
} 