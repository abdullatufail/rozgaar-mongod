"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "./star";

interface ThreeDCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
}

export function ThreeDCard({ id, title, image, price, rating, reviews, category }: ThreeDCardProps) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [mouseLeaveDelay, setMouseLeaveDelay] = useState<NodeJS.Timeout | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { left, top } = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRef.current.offsetWidth;
    const cardHeight = cardRef.current.offsetHeight;
    
    setMouseX((e.clientX - left) / cardWidth);
    setMouseY((e.clientY - top) / cardHeight);
  };

  const handleMouseEnter = () => {
    if (mouseLeaveDelay) {
      clearTimeout(mouseLeaveDelay);
      setMouseLeaveDelay(null);
    }
  };

  const handleMouseLeave = () => {
    if (mouseLeaveDelay) clearTimeout(mouseLeaveDelay);
    
    const delay = setTimeout(() => {
      setMouseX(0.5);
      setMouseY(0.5);
    }, 100);
    
    setMouseLeaveDelay(delay);
  };

  useEffect(() => {
    if (cardRef.current) {
      setWidth(cardRef.current.offsetWidth);
      setHeight(cardRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (cardRef.current) {
        setWidth(cardRef.current.offsetWidth);
        setHeight(cardRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rotateX = mouseY * 20 - 10; // -10 to 10 degrees
  const rotateY = (mouseX * 20 - 10) * -1; // -10 to 10 degrees, inverted

  return (
    <Link href={`/gigs/${id}`}>
      <motion.div
        ref={cardRef}
        className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative h-52">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  filled={star <= rating}
                  className={`h-4 w-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-gray-600">({reviews})</span>
          </div>
          <div className="mt-auto pt-2 border-t border-gray-100">
            <div className="font-bold text-lg">
              ${price}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 