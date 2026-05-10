import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import CookCard from "./CookCard";
import SkeletonCard from "./SkeletonCard";
import Error from "./Error";
import { motion } from "framer-motion";
import ThreeDCardDemo from "./3d-card-demo";
import TextHoverEffectDemo from "./text-hover-effect-demo";
import AnimatedTooltipDemo from "./animated-tooltip-demo";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const {
    data: cooks,
    isLoading,
    isError,
  } = useQuery<Cook[]>({ queryKey: ["cooks"], queryFn: fetchCooks });

  if (isLoading) {
    return (
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="container mx-auto">
          <div className="mb-7 rounded-2xl border border-border/80 bg-card p-5 shadow-md sm:p-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Explore Cooks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find chefs that match your taste and schedule.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

  const heroCook = cooks?.[0];
  const featuredPeople = (cooks || []).slice(0, 6).map((cook, index) => ({
    id: index + 1,
    name: cook.name,
    designation: cook.cuisine,
    image: cook.image,
  }));

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
      <div className="container mx-auto">
        <div className="relative mb-7 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-lg sm:p-8">
          <div className="pointer-events-none absolute left-0 right-0 top-1 sm:top-2">
            <TextHoverEffectDemo />
          </div>

          <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Curated Culinary Talent
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Book exceptional home chefs with confidence.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                A premium experience for discovering verified cooks, transparent rates, and effortless booking.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button className="cursor-pointer" onClick={() => navigate("/dashboard/bookings")}>
                  View My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" })}
                >
                  Explore Chefs
                </Button>
              </div>

              <div className="mt-5 grid max-w-xl grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                  <p className="text-lg font-semibold text-foreground">{cooks?.length || 0}+</p>
                  <p className="text-xs text-muted-foreground">Verified Chefs</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                  <p className="text-lg font-semibold text-foreground">4.9/5</p>
                  <p className="text-xs text-muted-foreground">Avg. Satisfaction</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/40 px-3 py-2">
                  <p className="text-lg font-semibold text-foreground">&lt; 5 min</p>
                  <p className="text-xs text-muted-foreground">Quick Booking</p>
                </div>
              </div>

              {featuredPeople.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Featured Chefs
                  </p>
                  <AnimatedTooltipDemo people={featuredPeople} />
                </div>
              )}
            </div>
            {heroCook && (
              <ThreeDCardDemo
                title={heroCook.name}
                subtitle={heroCook.cuisine}
                image={heroCook.image}
              />
            )}
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {cooks?.map((cook) => (
            <motion.div
              key={cook.id}
              variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
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
