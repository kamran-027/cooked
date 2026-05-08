import { Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/Toaster";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";

import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
          richColors={true}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
