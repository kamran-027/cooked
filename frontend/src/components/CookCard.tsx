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
}

interface CookCardProps {
  cook: Cook;
}

const CookCard = ({ cook }: CookCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
      <Card className="mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden">
          <img src={cook.image} alt={cook.name} className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
        </div>
        <div className="flex flex-grow flex-col justify-between p-5">
          <div>
            <CardHeader className="p-0 text-left">
              <CardTitle className="text-lg font-semibold tracking-tight sm:text-xl">{cook.name}</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 p-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">{cook.cuisine}</p>
              <p className="mt-2 h-16 overflow-hidden text-sm text-muted-foreground">{cook.description}</p>
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
