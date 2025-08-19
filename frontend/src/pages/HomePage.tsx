import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const HomePage = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center bg-gray-100">
      <h1 className="text-red-400 font-bold bg-purple-300 p-5 rounded-md ">
        Home Page
      </h1>
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link to="/about">
              <Button variant="link" className="cursor-pointer">
                About
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <Button variant="secondary" className="cursor-pointer">
                Contact
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
