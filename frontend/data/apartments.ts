export type Apartment = {
  id: string;
  address: string;
  priceLabel: string;
  priceValue: string;
  maxTenants: number;
  sqft: number;
  beds: number;
  baths: number;
  description: string;
  image: any;
  ownerAvatar: any;
  mapImage: any;
};

export const APARTMENTS: Apartment[] = [
  {
    id: "1",
    address: "Revala 2, Tallinn",
    priceLabel: "350€/month per person",
    priceValue: "360€",
    maxTenants: 4,
    sqft: 500,
    beds: 3,
    baths: 2,
    description:
      "This 500 sq. ft. apartment is the perfect balance of comfort and practicality. With two bedrooms and two bathrooms, it offers plenty of privacy and space to make it feel like home.\nThe living area is cozy and welcoming, ideal for relaxing after a long day. The kitchen has everything needed to whip up quick meals or experiment with recipes. The bathrooms are clean and modern, making daily routines easy and stress-free.\nThe location is super convenient, close to public transportation, grocery stores, and a few great cafes. It's a quiet area, but everything you need is just a short walk away.",
    image: require("../assets/images/apartment_revala.png"),
    ownerAvatar: require("../assets/images/owner_avatar.png"),
    mapImage: require("../assets/images/map_placeholder.png"),
  },
  {
    id: "2",
    address: "Viru 12, Tallinn",
    priceLabel: "420€/month per person",
    priceValue: "420€",
    maxTenants: 3,
    sqft: 650,
    beds: 2,
    baths: 1,
    description:
      "A charming 650 sq. ft. apartment in the heart of Tallinn. This cozy space features two bedrooms and one bathroom, perfect for a couple of roommates.\nThe open-plan living area flows into a well-equipped kitchen, making it great for socializing. The warm, vintage-inspired décor gives it a unique character.\nLocated on Viru street, you're steps away from Old Town, shops, restaurants, and excellent public transit connections.",
    image: require("../assets/images/apartment_viru.png"),
    ownerAvatar: require("../assets/images/owner_avatar.png"),
    mapImage: require("../assets/images/map_placeholder.png"),
  },
];
