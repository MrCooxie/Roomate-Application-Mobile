import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ROOMMATES, Roommate } from "../data/roommates";
import { APARTMENTS, Apartment } from "../data/apartments";
import { API_BASE } from "../config";
import { useAuth } from "./auth";

type DataContextType = {
  roommates: Roommate[];
  apartments: Apartment[];
};

const DataContext = createContext<DataContextType>({
  roommates: ROOMMATES,
  apartments: APARTMENTS,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [roommates, setRoommates] = useState<Roommate[]>(ROOMMATES);
  const [apartments, setApartments] = useState<Apartment[]>(APARTMENTS);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/roommates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.airtableId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRoommates(data);
      })
      .catch((err) => console.error("Failed to fetch roommates:", err));

    fetch(`${API_BASE}/apartments`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApartments(data);
      })
      .catch((err) => console.error("Failed to fetch apartments:", err));
  }, [user]);

  return (
    <DataContext.Provider value={{ roommates, apartments }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
