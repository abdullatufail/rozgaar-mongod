"use client";

import { useEffect, useState } from "react";
import { GigCard } from "../../components/common/GigCard";
import { Navbar } from "@/components/common/Navbar";
import { getGigs, Gig } from "../../services/gigs";

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const gigsData = await getGigs();
        setGigs(gigsData || []);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading gigs...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Available Gigs</h1>
        {gigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No gigs available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}