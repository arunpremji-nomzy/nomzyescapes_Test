import fortkochiAsset from "@/assets/dest-fortkochi.jpg.asset.json";
import varkalaAsset from "@/assets/dest-varkala.jpg.asset.json";
import alleppeyAsset from "@/assets/dest-alleppey.jpg.asset.json";
const fortkochi = fortkochiAsset.url;
const varkala = varkalaAsset.url;
const alleppey = alleppeyAsset.url;

export type Destination = {
  slug: "fort-kochi" | "varkala" | "alleppey";
  name: string;
  region: string;
  image: string;
  tagline: string;
  startingPrice: number;
  weeklyPrice: string;
  monthlyPrice: string;
  wifi: string;
  stays: number;
  bestFor: string;
  stayLength: string;
  blurb: string;
  overview: string;
  vibe: string[];
  workation: string;
  highlights: { title: string; body: string }[];
  experiences: string[];
  signatureExperience: string;
  bestSeason: string;
  dayInLife: { time: string; title: string; body: string }[];
  logistics: { label: string; value: string }[];
  pricing: { label: string; value: string; note: string }[];
  faqs: { q: string; a: string }[];
  nearby: { name: string; distance: string; note: string }[];
};

const baseDayInLife = [
  { time: "06:30", title: "Slow start", body: "Sunrise, filter coffee on the verandah, a long walk before the day begins." },
  { time: "09:00", title: "Deep work block", body: "Three hours of uninterrupted focus at your stay's dedicated workspace." },
  { time: "12:30", title: "Local lunch", body: "A short walk to a neighbourhood spot — banana-leaf thali or fresh seafood." },
  { time: "14:00", title: "Calls & collaboration", body: "Afternoons sync with European mornings — fibre wifi handles video reliably." },
  { time: "18:00", title: "Switch off", body: "Sunset ritual, a swim, yoga, or a wander through the lanes." },
  { time: "20:00", title: "Long dinner", body: "Cook-led tasting menus, beach shacks, or a quiet meal with new friends." },
];


export const destinations: Destination[] = [
  {
    slug: "fort-kochi",
    name: "Fort Kochi",
    region: "Coastal Heritage",
    image: fortkochi,
    tagline: "Colonial streets. Café culture. Urban workation vibe.",
    startingPrice: 2800,
    weeklyPrice: "₹18,000+",
    monthlyPrice: "₹55,000+",
    bestFor: "Creative Professionals",
    stayLength: "1–4 Weeks",
    wifi: "High-speed fibre",
    stays: 12,
    blurb: "Heritage homes, art-filled lanes, and a thriving café-coworking scene by the harbour.",
    overview:
      "Fort Kochi is where five centuries of Portuguese, Dutch, and British trade still echo in pastel facades and shaded courtyards. Today, it is one of India's most walkable creative cities — a place where you can take a morning call from a 19th-century verandah and end the day at a gallery opening.",
    vibe: ["Heritage", "Cafés", "Art", "Walkable", "Cosmopolitan"],
    workation:
      "An urban workation for people who like a city's pulse. Compact streets, reliable fibre, and a tight-knit nomad community make it ideal for stays of two weeks to two months.",
    highlights: [
      { title: "Heritage Stays", body: "Restored colonial homes turned into boutique guesthouses with private workspaces." },
      { title: "Café Culture", body: "Specialty coffee, slow breakfasts, all-day desks — the city runs on espresso." },
      { title: "Art & Culture", body: "Galleries from the Kochi-Muziris Biennale circuit and weekly studio openings." },
      { title: "Walkable Lifestyle", body: "Everything within fifteen minutes on foot. Bicycle the rest." },
      { title: "Reliable Connectivity", body: "Fibre internet across most heritage stays and dedicated coworking spaces." },
    ],
    experiences: ["Heritage Walks", "Gallery Hopping", "Chinese Fishing Nets at Dusk", "Spice Market Tours", "Jewish Quarter"],
    signatureExperience: "Heritage Walks",
    bestSeason: "October — March",
    dayInLife: baseDayInLife,
    logistics: [
      { label: "Nearest airport", value: "Cochin International (COK) — 45 min by taxi" },
      { label: "Rail head", value: "Ernakulam Junction — 30 min, then ferry or auto" },
      { label: "Local transport", value: "Walkable. Auto-rickshaws and ferries for the wider city." },
      { label: "Language", value: "Malayalam · English widely spoken" },
      { label: "Power", value: "230V, Type C/D/M sockets · stable supply" },
      { label: "Coworking", value: "3 verified spaces within walking distance" },
    ],
    pricing: [
      { label: "Weekly stay", value: "₹18,000+", note: "Heritage guesthouse, private room, breakfast." },
      { label: "Monthly stay", value: "₹55,000+", note: "Boutique studio with dedicated desk and fibre." },
      { label: "Coworking day pass", value: "₹400", note: "Drop-in at partner spaces, includes coffee." },
      { label: "Meals", value: "₹250 — ₹900", note: "From local thali to harbourfront tasting menus." },
    ],
    faqs: [
      { q: "How reliable is the wifi for video calls?", a: "Every Nomzy-verified stay in Fort Kochi runs on high-speed fibre with a 4G backup, tested for sustained video calls and screen-share." },
      { q: "Is it walkable without a scooter?", a: "Yes — the entire heritage quarter is fifteen minutes end to end. Ferries connect you to Ernakulam in under ten minutes." },
      { q: "What's the best time to visit?", a: "October to March is dry and mild. December coincides with the Kochi-Muziris Biennale in Biennale years." },
      { q: "Can I extend my stay?", a: "Most partners offer flexible weekly extensions subject to availability. We help you secure long-stay rates." },
    ],
    nearby: [
      { name: "Mattancherry", distance: "10 min", note: "Spice warehouses, Paradesi Synagogue, antique lanes." },
      { name: "Cherai Beach", distance: "45 min", note: "Long, quiet beach for an afternoon reset." },
      { name: "Munnar Hills", distance: "4 hr", note: "Tea estates and cool air for a weekend escape." },
    ],
  },
  {
    slug: "varkala",
    name: "Varkala",
    region: "Arabian Sea Cliffs",
    image: varkala,
    tagline: "Cliffside ocean views. Surf, yoga, and ocean-view desks.",
    startingPrice: 2600,
    weeklyPrice: "₹20,000+",
    monthlyPrice: "₹60,000+",
    bestFor: "Wellness & Surf",
    stayLength: "2–8 Weeks",
    wifi: "High-speed fibre",
    stays: 13,
    blurb: "Red cliffs above the Arabian Sea, a long-running nomad community, and the best sunsets in Kerala.",
    overview:
      "Varkala is built along a single, dramatic red-laterite cliff that drops into the Arabian Sea. The cliff path is lined with cafés, yoga shalas, and surf shops — a small, walkable strip that has quietly become one of South Asia's most loved long-stay destinations for remote workers.",
    vibe: ["Beach", "Surf", "Yoga", "Wellness", "Sunsets"],
    workation:
      "Mornings for surf or sun salutations. Afternoons for deep work with the ocean on the horizon. Varkala suits creatives, founders, and writers who need scale-out time outside the call.",
    highlights: [
      { title: "Beachfront Stays", body: "Cliff-edge studios and garden cottages with sea-facing workspaces." },
      { title: "Surf Lifestyle", body: "Year-round beach breaks suitable for beginners and improvers." },
      { title: "Yoga & Wellness", body: "Daily drop-in classes, week-long retreats, and authentic Ayurveda." },
      { title: "Ocean-View Workspaces", body: "Verified cafés and stays with stable wifi and a horizon view." },
      { title: "Digital Nomad Community", body: "A long-standing, international community — easy to land, hard to leave." },
    ],
    experiences: ["Sunset Surf Sessions", "Cliffside Yoga", "Ayurvedic Treatments", "Janardanaswamy Temple", "Kappil Backwaters Day Trip"],
    signatureExperience: "Surf & Yoga",
    bestSeason: "November — March",
    dayInLife: [
      { time: "06:00", title: "Dawn surf", body: "Clean morning sets at Black Beach. Boards from the local shacks." },
      { time: "08:30", title: "Cliffside breakfast", body: "Fresh fruit, dosa, and filter coffee with the Arabian Sea at eye level." },
      { time: "10:00", title: "Deep work block", body: "Studio desk with sea view — fibre wifi rated for video." },
      { time: "13:30", title: "Long lunch", body: "Catch of the day at a cliff café, then a short nap in the shade." },
      { time: "15:00", title: "Calls", body: "Afternoons align with European mornings — bookable quiet rooms when needed." },
      { time: "18:00", title: "Sunset yoga", body: "Open-air shala on the cliff, finishing as the sun drops into the sea." },
    ],
    logistics: [
      { label: "Nearest airport", value: "Trivandrum International (TRV) — 1 hr by taxi" },
      { label: "Rail head", value: "Varkala Sivagiri — 10 min from the cliff" },
      { label: "Local transport", value: "Walkable cliff strip. Scooters ₹400/day for exploring." },
      { label: "Language", value: "Malayalam · English fluent along the cliff" },
      { label: "Power", value: "230V, occasional brownouts — partners run inverters." },
      { label: "Coworking", value: "2 dedicated spaces + verified café desks" },
    ],
    pricing: [
      { label: "Weekly stay", value: "₹20,000+", note: "Cliff-edge cottage, breakfast included." },
      { label: "Monthly stay", value: "₹60,000+", note: "Sea-view studio with workspace and kitchenette." },
      { label: "Surf lesson", value: "₹1,500", note: "90-minute private lesson with board and rashguard." },
      { label: "Yoga drop-in", value: "₹500", note: "Vinyasa, ashtanga, or yin — multiple shalas daily." },
    ],
    faqs: [
      { q: "Can I learn to surf here as a beginner?", a: "Yes. Varkala's beach breaks are forgiving and there are certified instructors year-round. Most guests are riding waves within a week." },
      { q: "Is the cliff safe at night?", a: "Very. The strip is well-lit, social, and walkable. It's the safest pedestrian zone in the region." },
      { q: "Will my call drop during monsoon?", a: "We don't recommend Varkala in June–August. Outside that window, our verified stays maintain stable fibre." },
      { q: "Are there long-stay discounts?", a: "Yes — 4-week and 8-week packages with a ~20% discount, plus included airport transfer." },
    ],
    nearby: [
      { name: "Kappil Backwaters", distance: "15 min", note: "Where the backwater meets the sea — quiet kayaking." },
      { name: "Anjengo Fort", distance: "30 min", note: "Coastal Dutch-era fort, lighthouse, fisherman village." },
      { name: "Poovar Island", distance: "1.5 hr", note: "Estuary islands, mangroves, golden-sand beach." },
    ],
  },
  {
    slug: "alleppey",
    name: "Alleppey",
    region: "Backwaters",
    image: alleppey,
    tagline: "Backwater scenery. Slow living. Quiet productivity.",
    startingPrice: 3200,
    weeklyPrice: "₹22,000+",
    monthlyPrice: "₹65,000+",
    bestFor: "Deep Work & Slow Living",
    stayLength: "1–12 Weeks",
    wifi: "High-speed fibre",
    stays: 11,
    blurb: "Lakeside villas, traditional houseboats, and a quiet rhythm built for long, focused stays.",
    overview:
      "Alleppey — Alappuzha to locals — is a network of palm-shaded canals, paddy fields below sea level, and quiet villages where the only commute is by canoe. It is the slowest of our three destinations, and the most restorative.",
    vibe: ["Backwaters", "Houseboats", "Nature", "Slow Living", "Retreat"],
    workation:
      "Alleppey is for the deep-work week. Founders writing the next version of the deck, writers on a deadline, anyone who needs water and silence to think clearly.",
    highlights: [
      { title: "Backwater Villas", body: "Standalone lakeside homes with verandahs over the water and dedicated desks." },
      { title: "Houseboat Experiences", body: "Charter a traditional kettuvallam for a long weekend — wifi included." },
      { title: "Nature Retreats", body: "Birdwatching, paddle-boarding, paddy-field walks at dawn." },
      { title: "Slow Living", body: "Markets by canoe, evenings without screens, a different relationship to time." },
      { title: "Quiet Productivity", body: "Lower density, fewer distractions — perfect for shipping cycles." },
    ],
    experiences: ["Overnight Houseboat", "Kumarakom Bird Sanctuary", "Snake Boat Heritage", "Village Canoe Tours", "Toddy Tasting"],
    signatureExperience: "Backwater Exploration",
    bestSeason: "September — March",
    dayInLife: [
      { time: "06:30", title: "Canoe at dawn", body: "Glide through narrow canals as villages wake — mist on the water." },
      { time: "08:30", title: "Verandah breakfast", body: "Appam, stew, and tender coconut by the lake." },
      { time: "10:00", title: "Deep work", body: "Lakeside desk, no foot traffic, fibre stable through the day." },
      { time: "13:30", title: "Quiet lunch", body: "Home-cooked Syrian-Christian meal at the stay or a village kitchen." },
      { time: "15:30", title: "Calls", body: "Backwater backdrop on video — bookable indoor pod for noisy days." },
      { time: "18:30", title: "Sunset row", body: "Paddle-board or kayak as the light turns gold across the paddy." },
    ],
    logistics: [
      { label: "Nearest airport", value: "Cochin International (COK) — 1.5 hr by taxi" },
      { label: "Rail head", value: "Alappuzha Station — 20 min from most stays" },
      { label: "Local transport", value: "Canoe, ferry, and auto-rickshaw. Scooters for the mainland." },
      { label: "Language", value: "Malayalam · English at partner properties" },
      { label: "Power", value: "230V, full inverter backup at all Nomzy stays." },
      { label: "Coworking", value: "Stay-based workspaces · 1 lakeside coworking hub" },
    ],
    pricing: [
      { label: "Weekly stay", value: "₹22,000+", note: "Standalone lakeside cottage, breakfast included." },
      { label: "Monthly stay", value: "₹65,000+", note: "Heritage villa with private desk, kitchen, and canoe." },
      { label: "Houseboat night", value: "₹12,000+", note: "Private kettuvallam with crew, meals, and wifi." },
      { label: "Village lunch", value: "₹350", note: "Home-cooked Kerala thali with neighbouring families." },
    ],
    faqs: [
      { q: "Is it too remote for a serious work week?", a: "No. Stays are 20 minutes from the train station and run on stable fibre. The remoteness is the point — fewer distractions, more output." },
      { q: "Can I do an overnight houseboat without losing a work day?", a: "Yes. We arrange Friday-evening departures with a fixed return Saturday morning so your week stays intact." },
      { q: "What about mosquitoes?", a: "All partner stays are screened and provide repellent. Evenings on the verandah are comfortable November through March." },
      { q: "Is there a community here?", a: "Smaller and quieter than Varkala or Kochi — best for travelers who want focus. Weekly community dinners bring guests together." },
    ],
    nearby: [
      { name: "Kumarakom", distance: "1 hr", note: "Bird sanctuary, larger lake, lily-pad sunsets." },
      { name: "Marari Beach", distance: "30 min", note: "Wide, quiet beach for an unplugged afternoon." },
      { name: "Kochi", distance: "1.5 hr", note: "Heritage city escape — galleries, cafés, harbour." },
    ],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
