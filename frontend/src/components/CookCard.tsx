import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
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

interface CookCardProps {
  cook: Cook;
}

const CookCard = ({ cook }: CookCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md transition-all duration-300 hover:shadow-xl">
        {/* Card Header Banner */}
        <div className="relative h-28 w-full overflow-hidden bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent dark:from-amber-500/10 dark:via-orange-500/5 dark:to-transparent">
          {cook.coverImage ? (
            <img 
              src={cook.coverImage} 
              alt={`${cook.cuisine} cover`} 
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 hover:scale-105" 
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent" />
          )}
          <div className="absolute inset-0 bg-black/15 dark:bg-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] opacity-35" />
        </div>
        
        {/* Profile Avatar overlapping banner */}
        <div className="relative -mt-14 flex justify-start pl-6">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-card bg-card shadow-md">
            <img 
              src={cook.image} 
              alt={cook.name} 
              className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-110" 
            />
          </div>
        </div>

        <div className="flex flex-grow flex-col justify-between p-5 pt-3">
          <div>
            <CardHeader className="p-0 text-left">
              <CardTitle className="text-lg font-bold tracking-tight sm:text-xl">{cook.name}</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 p-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">{cook.cuisine}</p>
                {cook.reviewCount !== undefined && cook.reviewCount > 0 && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 select-none">
                    <span className="text-amber-500">★</span>
                    <span>{cook.averageRating}</span>
                    <span className="text-[9.5px] text-muted-foreground/80 font-normal">({cook.reviewCount})</span>
                  </div>
                )}
              </div>
              <p className="mt-2.5 h-16 overflow-hidden text-sm text-muted-foreground leading-relaxed">{cook.description}</p>
              <p className="mt-3 text-lg font-bold text-foreground">${cook.rate}/hr</p>
            </CardContent>
          </div>
          <CardFooter className="mt-4 p-0">
            <Button className="w-full cursor-pointer" onClick={() => setIsDialogOpen(true)}>
              Book Now
            </Button>
          </CardFooter>
        </div>
      </Card>
      {isDialogOpen && <BookingDialog cook={cook} onClose={() => setIsDialogOpen(false)} />}
    </motion.div>
  );
};

export default CookCard;
