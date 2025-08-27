import { Routes, Route } from "react-router-dom";

import { Toaster } from "./components/ui/Toaster";
import SignUp from "./pages/Signup";
import SignIn from "./pages/Signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";

import { UserProvider } from "./contexts/UserContext";

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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
