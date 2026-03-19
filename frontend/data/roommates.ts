export type Interest = {
  label: string;
  icon: string; // Ionicons name
};

export type Roommate = {
  id: string;
  name: string;
  firstName: string;
  age: number;
  compatibility: number;
  city: string;
  university: string;
  image: any;
  interests: Interest[];
};

export const ROOMMATES: Roommate[] = [
  {
    id: "1",
    name: "Sam Smith",
    firstName: "Sam",
    age: 24,
    compatibility: 92,
    city: "Tartu",
    university: "Tartu University",
    image: require("../assets/images/roommate_sam.png"),
    interests: [
      { label: "Yoga", icon: "body" },
      { label: "Cooking", icon: "restaurant" },
      { label: "Reading", icon: "book" },
      { label: "Hiking", icon: "walk" },
    ],
  },
  {
    id: "2",
    name: "Mai Leen",
    firstName: "Mai",
    age: 19,
    compatibility: 99,
    city: "Tartu",
    university: "University of Tartu",
    image: require("../assets/images/roommate_mai.png"),
    interests: [
      { label: "Dance", icon: "accessibility" },
      { label: "Outgoing", icon: "globe" },
      { label: "Photography", icon: "camera" },
      { label: "Partying", icon: "sparkles" },
    ],
  },
];
