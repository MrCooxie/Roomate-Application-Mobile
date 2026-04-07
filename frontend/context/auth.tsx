import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  airtableId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("user").then((stored) => {
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const login = (u: User) => {
    setUser(u);
    AsyncStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem("user");
  };

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
