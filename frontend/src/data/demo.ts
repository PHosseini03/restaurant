// Fictional demo data. Mirrors the backend seed so the site works offline.
export type Category = "starters" | "wood-fire" | "mains" | "sides" | "desserts" | "drinks";
export type Tag = "vegetarian" | "vegan" | "gluten-free";

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  tags: Tag[];
  image: string | null;
  special: boolean;
}

export interface DayHours {
  day: string;
  open: string | null;
  close: string | null;
}

export interface HoursInfo {
  weekly: DayHours[];
  address: string;
  phone: string;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "starters", label: "Vorspeisen" },
  { id: "wood-fire", label: "Aus dem Holzofen" },
  { id: "mains", label: "Hauptgerichte" },
  { id: "sides", label: "Beilagen" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Getränke" },
];

export const TAGS: { id: Tag; label: string; short: string }[] = [
  { id: "vegetarian", label: "Vegetarisch", short: "V" },
  { id: "vegan", label: "Vegan", short: "VG" },
  { id: "gluten-free", label: "Glutenfrei", short: "GF" },
];

const item = (id: number, name: string, description: string, price: number, category: Category, tags: Tag[], image: string | null = null, special = false): MenuItem => ({ id, name, description, price, category, tags, image, special });

export const DEMO_MENU: MenuItem[] = [
  item(1, "Glutgeröstetes Knochenmark", "Geröstetes Sauerteigbrot, Petersilien-Kapern-Salat, geräuchertes Meersalz", 18, "starters", []),
  item(2, "Burrata & geschmorte Tomaten", "Im Holzfeuer geschmorte Tomaten, Basilikumöl, gereifter Balsamico", 16, "starters", ["vegetarian", "gluten-free"]),
  item(3, "Avocado-Toast vom Grill", "Gegrilltes Sauerteigbrot, wachsweiches Ei, Chili-Crunch, Microgreens", 14, "starters", ["vegetarian"], "/images/dish-toast.jpg"),
  item(4, "Oktopus aus der Flamme", "Geräuchertes Paprikapulver, knusprige Kartoffeln, Zitronen-Aioli", 22, "starters", ["gluten-free"]),
  item(5, "Flammbrot aus dem Holzofen", "San-Marzano-Tomate, Fior di Latte, wilder Oregano, Chili-Honig", 19, "wood-fire", ["vegetarian"], "/images/dish-flatbread.jpg", true),
  item(6, "Eichengeräucherte Short Rib", "12 Stunden geräucherte Rinderrippe, Bourbon-Glasur, eingelegte Schalotten", 38, "wood-fire", ["gluten-free"], "/images/dish-ribs.jpg", true),
  item(7, "Blumenkohl aus dem Ofen", "Ganzer Blumenkohl, Tahini, Granatapfel, Dukkah", 24, "wood-fire", ["vegan", "gluten-free"]),
  item(8, "Dry-Aged Ribeye 450 g", "45 Tage trocken gereift, Glutbutter, handgeschnittene Pommes", 64, "mains", ["gluten-free"], "/images/dish-steak.jpg", true),
  item(9, "Salat mit gegrilltem Nierenzapfen", "Chimichurri, geröstete Zwiebeln, Cashewkerne, Chili", 32, "mains", ["gluten-free"], "/images/dish-ribs.jpg"),
  item(10, "Lachs vom Zedernholzbrett", "Zitrusglasur, gegrillter Brokkolini, Wildreis", 34, "mains", ["gluten-free"]),
  item(11, "Bowl aus dem Garten", "Gerösteter Kürbis, Kichererbsen, Avocado, Blattsalat, Miso-Limetten-Dressing", 21, "mains", ["vegan", "gluten-free"], "/images/dish-bowl.jpg"),
  item(12, "Trüffel-Pommes", "Parmesan, Rosmarinsalz, Trüffel-Aioli", 11, "sides", ["vegetarian"]),
  item(13, "Gegrillter Brokkolini", "Knoblauch, Chiliflocken, Zitrone", 10, "sides", ["vegan", "gluten-free"]),
  item(14, "Schokoladentorte aus der Glut", "Ohne Mehl, dunkle Schokolade, geräuchertes Meersalz, Crème fraîche", 13, "desserts", ["vegetarian", "gluten-free"]),
  item(15, "Eisbecher mit gegrilltem Pfirsich", "Bourbon-Karamell, Vanilleeis, Haferstreusel", 12, "desserts", ["vegetarian"]),
  item(16, "Smoked Old Fashioned", "Bourbon, Demerara-Zucker, Orangenbitter, Eichenrauch", 16, "drinks", ["vegan", "gluten-free"], "/images/cocktail.jpg"),
  item(17, "Garden Spritz (alkoholfrei)", "Holunderblüte, Gurke, Minze, Sprudelwasser", 9, "drinks", ["vegan", "gluten-free"]),
];

export const DEMO_SPECIALS = DEMO_MENU.filter((m) => m.special);

export const DEMO_HOURS: HoursInfo = {
  weekly: [
    { day: "Montag", open: null, close: null },
    { day: "Dienstag", open: "17:00", close: "22:00" },
    { day: "Mittwoch", open: "17:00", close: "22:00" },
    { day: "Donnerstag", open: "17:00", close: "22:00" },
    { day: "Freitag", open: "17:00", close: "23:00" },
    { day: "Samstag", open: "17:00", close: "23:00" },
    { day: "Sonntag", open: "12:00", close: "21:00" },
  ],
  address: "Ihre Adresse hier",
  phone: "Ihre Telefonnummer hier",
};

export const CONTACT = { phone: DEMO_HOURS.phone, email: "tisch@emberandoak.example", address: DEMO_HOURS.address };
