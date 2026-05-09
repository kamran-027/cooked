"use client";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

interface TooltipPerson {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export default function AnimatedTooltipDemo({
  people,
}: {
  people: TooltipPerson[];
}) {
  return (
    <div className="mb-4 flex w-full items-center justify-center">
      <AnimatedTooltip items={people} />
    </div>
  );
}
