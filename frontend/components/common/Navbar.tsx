"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SearchBar } from "./SearchBar";
import { useEffect } from "react";
import { useState } from "react";
import { Gig } from "@/lib/validators";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { PRICE_RANGES } from "@/lib/constants";

interface NavbarProps {
  selectedCategory?: string | null;
  selectedPriceRange?: { min: number; max: number } | null;
  onSearch?: (query: string) => void;
}

export function Navbar({ selectedCategory, selectedPriceRange, onSearch }: NavbarProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
 
  const initialQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    fetchGigs();
  }, [searchParams]);

  const fetchGigs = async () => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchParams.get("search")) {
        params.append("search", searchParams.get("search")!.trim());
      }
      
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      
      if (selectedPriceRange) {
        params.append("minPrice", selectedPriceRange.min.toString());
        params.append("maxPrice", selectedPriceRange.max.toString());
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await api.get<Gig[]>(`/gigs${queryString}`);
      
      // If search query exists, filter gigs to ensure they have the search term in title
      const searchQuery = searchParams.get("search")?.trim();
      if (searchQuery) {
        const filteredGigs = response.filter(gig => 
          gig.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setGigs(filteredGigs);
      } else {
        setGigs(response);
      }
    } catch (error) {
      console.error("Error fetching gigs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    } else {
      updateSearchParams();
    }
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    
    if (selectedPriceRange) {
      params.set("minPrice", selectedPriceRange.min.toString());
      params.set("maxPrice", selectedPriceRange.max.toString());
    }
    
    router.push(`/search/gigs?${params.toString()}`);
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 mb-4">
      <Link href="/" className="text-3xl font-bold">
            <span className="flex items-center">
              <span className="text-black">*</span>
              <span className="ml-1">rozgaar</span>
            </span>
          </Link>        <div className="mt-3">
          <SearchBar 
            className="w-[18rem] md:w-[40rem] max-w-2xl mx-auto" 
            defaultQuery={searchQuery}
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
            selectedPriceRange={selectedPriceRange}
          />
        </div>
        <div className="flex items-center gap-4">
          
          {user ? (
            <>
              <Link href="/orders">
                <Button variant="ghost">Orders</Button>
              </Link>
              <div className="flex items-center mr-2">
                <span className="text-sm font-medium text-green-600">
                  ${user.balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">{user.name}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
          <Link href="/login" className="text-gray-600 hover:text-black px-4 py-2 rounded-full border border-gray-300">
            Log in
          </Link>
          <Link href="/register" className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
            Sign up
          </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 