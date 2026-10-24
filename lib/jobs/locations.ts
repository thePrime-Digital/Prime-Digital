/**
 * Prime Digital School - Job Connect
 * India location registry and normalization.
 *
 * This is an initial registry, not an exhaustive
 * list of Indian districts and municipalities.
 */

export const INDIA_COUNTRY = {
  code: "IN",
  name: "India",
} as const;

export type IndiaRegion = {
  name: string;
  code: string;
  type: "state" | "union-territory";
  cities: string[];
};

export const INDIA_REGIONS: IndiaRegion[] = [
  {
    name: "Andhra Pradesh",
    code: "AP",
    type: "state",
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
  },
  {
    name: "Arunachal Pradesh",
    code: "AR",
    type: "state",
    cities: ["Itanagar", "Naharlagun"],
  },
  {
    name: "Assam",
    code: "AS",
    type: "state",
    cities: ["Guwahati", "Dibrugarh", "Silchar"],
  },
  {
    name: "Bihar",
    code: "BR",
    type: "state",
    cities: ["Patna", "Gaya", "Muzaffarpur"],
  },
  {
    name: "Chhattisgarh",
    code: "CG",
    type: "state",
    cities: ["Raipur", "Bhilai", "Bilaspur"],
  },
  {
    name: "Goa",
    code: "GA",
    type: "state",
    cities: ["Panaji", "Margao", "Vasco da Gama"],
  },
  {
    name: "Gujarat",
    code: "GJ",
    type: "state",
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  },
  {
    name: "Haryana",
    code: "HR",
    type: "state",
    cities: ["Gurugram", "Faridabad", "Panipat", "Sonipat", "Rohtak"],
  },
  {
    name: "Himachal Pradesh",
    code: "HP",
    type: "state",
    cities: ["Shimla", "Solan", "Dharamshala"],
  },
  {
    name: "Jharkhand",
    code: "JH",
    type: "state",
    cities: ["Ranchi", "Jamshedpur", "Dhanbad"],
  },
  {
    name: "Karnataka",
    code: "KA",
    type: "state",
    cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  },
  {
    name: "Kerala",
    code: "KL",
    type: "state",
    cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  },
  {
    name: "Madhya Pradesh",
    code: "MP",
    type: "state",
    cities: ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"],
  },
  {
    name: "Maharashtra",
    code: "MH",
    type: "state",
    cities: [
      "Mumbai",
      "Navi Mumbai",
      "Pune",
      "Thane",
      "Panvel",
      "Nagpur",
      "Nashik",
      "Aurangabad",
      "Chhatrapati Sambhajinagar",
      "Kolhapur",
      "Solapur",
    ],
  },
  {
    name: "Manipur",
    code: "MN",
    type: "state",
    cities: ["Imphal"],
  },
  {
    name: "Meghalaya",
    code: "ML",
    type: "state",
    cities: ["Shillong", "Tura"],
  },
  {
    name: "Mizoram",
    code: "MZ",
    type: "state",
    cities: ["Aizawl"],
  },
  {
    name: "Nagaland",
    code: "NL",
    type: "state",
    cities: ["Kohima", "Dimapur"],
  },
  {
    name: "Odisha",
    code: "OD",
    type: "state",
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  },
  {
    name: "Punjab",
    code: "PB",
    type: "state",
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Mohali", "Patiala"],
  },
  {
    name: "Rajasthan",
    code: "RJ",
    type: "state",
    cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  },
  {
    name: "Sikkim",
    code: "SK",
    type: "state",
    cities: ["Gangtok"],
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    type: "state",
    cities: [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
      "Hosur",
    ],
  },
  {
    name: "Telangana",
    code: "TS",
    type: "state",
    cities: ["Hyderabad", "Warangal", "Karimnagar"],
  },
  {
    name: "Tripura",
    code: "TR",
    type: "state",
    cities: ["Agartala"],
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    type: "state",
    cities: [
      "Noida",
      "Greater Noida",
      "Ghaziabad",
      "Lucknow",
      "Kanpur",
      "Agra",
      "Varanasi",
      "Prayagraj",
      "Meerut",
    ],
  },
  {
    name: "Uttarakhand",
    code: "UK",
    type: "state",
    cities: ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  },
  {
    name: "West Bengal",
    code: "WB",
    type: "state",
    cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
  },
  {
    name: "Andaman and Nicobar Islands",
    code: "AN",
    type: "union-territory",
    cities: ["Sri Vijaya Puram"],
  },
  {
    name: "Chandigarh",
    code: "CH",
    type: "union-territory",
    cities: ["Chandigarh"],
  },
  {
    name: "Dadra and Nagar Haveli and Daman and Diu",
    code: "DD",
    type: "union-territory",
    cities: ["Daman", "Diu", "Silvassa"],
  },
  {
    name: "Delhi",
    code: "DL",
    type: "union-territory",
    cities: ["New Delhi", "Delhi"],
  },
  {
    name: "Jammu and Kashmir",
    code: "JK",
    type: "union-territory",
    cities: ["Srinagar", "Jammu"],
  },
  {
    name: "Ladakh",
    code: "LA",
    type: "union-territory",
    cities: ["Leh", "Kargil"],
  },
  {
    name: "Lakshadweep",
    code: "LD",
    type: "union-territory",
    cities: ["Kavaratti"],
  },
  {
    name: "Puducherry",
    code: "PY",
    type: "union-territory",
    cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  },
];

const CITY_ALIASES: Record<string, string> = {
  bangalore: "Bengaluru",
  bombay: "Mumbai",
  "new bombay": "Navi Mumbai",
  "navi bombay": "Navi Mumbai",
  gurgaon: "Gurugram",
  calcutta: "Kolkata",
  madras: "Chennai",
  cochin: "Kochi",
  trivandrum: "Thiruvananthapuram",
  mysore: "Mysuru",
  mangalore: "Mangaluru",
  baroda: "Vadodara",
  allahabad: "Prayagraj",
  pondicherry: "Puducherry",
  "port blair": "Sri Vijaya Puram",
  "aai industrial area": "Navi Mumbai",
  "cbd belapur": "Navi Mumbai",
  airoli: "Navi Mumbai",
  ghansoli: "Navi Mumbai",
  vashi: "Navi Mumbai",
  nerul: "Navi Mumbai",
  kharghar: "Navi Mumbai",
  mahape: "Navi Mumbai",
  "new delhi": "New Delhi",
};

function normalizeKey(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[.,_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const cityRegistry = new Map<
  string,
  { city: string; state: string; stateCode: string }
>();

for (const region of INDIA_REGIONS) {
  for (const city of region.cities) {
    cityRegistry.set(normalizeKey(city), {
      city,
      state: region.name,
      stateCode: region.code,
    });
  }
}

const regionRegistry = new Map<string, IndiaRegion>();

for (const region of INDIA_REGIONS) {
  regionRegistry.set(normalizeKey(region.name), region);
}

export type NormalizedIndiaLocation = {
  countryCode: "IN";
  country: "India";
  state: string | null;
  stateCode: string | null;
  city: string | null;
  locationLabel: string;
};

export function getIndianStates(): IndiaRegion[] {
  return INDIA_REGIONS.filter((region) => region.type === "state");
}

export function getIndianUnionTerritories(): IndiaRegion[] {
  return INDIA_REGIONS.filter((region) => region.type === "union-territory");
}

export function getCitiesByRegion(regionCode: string): string[] {
  const region = INDIA_REGIONS.find(
    (item) => item.code.toLowerCase() === regionCode.toLowerCase(),
  );

  return region?.cities ?? [];
}

export function normalizeIndianCity(value: string): string | null {
  const key = normalizeKey(value);
  const canonical = CITY_ALIASES[key] ?? value.trim();

  return cityRegistry.get(normalizeKey(canonical))?.city ?? null;
}

export function normalizeIndiaLocation(
  rawLocation: string,
): NormalizedIndiaLocation {
  const original = rawLocation.trim();

  const empty: NormalizedIndiaLocation = {
    countryCode: "IN",
    country: "India",
    state: null,
    stateCode: null,
    city: null,
    locationLabel: original || "Location not specified",
  };

  if (!original) return empty;

  const parts = original
    .split(/[,|]/)
    .map((part) => part.trim())
    .filter(Boolean);

  // Match a complete city name, including known aliases.
  for (const part of parts) {
    const city = normalizeIndianCity(part);

    if (!city) continue;

    const record = cityRegistry.get(normalizeKey(city));

    if (!record) continue;

    return {
      countryCode: "IN",
      country: "India",
      state: record.state,
      stateCode: record.stateCode,
      city: record.city,
      locationLabel: `${record.city}, ${record.state}, India`,
    };
  }

  // A state-only listing must not invent a city.
  for (const part of parts) {
    const region = regionRegistry.get(normalizeKey(part));

    if (!region) continue;

    return {
      countryCode: "IN",
      country: "India",
      state: region.name,
      stateCode: region.code,
      city: null,
      locationLabel: `${region.name}, India`,
    };
  }

  // Unknown places remain unclassified for review.
  return empty;
}

export const INDIA_MAJOR_HIRING_CITIES = [
  "Mumbai",
  "Navi Mumbai",
  "Pune",
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "New Delhi",
  "Gurugram",
  "Noida",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Kochi",
  "Coimbatore",
  "Indore",
  "Surat",
  "Nagpur",
  "Bhubaneswar",
  "Lucknow",
  "Visakhapatnam",
] as const;
