"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface HeroSearchBarProps {
  className?: string;
  defaultQuery?: string;
  selectedCategory?: string | null;
  selectedPriceRange?: { min: number; max: number; label?: string } | null;
}

export function HeroSearchBar({ 
  className, 
  defaultQuery = "",
  selectedCategory = null,
  selectedPriceRange = null 
}: HeroSearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create URL params
    const params = new URLSearchParams();
    
    // Add search query if provided
    if (query) {
      params.set("search", query.trim());
    }
    
    // Add category filter if provided
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    
    // Add price range filters if provided
    if (selectedPriceRange) {
      if (selectedPriceRange.min > 0) {
        params.set("minPrice", selectedPriceRange.min.toString());
      }
      if (selectedPriceRange.max < 1000) {
        params.set("maxPrice", selectedPriceRange.max.toString());
      }
    }
    
    // Direct navigation approach using window.location
    window.location.href = `/search/gigs?${params.toString()}`;
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex w-full max-w-md rounded-full border border-gray-300 bg-white overflow-hidden ${className}`}
      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="What services are you looking for today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 pl-10 pr-0 py-2 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-full"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        />
      </div>
      
      <Button
        type="submit"
        className="h-12 px-6 rounded-r-full"
      >
        Search
      </Button>
    </form>
  );
}
