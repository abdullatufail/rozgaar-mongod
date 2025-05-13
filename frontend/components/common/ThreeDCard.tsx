"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import Image from "next/image";
import { Star } from "../ui/star";

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
  return (
    <CardContainer containerClassName="h-full">
      <CardBody className="bg-white relative w-[25rem] group/card border-gray-200  h-full rounded-xl p-6 border shadow-lg shadow-gray-200/50">
        <CardItem
         translateZ="50"
          className="text-xl font-bold text-neutral-800 line-clamp-1"
        >
          {title}
        </CardItem>
        
        <CardItem
          as="p"
         translateZ="60"
          className="text-neutral-600 text-sm mt-2 line-clamp-1"
        >
          {category}
        </CardItem>
        
        <CardItem translateZ="100" className="w-full mt-4">
          <div className="relative h-52 w-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-xl group-hover/card:shadow-xl"
            />
          </div>
        </CardItem>
        
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ="40"
            className="flex items-center"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  filled={star <= rating}
                  className={`h-4 w-4 ${star <= rating ? "text-black" : "text-gray-700"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">({reviews})</span>
          </CardItem>
          
          <CardItem
            translateZ="50"
            className="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-bold"
          >
            ${price}
          </CardItem>
        </div>
        
        <CardItem
          translateZ="40"
          as={Link}
          href={`/gigs/${id}`}
          className="absolute inset-0 w-full h-full"
          aria-label={`View ${title}`}
        >
          <span className="sr-only">View gig details</span>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
