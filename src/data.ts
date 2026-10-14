export type Vehicle = "sedan" | "suv" | "van" | "truck";
export type Climate = "cold" | "mild" | "hot";
export type Companion = "partner" | "kids" | "pet";

export type ChecklistItem = {
  id: string;
  title: string;
  why: string;
  safety?: boolean;
};

export type Phase = { id: string; name: string; items: ChecklistItem[] };

export const PHASES: Phase[] = [
  {
    id: "p4",
    name: "3–4 weeks out",
    items: [
      { id: "mail", title: "Set up a mailing address", why: "A UPS Store or private mailbox gives you a street address for banks, DMV and jobs. A USPS PO box works for most other mail." },
      { id: "gym", title: "Get a gym membership for showers", why: "A low-cost chain with many locations covers showers, restrooms and a warm place in the morning." },
      { id: "service", title: "Get the car serviced", why: "Oil, battery, tires, brakes. The car is now your house, so a breakdown costs more than a repair." },
      { id: "ins", title: "Call your auto insurer", why: "Confirm your coverage and update your address. Ask what happens if you're living in the vehicle." },
      { id: "stuff", title: "Sort your things: keep, store, sell", why: "Keep about two bins of clothes. Selling furniture can fund your first month." },
    ],
  },
  {
    id: "p2",
    name: "1–2 weeks out",
    items: [
      { id: "covers", title: "Make window covers", why: "Cut black foam board or reflective insulation to fit each window. Privacy and temperature both improve." },
      { id: "bed", title: "Set up a sleeping layout", why: "Fold the seats flat or build a simple platform. Test it for a full night before you move." },
      { id: "vent", title: "Buy window rain guards", why: "They let you crack the windows for air without rain getting in or the gap looking obvious." },
      { id: "co", title: "Buy a battery CO detector", why: "Essential if you ever use any heater. Never run the engine to stay warm in a closed or snow-blocked space.", safety: true },
      { id: "power", title: "Get a portable power bank", why: "One you can charge while driving keeps your phone alive overnight." },
      { id: "docs", title: "Gather documents in one folder", why: "ID, birth certificate, title, registration, insurance card. Keep it hidden and always in the car.", safety: true },
    ],
  },
  {
    id: "p0",
    name: "Move-out week",
    items: [
      { id: "211", title: "Call 211 about safe parking", why: "Ask about safe parking lots, shower programs and rehousing help in your area." },
      { id: "spots", title: "Scout three overnight spots", why: "Visit in daylight and at night. Note restrooms, lighting, and who else parks there." },
      { id: "contact", title: "Pick a check-in person", why: "Someone who knows roughly where you park each night and who you text each morning.", safety: true },
      { id: "water", title: "Stock water and food", why: "At least two gallons of water, and food that needs no cooking." },
      { id: "toilet", title: "Set up a backup toilet", why: "A wide-mouth bottle or bucket with a lid for nights when nothing is open." },
    ],
  },
  {
    id: "pa",
    name: "First month",
    items: [
      { id: "routine", title: "Build a daily routine", why: "Same gym, same library, same lunch spot. Routine makes this more manageable." },
      { id: "budget", title: "Check your budget against real spending", why: "Use the Budget tab. Gas and eating out often run higher than expected." },
      { id: "goal", title: "Set a savings goal for your next place", why: "Deposit plus first month's rent is a common target." },
    ],
  },
];

export const ALL_ITEMS = PHASES.flatMap((p) => p.items);

export const NIGHT_ROUTINE = [
  "Tell your check-in person where you're parked",
  "Phone and power bank charged",
  "Window covers up",
  "Two windows cracked about an inch",
  "Doors locked, keys in the same spot every night",
  "CO detector on, engine off",
  "Water and toilet within reach",
  "Parked facing out so you can leave fast",
];

export const SPOT_TIPS: { text: string; warn?: boolean }[] = [
  { text: "Ask your city or county about a safe parking program. Many run lots with security and restrooms for people sleeping in vehicles." },
  { text: "Store lots, gyms and 24-hour businesses each set their own rules. Ask the manager before you stay, and rotate spots." },
  { text: "Arrive after dark, leave early, and keep the car looking like a parked car: covers up, lights off, nothing on the dash." },
  { text: "Local overnight-parking laws vary a lot. Check your city's rules, and leave calmly if police or staff ask you to move.", warn: true },
];

export const HOTLINES = [
  { number: "211", dial: "211", sms: true, desc: "Local housing help, shelters, safe parking, food, showers. Call or text." },
  { number: "988", dial: "988", sms: true, desc: "Suicide & Crisis Lifeline. Call or text, any time." },
  { number: "1-800-799-7233", dial: "18007997233", sms: false, desc: "National Domestic Violence Hotline." },
  { number: "911", dial: "911", sms: false, desc: "Emergencies, or if you feel unsafe where you're parked." },
];

export const NOW_LABELS = {
  rent: "Rent or mortgage",
  util: "Utilities",
  ins: "Renters insurance",
  internet: "Home internet",
} as const;

export const CAR_LABELS = {
  gym: "Gym (showers)",
  mailbox: "Mailbox",
  storage: "Storage unit",
  phone: "Phone + hotspot",
  gas: "Gas (more driving)",
  food: "Food (less cooking)",
  laundry: "Laundromat",
  parking: "Paid parking",
} as const;

export type NowCosts = Record<keyof typeof NOW_LABELS, number>;
export type CarCosts = Record<keyof typeof CAR_LABELS, number>;

export type Profile = { vehicle: Vehicle; climate: Climate; who: Companion[] };

export function tailoredTips(p: Profile): { text: string; warn?: boolean }[] {
  const t: { text: string; warn?: boolean }[] = [];
  if (p.climate === "cold") t.push({ warn: true, text: "Cold nights: a 0°F-rated sleeping bag and wool layers do more than any heater. Never sleep with the engine running." });
  if (p.climate === "hot") t.push({ warn: true, text: "Hot weather: a car can pass 120°F in an hour. Park in shade, use window covers on the sun side, and plan cool daytime places." });
  if (p.climate === "mild") t.push({ text: "Mild weather: condensation is the main issue. Crack two windows on opposite sides and wipe down glass each morning." });
  if (p.who.includes("pet")) t.push({ warn: true, text: "Your pet can never be left in the car in warm weather, even with windows cracked. Line up pet-friendly daytime spots." });
  if (p.who.includes("kids")) t.push({ text: "With kids: ask 211 about family shelters and school support. Schools must help students without stable housing stay enrolled under the McKinney-Vento Act." });
  if (p.who.includes("partner")) t.push({ text: "With a partner: split the car into two personal zones and agree on a nightly routine so you're not negotiating at 11pm." });
  const v: Record<Vehicle, string> = {
    sedan: "Sedan: check if your rear seats fold into the trunk. Many people sleep diagonally with feet in the trunk.",
    suv: "SUV: fold the rear seats flat and measure. A trifold foam mattress usually fits without a platform.",
    van: "Van: you have room for a fixed bed and storage drawers. Keep the build simple until you've lived in it a few weeks.",
    truck: "Pickup: a locking cap on the bed turns it into a sleeping space. Secure everything in the cab overnight.",
  };
  t.push({ text: v[p.vehicle] });
  return t;
}
