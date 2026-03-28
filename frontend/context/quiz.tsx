import { createContext, useContext, useState, useRef, ReactNode } from "react";

const API_BASE = "http://172.20.10.4:5000/api";

type QuizData = {
  email: string;
  password: string;
  name: string;
  age: string;
  school: string;
  city: string;
  introduction: string;
  preferences: string[];
  apartmentPreferences: string[];
};

type QuizContextType = {
  data: QuizData;
  setSignup: (email: string, password: string) => void;
  setProfile: (profile: { name: string; age: string; school: string; city: string; introduction: string }) => void;
  setPreferences: (preferences: string[]) => void;
  setApartmentPreferences: (preferences: string[]) => void;
  submit: () => Promise<void>;
};

const defaultData: QuizData = {
  email: "",
  password: "",
  name: "",
  age: "",
  school: "",
  city: "",
  introduction: "",
  preferences: [],
  apartmentPreferences: [],
};

const QuizContext = createContext<QuizContextType>({
  data: defaultData,
  setSignup: () => {},
  setProfile: () => {},
  setPreferences: () => {},
  setApartmentPreferences: () => {},
  submit: async () => {},
});

export function QuizProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<QuizData>(defaultData);
  const dataRef = useRef(data);

  const updateData = (updater: (prev: QuizData) => QuizData) => {
    setData((prev) => {
      const next = updater(prev);
      dataRef.current = next;
      return next;
    });
  };

  const setSignup = (email: string, password: string) => {
    updateData((prev) => ({ ...prev, email, password }));
  };

  const setProfile = (profile: { name: string; age: string; school: string; city: string; introduction: string }) => {
    updateData((prev) => ({ ...prev, ...profile }));
  };

  const setPreferences = (preferences: string[]) => {
    updateData((prev) => ({ ...prev, preferences }));
  };

  const setApartmentPreferences = (apartmentPreferences: string[]) => {
    updateData((prev) => ({ ...prev, apartmentPreferences }));
  };

  const submit = async () => {
    const current = dataRef.current;
    const body = {
      email: current.email,
      password: current.password,
      name: current.name,
      age: current.age,
      school: current.school,
      city: current.city,
      introduction: current.introduction,
      preferences: current.preferences,
      apartmentPreferences: current.apartmentPreferences,
    };

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Failed to register");
    }

    updateData(() => defaultData);
  };

  return (
    <QuizContext.Provider value={{ data, setSignup, setProfile, setPreferences, setApartmentPreferences, submit }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
