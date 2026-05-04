export const relicToId = {
  "Divine-Querying Master Smith" : 132,
  "As Navigator Isee Sees It": 131,
  "Diviner of Distant Reach": 130,
  "Ever-Glorious Magical Girl": 129,
  "Self-Enshrouded Recluse": 128,
  "World-Remaking Deliverer": 127,
  "Wavestrider Captain": 126,
  "Warrior Goddess of Sun and Thunder": 125,
  "Poet of Mourning Collapse": 124,
  "Hero of Triumphant Song": 123,
  "Scholar Lost in Erudition": 122,
  "Sacerdos' Relived Ordeal": 121,
  "The Wind-Soaring Valorous": 120,
  "Iron Cavalry Against the Scourge": 119,
  "Watchmaker, Master of Dream Machinations": 118,
  "Pioneer Diver of Dead Waters": 117,
  "Prisoner in Deep Confinement": 116,
  "The Ashblazing Grand Duke": 115,
  "Messenger Traversing Hackerspace": 114,
  "Longevous Disciple": 113,
  "Wastelander of Banditry Desert": 112,
  "Thief of Shooting Meteor": 111,
  "Eagle of Twilight Line": 110,
  "Band of Sizzling Thunder": 109,
  "Genius of Brilliant Stars": 108,
  "Firesmith of Lava-Forging": 107,
  "Guard of Wuthering Snow": 106,
  "Champion of Streetwise Boxing": 105,
  "Hunter of Glacial Forest": 104,
  "Knight of Purity Palace": 103,
  "Musketeer of Wild Wheat": 102,
  "Passerby of Wandering Cloud": 101
};

export const planarToId = {
  "City of Myriad Forms": 326,
  "Punklorde Stage Zero": 325,
  "Tengoku@Livestream": 324,
  "Amphoreus, The Eternal Land": 323,
  "Revelry by the Sea": 322,
  "Arcadia of Woven Dreams": 321,
  "Giant Tree of Rapt Brooding": 320,
  "Bone Collection's Serene Demesne": 319,
  "The Wondrous BananAmusement Park": 318,
  "Lushaka, the Sunken Seas": 317,
  "Forge of the Kalpagni Lantern": 316,
  "Duran, Dynasty of Running Wolves": 315,
  "Izumo Gensei and Takama Divine Realm": 314,
  "Sigonia, the Unclaimed Desolation": 313,
  "Penacony, Land of the Dreams": 312,
  "Firmament Frontline: Glamoth": 311,
  "Broken Keel": 310,
  "Rutilant Arena": 309,
  "Sprightly Vonwacq": 308,
  "Talia: Kingdom of Banditry": 307,
  "Inert Salsotto": 306,
  "Celestial Differentiator": 305,
  "Belobog of the Architects": 304,
  "Pan-Cosmic Commercial Enterprise": 303,
  "Fleet of the Ageless": 302,
  "Space Sealing Station": 301
};
export const idToRelic = Object.fromEntries(
  Object.entries(relicToId).map(([name, id]) => [id, name])
);

export const idToPlanar = Object.fromEntries(
  Object.entries(planarToId).map(([name, id]) => [id, name])
);