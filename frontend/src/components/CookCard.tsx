import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="overflow-hidden rounded-lg shadow-lg max-w-sm mx-auto h-full flex flex-col">
        <div className="flex-shrink-0">
          <img
            src={cook.image}
            alt={cook.name}
            className="object-cover h-48 w-full"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <CardHeader className="p-0 text-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                {cook.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2 text-center">
              <p className="text-md font-semibold text-amber-600">
                {cook.cuisine}
              </p>
              <p className="text-gray-600 text-sm mt-2 h-16 overflow-hidden">
                {cook.description}
              </p>
              <p className="text-lg font-bold text-gray-800 ">
                ${cook.rate}/hr
              </p>
            </CardContent>
          </div>
          <CardFooter className="p-0 mt-4">
            <Button className="w-full bg-amber-500 text-white hover:bg-amber-600 cursor-pointer">
              Book
            </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default CookCard;
