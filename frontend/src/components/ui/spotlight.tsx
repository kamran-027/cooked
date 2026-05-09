import { cn } from "@/lib/utils";

const Spotlight = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.74_0.16_72_/_0.28),transparent_65%)] blur-3xl",
        className,
      )}
    />
  );
};

export default Spotlight;
