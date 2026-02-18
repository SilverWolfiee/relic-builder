import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getData } from "@/services/hakush";
import { useCharStore } from "@/stores/character-store";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const path = ["Knight", "nMage", "Pirest", "Rogue", "Shaman", "Warlock", "Warrior", "Memory", "Joy"];
const pathMap = {
  "nMage": "Mage",
  "Pirest": "Priest", 
  "Joy": "Elation",
};
const element = ["Fire", "Ice", "Imaginary", "Physical", "Quantum", "Thunder", "Wind"];

const charToId = {
  "March 7th": 1001,
  "Dan Heng": 1002,
  "Himeko": 1003,
  "Welt": 1004,
  "Kafka": 1005,
  "Silver Wolf": 1006,
  "Arlan": 1008,
  "Asta": 1009,
  "Saber": 1014,
  "Archer": 1015,
  "Herta": 1013,
  "Bronya": 1101,
  "Seele": 1102,
  "Serval": 1103,
  "Gepard": 1104,
  "Natasha": 1105,
  "Pela": 1106,
  "Clara": 1107,
  "Sampo": 1108,
  "Hook": 1109,
  "Lynx": 1110,
  "Luka": 1111,
  "Topaz": 1112,
  "Qingque": 1201,
  "Tingyun": 1202,
  "Luocha": 1203,
  "Jing Yuan": 1204,
  "Blade": 1205,
  "Sushang": 1206,
  "Yukong": 1207,
  "Fu Xuan": 1208,
  "Yanqing": 1209,
  "Guinaifen": 1210,
  "Bailu": 1211,
  "Jingliu": 1212,
  "Dan Heng · Imbibitor Lunae": 1213,
  "Xueyi": 1214,
  "Hanya": 1215,
  "Huohuo": 1217,
  "Jiaoqiu": 1218,
  "Feixiao": 1220,
  "Yunli": 1221,
  "Lingsha": 1222,
  "Moze": 1223,
  "Fugue": 1225,
  "Gallagher": 1301,
  "Argenti": 1302,
  "Ruan Mei": 1303,
  "Aventurine": 1304,
  "Dr. Ratio": 1305,
  "Sparkle": 1306,
  "Black Swan": 1307,
  "Acheron": 1308,
  "Robin": 1309,
  "Firefly": 1310,
  "Misha": 1312,
  "Sunday": 1313,
  "Jade": 1314,
  "Boothill": 1315,
  "Rappa": 1317,
  "The Dahlia": 1321,
  "The Herta": 1401,
  "Aglaea": 1402,
  "Tribbie": 1403,
  "Mydei": 1404,
  "Anaxa": 1405,
  "Castorice": 1407,
  "Cipher": 1406,
  "Hyacine": 1409,
  "Phainon": 1408,
  "Hysilens": 1410,
  "Cerydra": 1412,
  "Evernight": 1413,
  "Dan Heng · Permansor Terrae": 1414,
  "Cyrene": 1415,
  "Sparxie": 1501,
  "Yao Guang": 1502,
  "Ashveil": 1504,
  "Trailblazer(Destruction)": 8001,
  "Trailblazer(Destruction)": 8002,
  "Trailblazer(Preservation)": 8003,
  "Trailblazer(Preservation)": 8004,
  "Trailblazer(Harmony)": 8005,
  "Trailblazer(Harmony)": 8006,
  "Trailblazer(Remembrance)": 8007,
  "Trailblazer(Remembrance)": 8008,
};

const idToChar = Object.fromEntries(Object.entries(charToId).map(([name, id]) => [id, name]));

const getFriendlyName = (id, tag) => {
  const numId = parseInt(id);
  if (numId === 8001 || numId === 8002) return "Trailblazer(Destruction)";
  if (numId === 8003 || numId === 8004) return "Trailblazer(Preservation)";
  if (numId === 8005 || numId === 8006) return "Trailblazer(Harmony)";
  if (numId === 8007 || numId === 8008) return "Trailblazer(Remembrance)";
  return idToChar[numId] || tag;
};

export default function Char({ isEdit = false }) {
  const [listId, setListId] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [search, setSearch] = useState("");
  const [filterBaseType, setFilterBaseType] = useState([]);
  const [filterDamageType, setFilterDamageType] = useState([]);
  const [filterRankType, setFilterRankType] = useState([]);
  const [setName, id, setId, level, setLevel, rank, setRank, promotion, setPromotion, trace, setTrace, energy, setEnergy, technique, setTechnique] = useCharStore(
    useShallow((state) => [
      state.setName,
      state.id,
      state.setId,
      state.level,
      state.setLevel,
      state.rank,
      state.setRank,
      state.promotion,
      state.setPromotion,
      state.trace,
      state.setTrace,
      state.energy,
      state.setEnergy,
      state.technique,
      state.setTechnique,
    ])
  );

  useEffect(() => {
    getData("avatars", (data) => {
      setListId(Object.keys(data));
      setCharacterData(data);
    });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleBaseChange = (baseType) => {
    setFilterBaseType((prevFilters) => (prevFilters.includes(baseType) ? prevFilters.filter((type) => type !== baseType) : [...prevFilters, baseType]));
  };

  const handleDamageChange = (damageType) => {
    setFilterDamageType((prevFilters) => (prevFilters.includes(damageType) ? prevFilters.filter((type) => type !== damageType) : [...prevFilters, damageType]));
  };

  const handleRankChange = (rankType) => {
    setFilterRankType((prevFilters) => (prevFilters.includes(rankType) ? prevFilters.filter((type) => type !== rankType) : [...prevFilters, rankType]));
  };

  const filteredId = listId.filter((id) => {
    const character = characterData[id];
    if (!character) return false;

    const displayName = getFriendlyName(id, character.tag);
    const matchesSearch = displayName.toLowerCase().includes(search);

    const translatedPathFilters = filterBaseType.map(type => pathMap[type] || type);
    const matchesBaseType = filterBaseType.length > 0 
      ? translatedPathFilters.includes(character?.path) 
      : true;

    const matchesDamageType = filterDamageType.length > 0 
      ? filterDamageType.includes(character?.element) 
      : true;

    const matchesRankType = filterRankType.length > 0 
      ? filterRankType.some(r => r.includes(character?.rarity?.toString())) 
      : true;

    return matchesSearch && matchesBaseType && matchesDamageType && matchesRankType;
  });

  return (
    <div className="flex flex-col px-3">
      <span className="text-2xl font-bold mb-1">Character</span>
      <Dialog>
        <DialogTrigger disabled={isEdit} className="bg-black text-white dark:bg-white dark:text-black rounded-md px-5 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          Select character
        </DialogTrigger>
        <DialogContent
          className="max-h-[800px] min-h-[800px] scroll-auto max-w-7xl overflow-auto"
          onInteractOutside={() => {
            setSearch("");
          }}
        >
          <DialogHeader className={"shrink"}>
            <DialogTitle>Character</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-5">
            <div className="w-full">
              <Input type="text" placeholder="Search..." onChange={handleSearch} />
              <div className="flex gap-1 mt-2">
                {path.map((p) => (
                  <Path key={p} path={p} filter={handleBaseChange} base={filterBaseType} />
                ))}
                {element.map((ele) => (
                  <Element key={ele} ele={ele} filter={handleDamageChange} damage={filterDamageType} />
                ))}
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center cursor-pointer ${
                    filterRankType.includes("CombatPowerAvatarRarityType5") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerAvatarRarityType5")}
                >
                  5*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center cursor-pointer ${
                    filterRankType.includes("CombatPowerAvatarRarityType4") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerAvatarRarityType4")}
                >
                  4*
                </div>
              </div>
            </div>

            {filteredId.reverse().map((charId) => {
              const character = characterData[charId];
              if (!character) return null;

              const displayName = getFriendlyName(charId, character.tag);
              const rarityClass = character.rarity === 5 ? "rarity-5" : "rarity-4";

              return (
                <DialogClose asChild key={charId}>
                  <div
                    className={`w-[150px] border hover:border-white rounded-lg py-1 px-2 cursor-pointer transition-all ${rarityClass}`}
                    onClick={() => {
                      setId(charId);
                      setName(displayName); 
                      setSearch("");
                    }}
                  >
                    <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${charId}.webp`} alt={displayName} />
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
        <img className="w-[300px]" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${id}.webp`} alt={id} />
        {id && (
          <div className="flex flex-col gap-5">
            <div>
              <span>Level: {level}</span>
              <Slider className="cursor-not-allowed mt-1" defaultValue={[80]} max={80} min={1} step={1} value={[level]} onValueChange={([val]) => setLevel(val < 10 ? 1 : Math.floor(val / 10) * 10)} disabled />
            </div>
            <div>
              <span>Eidolon: {rank}</span>
              <Slider className="cursor-pointer mt-1" defaultValue={[0]} max={6} min={0} step={1} value={[rank]} onValueChange={([val]) => setRank(val)} />
            </div>
            <div>
              <span>Ascension: {promotion}</span>
              <Slider className="cursor-not-allowed mt-1" defaultValue={[6]} max={6} min={1} step={1} value={[promotion]} onValueChange={([val]) => setPromotion(val)} disabled />
            </div>
            <div>
              <span>Energy: {Math.floor(energy / 100)}%</span>
              <Slider className="cursor-pointer mt-1" defaultValue={[5000]} max={10000} min={0} step={100} value={[energy]} onValueChange={([val]) => setEnergy(val)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="trace" checked={trace} onCheckedChange={(val) => setTrace(val)} />
              <label htmlFor="trace" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Max trace
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="technique" checked={technique} onCheckedChange={(val) => setTechnique(val)} />
              <label htmlFor="technique" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Use technique
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Path({ path: p, filter, base }) {
  return (
    <div className={`filter cursor-pointer ${base.includes(p) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(p)}>
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarprofessiontattoo/profession/BgPaths${p}.webp`} alt={p} />
    </div>
  );
}

function Element({ ele, filter, damage }) {
  return (
    <div className={`filter cursor-pointer ${damage.includes(ele) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(ele)}>
      <img className="w-full" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/ui/nature/iconattributemiddle/IconAttribute${ele}.webp`} alt={ele} />
    </div>
  );
}