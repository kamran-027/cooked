import AppBar from "@/components/AppBar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const isAuthenticated = sessionStorage.getItem("token");

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          <AppBar />
          <div className="h-[80%]">Main</div>
          <div className="h-[10%]">Footer</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              You are not logged in
            </h2>
            <p className="mb-4 text-gray-600">
              Please log in to access your dashboard.
            </p>
            <Link
              to="/signin"
              className="inline-block px-6 py-2 bg-amber-500 text-white rounded-md font-medium hover:bg-amber-800 transition"
            >
              Sign In
            </Link>
            <span className="mt-2 text-gray-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-black hover:underline">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
