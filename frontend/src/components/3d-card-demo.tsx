"use client";

import { useMemo, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

interface ThreeDCardDemoProps {
  title: string;
  subtitle: string;
  image?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80";

export default function ThreeDCardDemo({
  title,
  subtitle,
  image,
  onAction,
  actionLabel = "Book Now",
}: ThreeDCardDemoProps) {
  const [hasError, setHasError] = useState(false);

  const resolvedImage = useMemo(() => {
    if (hasError || !image || image.trim().length === 0) return FALLBACK_IMAGE;
    return image;
  }, [hasError, image]);

  return (
    <CardContainer className="inter-var" containerClassName="py-2 sm:py-4">
      <CardBody className="group/card relative h-auto w-full max-w-[22rem] rounded-2xl border border-border/70 bg-card p-5 shadow-lg sm:max-w-[24rem]">
        <CardItem
          translateZ="42"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="55"
          className="mt-2 max-w-sm text-sm text-muted-foreground"
        >
          {subtitle}
        </CardItem>
        <CardItem translateZ="90" className="mt-4 w-full">
          <img
            src={resolvedImage}
            className="h-52 w-full rounded-xl object-cover transition-all duration-300 group-hover/card:shadow-xl"
            alt={title}
            onError={() => setHasError(true)}
          />
        </CardItem>
        <div className="mt-5 flex items-center justify-between">
          <CardItem
            translateZ={18}
            className="text-xs font-medium uppercase tracking-widest text-primary"
          >
            Premium Chef
          </CardItem>
          <CardItem translateZ={25} as="div">
            <Button className="cursor-pointer" onClick={onAction}>
              {actionLabel}
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
