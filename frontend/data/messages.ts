export type Message = {
  id: string;
  text: string;
  fromMe: boolean;
};

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: any;
  messages: Message[];
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Darya Reyes",
    lastMessage: "Hey!",
    avatar: require("../assets/images/avatar_darya.png"),
    messages: [
      { id: "1a", text: "Hi there!", fromMe: false },
      { id: "1b", text: "Hey! How are you?", fromMe: true },
      { id: "1c", text: "I'm good! I saw your listing", fromMe: false },
      { id: "1d", text: "Are you still looking for a roommate?", fromMe: false },
      { id: "1e", text: "Yes I am!", fromMe: true },
      { id: "1f", text: "That's great, let's chat more", fromMe: false },
      { id: "1g", text: "Hey!", fromMe: false },
    ],
  },
  {
    id: "2",
    name: "Oscar Tamm",
    lastMessage: "Hey, I was looking into the apartments near...",
    avatar: require("../assets/images/avatar_oscar.png"),
    messages: [
      { id: "2a", text: "Hey Oscar!", fromMe: true },
      { id: "2b", text: "Hi! Nice to meet you", fromMe: false },
      { id: "2c", text: "Likewise! Are you looking for a place?", fromMe: true },
      { id: "2d", text: "Yeah, somewhere near the university", fromMe: false },
      { id: "2e", text: "I know a few good spots", fromMe: true },
      { id: "2f", text: "Hey, I was looking into the apartments near...", fromMe: false },
    ],
  },
  {
    id: "3",
    name: "Chad Chaddingdon",
    lastMessage: "Hey, when would you be able to move in?",
    avatar: require("../assets/images/avatar_chad.png"),
    messages: [
      { id: "3a", text: "Hey Chad!", fromMe: false },
      { id: "3b", text: "What's up!", fromMe: true },
      { id: "3c", text: "I saw you're looking for a roommate", fromMe: false },
      { id: "3d", text: "Yeah!", fromMe: true },
      { id: "3e", text: "Awesome, I'm interested", fromMe: false },
      { id: "3f", text: "Cool!", fromMe: true },
      { id: "3g", text: "Hey, when would you be able to move in?", fromMe: false },
    ],
  },
];
