import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center bg-gray-100">
      <div className="text-red-400 font-bold bg-purple-300 p-5 rounded-md ">
        Cooked App Here!!
      </div>
      <Button className="cursor-pointer">Click Here!</Button>
    </div>
  );
}

export default App;
