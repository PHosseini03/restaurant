"""Create tables and seed fictional demo data."""
import json
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL,
    price REAL NOT NULL, category TEXT NOT NULL, tags TEXT NOT NULL,
    image TEXT, special INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT NOT NULL, date TEXT NOT NULL, time TEXT NOT NULL, party_size INTEGER NOT NULL,
    occasion TEXT NOT NULL, notes TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS event_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT NOT NULL, event_date TEXT NOT NULL, guests INTEGER NOT NULL,
    event_type TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""

V, VG, GF = "vegetarian", "vegan", "gluten-free"

MENU = [
    (1, "Glutgeröstetes Knochenmark", "Geröstetes Sauerteigbrot, Petersilien-Kapern-Salat, geräuchertes Meersalz", 18, "starters", [], None, 0),
    (2, "Burrata & geschmorte Tomaten", "Im Holzfeuer geschmorte Tomaten, Basilikumöl, gereifter Balsamico", 16, "starters", [V, GF], None, 0),
    (3, "Avocado-Toast vom Grill", "Gegrilltes Sauerteigbrot, wachsweiches Ei, Chili-Crunch, Microgreens", 14, "starters", [V], "/images/dish-toast.jpg", 0),
    (4, "Oktopus aus der Flamme", "Geräuchertes Paprikapulver, knusprige Kartoffeln, Zitronen-Aioli", 22, "starters", [GF], None, 0),
    (5, "Flammbrot aus dem Holzofen", "San-Marzano-Tomate, Fior di Latte, wilder Oregano, Chili-Honig", 19, "wood-fire", [V], "/images/dish-flatbread.jpg", 1),
    (6, "Eichengeräucherte Short Rib", "12 Stunden geräucherte Rinderrippe, Bourbon-Glasur, eingelegte Schalotten", 38, "wood-fire", [GF], "/images/dish-ribs.jpg", 1),
    (7, "Blumenkohl aus dem Ofen", "Ganzer Blumenkohl, Tahini, Granatapfel, Dukkah", 24, "wood-fire", [VG, GF], None, 0),
    (8, "Dry-Aged Ribeye 450 g", "45 Tage trocken gereift, Glutbutter, handgeschnittene Pommes", 64, "mains", [GF], "/images/dish-steak.jpg", 1),
    (9, "Salat mit gegrilltem Nierenzapfen", "Chimichurri, geröstete Zwiebeln, Cashewkerne, Chili", 32, "mains", [GF], "/images/dish-ribs.jpg", 0),
    (10, "Lachs vom Zedernholzbrett", "Zitrusglasur, gegrillter Brokkolini, Wildreis", 34, "mains", [GF], None, 0),
    (11, "Bowl aus dem Garten", "Gerösteter Kürbis, Kichererbsen, Avocado, Blattsalat, Miso-Limetten-Dressing", 21, "mains", [VG, GF], "/images/dish-bowl.jpg", 0),
    (12, "Trüffel-Pommes", "Parmesan, Rosmarinsalz, Trüffel-Aioli", 11, "sides", [V], None, 0),
    (13, "Gegrillter Brokkolini", "Knoblauch, Chiliflocken, Zitrone", 10, "sides", [VG, GF], None, 0),
    (14, "Schokoladentorte aus der Glut", "Ohne Mehl, dunkle Schokolade, geräuchertes Meersalz, Crème fraîche", 13, "desserts", [V, GF], None, 0),
    (15, "Eisbecher mit gegrilltem Pfirsich", "Bourbon-Karamell, Vanilleeis, Haferstreusel", 12, "desserts", [V], None, 0),
    (16, "Smoked Old Fashioned", "Bourbon, Demerara-Zucker, Orangenbitter, Eichenrauch", 16, "drinks", [VG, GF], "/images/cocktail.jpg", 0),
    (17, "Garden Spritz (alkoholfrei)", "Holunderblüte, Gurke, Minze, Sprudelwasser", 9, "drinks", [VG, GF], None, 0),
]


def seed(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM menu_items").fetchone()[0] == 0:
        conn.executemany(
            "INSERT INTO menu_items VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [(m[0], m[1], m[2], m[3], m[4], json.dumps(m[5]), m[6], m[7]) for m in MENU],
        )
    conn.commit()
