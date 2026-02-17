import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getData } from "@/services/hakush";
import { useCharStore } from "@/stores/character-store";
import { useShallow } from "zustand/react/shallow";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const path = ["Knight", "nMage", "Pirest", "Rogue", "Shaman", "Warlock", "Warrior", "Memory"];
const element = ["Fire", "Ice", "Imaginary", "Physical", "Quantum", "Thunder", "Wind"];

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
    getData("character", (data) => {
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
    const matchesSearch = character?.en?.toLowerCase().includes(search);
    const matchesBaseType = filterBaseType.length > 0 ? filterBaseType.includes(character?.baseType) : true;
    const matchesDamageType = filterDamageType.length > 0 ? filterDamageType.includes(character?.damageType) : true;
    const matchesRankType = filterRankType.length > 0 ? filterRankType.includes(character?.rank) : true;
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
                {path.map((path) => (
                  <Path key={path} path={path} filter={handleBaseChange} base={filterBaseType} />
                ))}
                {element.map((ele) => (
                  <Element key={ele} ele={ele} filter={handleDamageChange} damage={filterDamageType} />
                ))}
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center ${
                    filterRankType.includes("CombatPowerAvatarRarityType5") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerAvatarRarityType5")}
                >
                  5*
                </div>
                <div
                  className={`filter text-white text-2xl font-semibold flex items-center justify-center ${
                    filterRankType.includes("CombatPowerAvatarRarityType4") ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"
                  }`}
                  onClick={() => handleRankChange("CombatPowerAvatarRarityType4")}
                >
                  4*
                </div>
              </div>
            </div>

            {filteredId.reverse().map((id) => {
              const character = characterData[id];

              if (character) {
                return (
                  <DialogClose asChild key={id}>
                    <div
                      className={`w-[150px] border hover:border-black dark:hover:border-white rounded-lg py-1 px-2 cursor-pointer ${character.rank === "CombatPowerAvatarRarityType5" ? "five-star" : "four-star"}`}
                      onClick={() => {
                        setId(id);
                        setName(character.en);
                        setSearch("");
                      }}
                    >
                      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${id}.webp`} alt={character.en} />
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
              <Checkbox id="trace" value={trace} onCheckedChange={(val) => setTrace(val)} defaultChecked={true} />
              <label htmlFor="trace" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Max trace
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="technique" checked={technique} onCheckedChange={(val) => setTechnique(val)} defaultChecked={false} />
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

function Path({ path, filter, base }) {
  return (
    <div className={`filter ${base.includes(path) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(path)}>
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarprofessiontattoo/profession/BgPaths${path  }.webp`} alt={path} />
    </div>
  );
}

function Element({ ele, filter, damage }) {
  return (
    <div className={`filter ${damage.includes(ele) ? "bg-black/75 dark:bg-white/15 border border-black dark:border-white" : "border"}`} onClick={() => filter(ele)}>
      <img className="w-full" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/ui/nature/iconattributemiddle/IconAttribute${ele}.webp`} alt={ele} />
    </div>
  );
}
