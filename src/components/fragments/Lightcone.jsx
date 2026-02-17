import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getData, getItem } from "@/services/hakush";
import { useLightconeStore } from "@/stores/character-store";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const path = ["Knight", "Mage", "Priest", "Rogue", "Shaman", "Warlock", "Warrior", "Memory"];

export default function Lightcone() {
  const [listId, setListId] = useState([]);
  const [characterData, setCharacterData] = useState({});
  const [search, setSearch] = useState("");
  const [descLc, setDescLc] = useState("");
  const [filterBaseType, setFilterBaseType] = useState([]);
  const [filterRankType, setFilterRankType] = useState([]);
  const [id, setId, level, setLevel, rank, setRank, promotion, setPromotion] = useLightconeStore(useShallow((state) => [state.id, state.setId, state.level, state.setLevel, state.rank, state.setRank, state.promotion, state.setPromotion]));

  useEffect(() => {
    getData("lightcone", (data) => {
      setListId(Object.keys(data));
      setCharacterData(data);
    });
  }, []);

  useEffect(() => {
    getItem("lightcone", id, (data) => {
      setDescLc(data);
    });
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

  const filteredId = listId.filter((id) => {
    const character = characterData[id];
    const matchesSearch = character?.en?.toLowerCase().includes(search);
    const matchesBaseType = filterBaseType.length > 0 ? filterBaseType.includes(character?.baseType) : true;
    const matchesRankType = filterRankType.length > 0 ? filterRankType.includes(character?.rank) : true;
    return matchesSearch && matchesBaseType && matchesRankType;
  });

  return (
    <div className="flex flex-col px-3">
      <span className="text-2xl font-bold mb-1">Lightcone</span>
      <Dialog>
        <DialogTrigger className=" bg-black text-white dark:bg-white dark:text-black rounded-md px-5 py-2 font-semibold">Select lightcone</DialogTrigger>
        <DialogContent
          className="max-h-[800px] min-h-[800px] scroll-auto max-w-7xl overflow-auto"
          onInteractOutside={() => {
            setSearch("");
          }}
        >
          <DialogHeader className={"shrink"}>
            <DialogTitle>Lightcone</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-5">
            <div className="w-full">
              <Input type="text" placeholder="Search..." onChange={handleSearch} />
              <div className="flex gap-1 mt-2">
                {path.map((path) => (
                  <Path key={path} path={path} filter={handleBaseChange} base={filterBaseType} />
                ))}
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center ${
                    filterRankType.includes("CombatPowerLightconeRarity5") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity5")}
                >
                  5*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center ${
                    filterRankType.includes("CombatPowerLightconeRarity4") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity4")}
                >
                  4*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center ${
                    filterRankType.includes("CombatPowerLightconeRarity3") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerLightconeRarity3")}
                >
                  3*
                </div>
              </div>
            </div>

            {filteredId.reverse().map((id) => {
              const character = characterData[id];

              if (character) {
                return (
                  <DialogClose asChild key={id}>
                    <div
                      className={`w-[150px] border hover:border-black dark:hover:border-white rounded-lg py-1 px-2 cursor-pointer ${
                        character.rank === "CombatPowerLightconeRarity5" ? "five-star" : character.rank === "CombatPowerLightconeRarity4" ? "four-star" : "three-star"
                      }`}
                      onClick={() => {
                        setId(id);
                        setSearch("");
                      }}
                    >
                      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/itemfigures/lightcone/${id}.webp`} alt={character.en} />
                      <p className="font-semibold text-white">{character.en}</p>
                    </div>
                  </DialogClose>
                );
              }
            })}
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2">
        <div>
          <img className="w-[300px]" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/itemfigures/lightcone/${id}.webp`} alt={id} />
          <span className="text-xl font-semibold">{descLc.Name}</span>
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
            <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1">
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
    <div className={`filter ${base.includes(path) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(path)}>
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarprofessiontattoo/profession/BgPaths${path}.webp`} alt={path} />
    </div>
  );
}
