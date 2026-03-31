import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ROOMMATES, Roommate } from "../data/roommates";
import { APARTMENTS, Apartment } from "../data/apartments";
import { API_BASE } from "../config";

type DataContextType = {
  roommates: Roommate[];
  apartments: Apartment[];
};

const DataContext = createContext<DataContextType>({
  roommates: ROOMMATES,
  apartments: APARTMENTS,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [roommates, setRoommates] = useState<Roommate[]>(ROOMMATES);
  const [apartments, setApartments] = useState<Apartment[]>(APARTMENTS);

  useEffect(() => {
    fetch(`${API_BASE}/roommates`)
      .then((res) => res.json())
      .then((data) => setRoommates(data))
      .catch((err) => console.error("Failed to fetch roommates:", err));

    fetch(`${API_BASE}/apartments`)
      .then((res) => res.json())
      .then((data) => setApartments(data))
      .catch((err) => console.error("Failed to fetch apartments:", err));
  }, []);

  return (
    <DataContext.Provider value={{ roommates, apartments }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
