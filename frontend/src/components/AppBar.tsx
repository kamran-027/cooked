import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import AppLogo from "../assets/Cooked_Logo.png";

const AppBar = () => {
  return (
    <header className="bg-[#fdf3e9] shadow-md">
      <div className="container  flex justify-between items-center  mx-auto">
        <div>
          <img src={AppLogo} alt="Cooked Logo" className="w-20 h-20" />
        </div>
        <div className="mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-10 h-10 bg-gray-600 text-white border-none focus:outline-none focus:ring-0">
                <AvatarImage />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-none rounded-lg shadow-lg p-2 min-w-[180px]">
              <DropdownMenuLabel className="font-semibold">
                Account Details
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-md transition-colors cursor-pointer hover:bg-yellow-300 hover:text-white">
                My Bookings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md transition-colors cursor-pointer hover:bg-red-300 hover:text-white">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppBar;
