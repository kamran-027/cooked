import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import CookCard from "./CookCard";

interface Cook {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  rate: number;
  image: string;
}

const fetchCooks = async () => {
  const res = await api.get(`/user/getCooks`);
  return res.data;
};

const Main = () => {
  const {
    data: cooks,
    isLoading,
    isError,
  } = useQuery<Cook[]>({ queryKey: ["cooks"], queryFn: fetchCooks });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching cooks</div>;
  }

  return (
    <main className="flex-1 p-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Cooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cooks?.map((cook) => (
            <CookCard key={cook.id} cook={cook} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
