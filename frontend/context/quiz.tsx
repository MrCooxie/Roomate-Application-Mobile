import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { API_BASE } from "../config";

type QuizData = {
  email: string;
  password: string;
  name: string;
  age: string;
  school: string;
  city: string;
  introduction: string;
  interests: string[];
  apartmentPreferences: string[];
};

type QuizContextType = {
  data: QuizData;
  setSignup: (email: string, password: string) => void;
  setProfile: (profile: { name: string; age: string; school: string; city: string; introduction: string }) => void;
  setInterests: (interests: string[]) => void;
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
  interests: [],
  apartmentPreferences: [],
};

const QuizContext = createContext<QuizContextType>({
  data: defaultData,
  setSignup: () => {},
  setProfile: () => {},
  setInterests: () => {},
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

  const setInterests = (interests: string[]) => {
    updateData((prev) => ({ ...prev, interests }));
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
      interests: current.interests,
      apartmentPreferences: current.apartmentPreferences,
    };

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.warn("Registration endpoint returned", res.status);
      }
    } catch (err) {
      console.warn("Registration endpoint not available:", err);
    }

    updateData(() => defaultData);
  };

  return (
    <QuizContext.Provider value={{ data, setSignup, setProfile, setInterests, setApartmentPreferences, submit }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}
