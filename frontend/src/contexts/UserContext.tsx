import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import api from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isHydrating: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setIsHydrating(false);
        return;
      }

      try {
        const response = await api.get("/user/me");
        setUser(response.data);
      } catch {
        sessionStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrateUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isHydrating }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
