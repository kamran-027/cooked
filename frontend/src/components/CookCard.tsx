import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

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
    <Card
      className="overflow-hidden bg-yellow-100 rounded-lg shadow-lg 
                p-0 transition-transform transform hover:-translate-y-2 hover:shadow-2xl max-w-sm mx-auto"
    >
      <div className="flex h-64">
        <div className="w-1/2">
          <img
            src={cook.image}
            alt={cook.name}
            className="object-cover h-full w-full rounded-md"
          />
        </div>
        <div className="w-1/2 p-4 flex flex-col justify-between relative">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-bold text-gray-800">
                {cook.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-md font-semibold text-amber-600">
                {cook.cuisine}
              </p>
              <p className="text-gray-600 text-sm mt-2">{cook.description}</p>
              <p className="text-lg font-bold text-gray-800 mt-4">
                ${cook.rate}/hr
              </p>
            </CardContent>
          </div>
          <CardFooter className="p-0 mt-4 absolute bottom-0 w-1/2">
            <Button className="w-full bg-amber-500 text-white hover:bg-amber-600 rounded-lg m-2 cursor-pointer">
              Book
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default CookCard;
