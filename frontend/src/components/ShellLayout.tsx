import type { ReactNode } from "react";
import Spotlight from "./ui/spotlight";

const ShellLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Spotlight />
      <Spotlight className="left-[85%] top-[10%] h-80 w-80 bg-[radial-gradient(circle_at_center,oklch(0.65_0.14_52_/_0.22),transparent_70%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ShellLayout;
