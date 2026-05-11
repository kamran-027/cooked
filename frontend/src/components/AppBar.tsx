import { useUser } from "../contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import AppLogo from "../assets/Cooked_Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, SunMedium } from "lucide-react";

const AppBar = () => {
  const { user, setUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
        <Link to="/dashboard" className="group inline-flex items-center gap-2.5 sm:gap-3">
          <img
            src={AppLogo}
            alt="Cooked Logo"
            className="h-12 w-12 rounded-xl border border-border/70 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          />
          <div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Cooked</h1>
            <p className="text-[11px] text-muted-foreground sm:text-xs">Sophisticated chef booking</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 rounded-xl border border-border/70 bg-background/60 p-1 md:flex">
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => navigate("/dashboard/bookings")}
            >
              My Bookings
            </Button>
            {user?.role === "ADMIN" && (
              <Button
                size="sm"
                variant="ghost"
                className="cursor-pointer"
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            )}
          </nav>

          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 cursor-pointer rounded-full border-border/80"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "warm" ? "dark" : "warm"} mode`}
          >
            {theme === "warm" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border border-border bg-primary/15 text-primary transition hover:bg-primary/30 sm:h-10 sm:w-10">
                <AvatarImage />
                <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[220px] rounded-xl border border-border/80 bg-popover p-2 shadow-lg">
              <DropdownMenuLabel className="font-semibold">{user?.name || "Account Details"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-md md:hidden" onClick={() => navigate("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate("/dashboard/bookings")}>My Bookings</DropdownMenuItem>
              {user?.role === "ADMIN" && (
                <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate("/admin")}>Admin Panel</DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer rounded-md text-destructive focus:text-destructive" onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
