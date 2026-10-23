export const site = {
  name: "Carew & Company Marine Survey",
  shortName: "CCMS",
  owner: "Stanley Carew",
  ownerTitle: "President",
  founded: 1980,
  yearsInBusiness: 46,
  domain: "ccms-survey.com",
  url: "https://ccms-survey.com",
  phone: "(310) 713-2982",
  phoneHref: "tel:+13107132982",
  email: "carew@ccms-survey.com",
  streetAddress: {
    line1: "1816 247th Pl",
    city: "Lomita",
    state: "CA",
    zip: "90717",
  },
  mailingAddress: {
    line1: "PO Box 332",
    city: "Harbor City",
    state: "CA",
    zip: "90710",
  },
  hours: "Monday–Friday, 9:00 AM – 5:00 PM",
  linkedin: "https://www.linkedin.com/in/stanley-carew-b4641616",
  yelp: "https://www.yelp.com/biz/carew-and-co-marine-survey-harbor-city-3",
  description:
    "Independent marine surveying and inspection of freight containers and intermodal equipment at the Ports of Los Angeles & Long Beach since 1980.",
  // Centered on the San Pedro Bay port complex (Port of LA / Long Beach)
  mapEmbedUrl:
    "https://www.google.com/maps?q=Port+of+Los+Angeles+and+Port+of+Long+Beach&z=12&output=embed",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const equipmentTypes = [
  "Dry Containers",
  "Reefer Containers",
  "Marine Chassis",
  "IMO Tanks",
  "Power Packs",
  "Offshore Containers",
] as const;

export const locations = [
  "Port of Los Angeles",
  "Port of Long Beach",
  "Depot / Terminal",
  "Other",
] as const;
