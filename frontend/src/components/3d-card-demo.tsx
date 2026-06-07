"use client";

import { useMemo, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import BookingDialog from "./BookingDialog";

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  rate: number;
  image: string;
  coverImage?: string;
  averageRating?: number;
  reviewCount?: number;
}

interface ThreeDCardDemoProps {
  cook: Cook;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80";

export default function ThreeDCardDemo({ cook }: ThreeDCardDemoProps) {
  const [hasError, setHasError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resolvedImage = useMemo(() => {
    if (hasError || !cook.image || cook.image.trim().length === 0) return FALLBACK_IMAGE;
    return cook.image;
  }, [hasError, cook.image]);

  return (
    <>
      <CardContainer className="inter-var" containerClassName="py-2 sm:py-4">
        <CardBody className="group/card relative h-auto w-full max-w-[22rem] rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/30 sm:max-w-[24rem]">
          <CardItem
            translateZ="42"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {cook.name}
          </CardItem>
          <CardItem
            as="p"
            translateZ="55"
            className="mt-1 text-sm font-medium text-primary/90"
          >
            {cook.cuisine} Chef
          </CardItem>
          <CardItem translateZ="90" className="mt-4 w-full">
            <img
              src={resolvedImage}
              className="h-56 w-full rounded-2xl object-cover transition-all duration-300 group-hover/card:shadow-2xl border border-border/40"
              alt={cook.name}
              onError={() => setHasError(true)}
            />
          </CardItem>
          <div className="mt-6 flex items-center justify-between gap-6">
            <CardItem
              translateZ={18}
              className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 select-none whitespace-nowrap shadow-sm"
            >
              ★ Premium Chef
            </CardItem>
            <CardItem translateZ={25} as="div">
              <Button 
                className="cursor-pointer px-5 py-2 font-semibold shadow-md transition-all hover:scale-105" 
                onClick={() => setIsDialogOpen(true)}
              >
                Book Now
              </Button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>

      {isDialogOpen && (
        <BookingDialog cook={cook} onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
}
