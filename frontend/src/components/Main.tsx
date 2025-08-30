import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import CookCard from "./CookCard";
import SkeletonCard from "./SkeletonCard";
import Error from "./Error";
import { motion } from "framer-motion";

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
    return (
      <main className="flex-1 p-8 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Cooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return <Error message="Failed to fetch cooks. Please try again later." />;
  }

  return (
    <main className="flex-1 p-8 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Cooks</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {cooks?.map((cook) => (
            <motion.div
              key={cook.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CookCard cook={cook} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default Main;
