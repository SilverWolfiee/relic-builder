import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getData, getItem } from "@/services/hakush";
import { useLightconeStore } from "@/stores/character-store";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const lcToId = {
  "The Finale of a Lie": 23056, "When She Decided to See": 23054, "Dazzled by a Flowery World": 23053, "This Love, Forever": 23052,
  "Though Worlds Apart": 23051, "Never Forget Her Flame": 23050, "To Evernight's Stars": 23049, "Epoch Etched in Golden Blood": 23048,
  "Why Does the Ocean Sing": 23047, "The Hell Where Ideals Burn": 23046, "A Thankless Coronation": 23045, "Thus Burns the Dawn": 23044,
  "Lies Dance on the Breeze": 23043, "Long May Rainbows Adorn the Sky": 23042, "Life Should Be Cast to Flames": 23041,
  "Make Farewells More Beautiful": 23040, "Flame of Blood, Blaze My Path": 23039, "If Time Were a Flower": 23038,
  "Into the Unreachable Veil": 23037, "Time Woven Into Gold": 23036, "Long Road Leads Home": 23035, "A Grounded Ascent": 23034,
  "Ninjutsu Inscription: Dazzling Evilbreaker": 23033, "Scent Alone Stays True": 23032, "I Venture Forth to Hunt": 23031,
  "Dance at Sunset": 23030, "Those Many Springs": 23029, "Yet Hope Is Priceless": 23028, "Sailing Towards a Second Life": 23027,
  "Flowing Nightglow": 23026, "Whereabouts Should Dreams Rest": 23025, "Along the Passing Shore": 23024,
  "Inherently Unjust Destiny": 23023, "Reforged Remembrance": 23022, "Earthly Escapade": 23021, "Baptism of Pure Thought": 23020,
  "Past Self in Mirror": 23019, "An Instant Before A Gaze": 23018, "Night of Fright": 23017, "Worrisome, Blissful": 23016,
  "Brighter Than the Sun": 23015, "I Shall Be My Own Sword": 23014, "Time Waits for No One": 23013, "Sleep Like the Dead": 23012,
  "She Already Shut Her Eyes": 23011, "Before Dawn": 23010, "The Unreachable Side": 23009, "Echoes of the Coffin": 23008,
  "Incessant Rain": 23007, "Patience Is All You Need": 23006, "Moment of Victory": 23005, "In the Name of the World": 23004,
  "But the Battle Isn't Over": 23003, "Something Irreplaceable": 23002, "In the Night": 23001, "Night on the Milky Way": 23000,
  "Elation Brimming With Blessings":24006, "Memory's Curtain Never Falls": 24005, "Eternal Calculus": 24004, "Solitary Healing": 24003, "Texture of Memories": 24002,
  "Cruising in the Stellar Sea": 24001, "On the Fall of an Aeon": 24000, "Fly Into a Pink Tomorrow": 22006,
  "The Forever Victual": 22005, "The Great Cosmic Enterprise": 22004, "Ninja Record: Sound Hunt": 22003,
  "For Tomorrow's Journey": 22002, "Hey, Over Here": 22001, "Before the Tutorial Mission Starts": 22000,
  "Today's Good Luck":21065,"Mushy Shroomy's Adventures":21064,"See You at the End": 21062, "Holiday Thermae Escapade": 21061, "A Dream Scented in Wheat": 21060,
  "A Trail of Bygone Blood": 21058, "The Flower Remembers": 21057, "In Pursuit of the Wind": 21056,
  "Unto Tomorrow's Morrow": 21055, "The Story's Next Page": 21054, "Journey, Forever Peaceful": 21053,
  "Sweat Now, Cry Less": 21052, "Geniuses' Greetings": 21051, "Victory In a Blink": 21050, "Dream's Montage": 21048,
  "Shadowed by Night": 21047, "Poised to Bloom": 21046, "After the Charmony Fall": 21045, "Boundless Choreo": 21044,
  "Concert for Two": 21043, "Indelible Promise": 21042, "It's Showtime": 21041, "The Day The Cosmos Fell": 21040,
  "Destiny's Threads Forewoven": 21039, "Flames Afar": 21038, "Final Victor": 21037, "Dreamville Adventure": 21036,
  "What Is Real?": 21035, "Today Is Another Peaceful Day": 21034, "Nowhere to Run": 21033,
  "Carve the Moon, Weave the Clouds": 21032, "Return to Darkness": 21031, "This Is Me!": 21030,
  "We Will Meet Again": 21029, "Warmth Shortens Cold Nights": 21028, "The Seriousness of Breakfast": 21027,
  "Woof! Walk Time!": 21026, "Past and Future": 21025, "River Flows in Spring": 21024, "We Are Wildfire": 21023,
  "Fermata": 21022, "Quid Pro Quo": 21021, "Geniuses' Repose": 21020, "Under the Blue Sky": 21019,
  "Dance! Dance! Dance!": 21018, "Subscribe for More!": 21017, "Trend of the Universal Market": 21016,
  "Resolution Shines As Pearls of Sweat": 21015, "Perfect Timing": 21014, "Make the World Clamor": 21013,
  "A Secret Vow": 21012, "Planetary Rendezvous": 21011, "Swordplay": 21010, "Landau's Choice": 21009,
  "Eyes of the Prey": 21008, "Shared Feeling": 21007, "The Birth of the Self": 21006, "The Moles Welcome You": 21005,
  "Memories of the Past": 21004, "Only Silence Remains": 21003, "Day One of My New Life": 21002,
  "Good Night and Sleep Well": 21001, "Post-Op Conversation": 21000, "Reminiscence": 20022, "Shadowburn": 20021,
  "Sagacity": 20020, "Mediation": 20019, "Hidden Shadow": 20018, "Pioneering": 20017, "Mutual Demise": 20016,
  "Multiplication": 20015, "Adversarial": 20014, "Passkey": 20013, "Meshing Cogs": 20012, "Loop": 20011,
  "Defense": 20010, "Shattered Home": 20009, "Fine Fruit": 20008, "Darting Arrow": 20007, "Data Bank": 20006,
  "Chorus": 20005, "Void": 20004, "Amber": 20003, "Collapsing Sky": 20002, "Cornucopia": 20001, "Arrows": 20000
};

const idToLc = Object.fromEntries(Object.entries(lcToId).map(([name, id]) => [id, name]));

const getLcName = (id) => idToLc[parseInt(id)] || `${id}`;

const path = ["Knight", "nMage", "Pirest", "Rogue", "Shaman", "Warlock", "Warrior", "Memory", "Joy"];
const pathMap = { "nMage": "Mage", "Pirest": "Priest" };

export default function Lightcone() {
  const [listId, setListId] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [search, setSearch] = useState("");
  const [descLc, setDescLc] = useState({});
  const [filterBaseType, setFilterBaseType] = useState([]);
  const [filterRankType, setFilterRankType] = useState([]);
  const [id, setId, level, setLevel, rank, setRank, promotion, setPromotion] = useLightconeStore(useShallow((state) => [state.id, state.setId, state.level, state.setLevel, state.rank, state.setRank, state.promotion, state.setPromotion]));

  useEffect(() => {
    getData("lightcones", (data) => {
      setListId(Object.keys(data));
      setCharacterData(data);
    });
  }, []);

  useEffect(() => {
    if (id) {
      getItem("lightcones", id, (data) => {
        setDescLc(data);
      });
    }
  }, [id]);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleBaseChange = (baseType) => {
    setFilterBaseType((prevFilters) => (prevFilters.includes(baseType) ? prevFilters.filter((type) => type !== baseType) : [...prevFilters, baseType]));
  };

  const handleRankChange = (rankType) => {
    setFilterRankType((prevFilters) => (prevFilters.includes(rankType) ? prevFilters.filter((type) => type !== rankType) : [...prevFilters, rankType]));
  };

  const filteredId = listId.filter((lcId) => {
    const lc = characterData[lcId];
    const displayName = getLcName(lcId).toLowerCase();
    const matchesSearch = displayName.includes(search) || lcId.includes(search);
    const translatedFilters = filterBaseType.map(type => pathMap[type] || type);
    const matchesBaseType = filterBaseType.length > 0 ? translatedFilters.includes(lc?.path) : true;
    const matchesRankType = filterRankType.length > 0 ? filterRankType.some(r => r.includes(lc?.rarity?.toString())) : true;
    return matchesSearch && matchesBaseType && matchesRankType;
  });

  return (
    <div className="flex flex-col px-3">
      <span className="text-2xl font-bold mb-1">Lightcone</span>
      <Dialog>
        <DialogTrigger className="bg-black text-white dark:bg-white dark:text-black rounded-md px-5 py-2 font-semibold">Select lightcone</DialogTrigger>
        <DialogContent
          className="max-h-[800px] min-h-[800px] scroll-auto max-w-7xl overflow-auto"
          onInteractOutside={() => setSearch("")}
        >
          <DialogHeader className={"shrink"}>
            <DialogTitle>Lightcone</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-5">
            <div className="w-full">
              <Input type="text" placeholder="Search..." onChange={handleSearch} />
              <div className="flex gap-1 mt-2">
                {path.map((p) => (
                  <Path key={p} path={p} filter={handleBaseChange} base={filterBaseType} />
                ))}
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center cursor-pointer ${
                    filterRankType.includes("CombatPowerLightconeRarity5") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity5")}
                >
                  5*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center cursor-pointer ${
                    filterRankType.includes("CombatPowerLightconeRarity4") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity4")}
                >
                  4*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center cursor-pointer ${
                    filterRankType.includes("CombatPowerLightconeRarity3") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity3")}
                >
                  3*
                </div>
              </div>
            </div>

            {filteredId.reverse().map((lcId) => {
              const lc = characterData[lcId];
              if (!lc) return null;
              const displayName = getLcName(lcId);
              const rarityClass = `rarity-${lc.rarity}`;

              return (
                <DialogClose asChild key={lcId}>
                  <div
                    className={`w-[150px] border hover:border-white rounded-lg py-1 px-2 cursor-pointer transition-all ${rarityClass}`}
                    onClick={() => {
                      setId(lcId);
                      setSearch("");
                    }}
                  >
                    <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/itemfigures/lightcone/${lcId}.webp`} alt={displayName} />
                    <p className="font-semibold text-white text-center drop-shadow-md text-[10px] leading-tight px-1 h-8 flex items-center justify-center">
                      {displayName}
                    </p>
                  </div>
                </DialogClose>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2">
        <div>
          <img className="w-[300px]" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/itemfigures/lightcone/${id}.webp`} alt={id} />
          <p className="text-xl font-semibold">{getLcName(id)}</p>
        </div>
        {id && (
          <div className="flex flex-col gap-5">
            <div>
              <span>Level: {level}</span>
              <Slider className="cursor-pointer mt-1" defaultValue={[80]} value={[level]} max={80} min={1} step={1} onValueChange={([val]) => setLevel(val < 10 ? 1 : Math.floor(val / 10) * 10)} />
            </div>
            <div>
              <span>Superimpose: {rank}</span>
              <Slider className="cursor-pointer mt-1" defaultValue={[1]} value={[rank]} max={5} min={1} step={1} onValueChange={([val]) => setRank(val)} />
            </div>
            <div>
              <span>Ascension: {promotion}</span>
              <Slider className="cursor-pointer mt-1" defaultValue={[6]} value={[promotion]} max={6} min={1} step={1} onValueChange={([val]) => setPromotion(val)} />
            </div>
            <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1 font-mono text-sm">
              /give equipment {id} {level} {rank} {promotion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Path({ path, filter, base }) {
  return (
    <div className={`filter cursor-pointer ${base.includes(path) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(path)}>
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarprofessiontattoo/profession/BgPaths${path}.webp`} alt={path} />
    </div>
  );
}