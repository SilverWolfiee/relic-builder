import { Button } from "../ui/button";
import { useCharStore, useConfigCharacterStore, useLightconeStore } from "@/stores/character-store";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import Character from "./Character";
import { useShallow } from "zustand/react/shallow";
import { mainStatHead, mainStatHand, mainStatBody, mainStatFeet, mainStatPlanar, mainStatLink, subStats } from "@/utils/dataStat";
import { useBodyStore, useFeetStore, useHandStore, useHeadStore, usePlanarStore, useRelicStore, useRopeStore } from "@/stores/relic-store";
import { useRelicData } from "@/hooks/useRelicData";
import { useState } from "react";

const relicToId = { "Diviner of Distant Reach": 130, "Ever-Glorious Magical Girl": 129, "Self-Enshrouded Recluse": 128, "World-Remaking Deliverer": 127, "Wavestrider Captain": 126, "Warrior Goddess of Sun and Thunder": 125, "Poet of Mourning Collapse": 124, "Hero of Triumphant Song": 123, "Scholar Lost in Erudition": 122, "Sacerdos' Relived Ordeal": 121, "The Wind-Soaring Valorous": 120, "Iron Cavalry Against the Scourge": 119, "Watchmaker, Master of Dream Machinations": 118, "Pioneer Diver of Dead Waters": 117, "Prisoner in Deep Confinement": 116, "The Ashblazing Grand Duke": 115, "Messenger Traversing Hackerspace": 114, "Longevous Disciple": 113, "Wastelander of Banditry Desert": 112, "Thief of Shooting Meteor": 111, "Eagle of Twilight Line": 110, "Band of Sizzling Thunder": 109, "Genius of Brilliant Stars": 108, "Firesmith of Lava-Forging": 107, "Guard of Wuthering Snow": 106, "Champion of Streetwise Boxing": 105, "Hunter of Glacial Forest": 104, "Knight of Purity Palace": 103, "Musketeer of Wild Wheat": 102, "Passerby of Wandering Cloud": 101 };
const planarToId = { "City of Myriad Forms": 326, "Punklorde Stage Zero": 325, "Tengoku@Livestream": 324, "Amphoreus, The Eternal Land": 323, "Revelry by the Sea": 322, "Arcadia of Woven Dreams": 321, "Giant Tree of Rapt Brooding": 320, "Bone Collection's Serene Demesne": 319, "The Wondrous BananAmusement Park": 318, "Lushaka, the Sunken Seas": 317, "Forge of the Kalpagni Lantern": 316, "Duran, Dynasty of Running Wolves": 315, "Izumo Gensei and Takama Divine Realm": 314, "Sigonia, the Unclaimed Desolation": 313, "Penacony, Land of the Dreams": 312, "Firmament Frontline: Glamoth": 311, "Broken Keel": 310, "Rutilant Arena": 309, "Sprightly Vonwacq": 308, "Talia: Kingdom of Banditry": 307, "Inert Salsotto": 306, "Celestial Differentiator": 305, "Belobog of the Architects": 304, "Pan-Cosmic Commercial Enterprise": 303, "Fleet of the Ageless": 302, "Space Sealing Station": 301 };

const idToRelic = Object.fromEntries(Object.entries(relicToId).map(([name, id]) => [id, name]));
const idToPlanar = Object.fromEntries(Object.entries(planarToId).map(([name, id]) => [id, name]));

export default function Card({ id }) {
  const [open, setOpen] = useState(false);
  const { relics: RelicsData } = useRelicStore();
  const [config, deleteConfig, editConfig] = useConfigCharacterStore(useShallow((state) => [state.config, state.deleteConfig, state.editConfig]));
  
  const [nameChar, setNameChar, idChar, setIdChar, levelChar, setLevelChar, rankChar, setRankChar, promotionChar, setPromotionChar, energyChar, setEnergyChar, technique, setTechnique, resetChar] = useCharStore(
    useShallow((state) => [state.name, state.setName, state.id, state.setId, state.level, state.setLevel, state.rank, state.setRank, state.promotion, state.setPromotion, state.energy, state.setEnergy, state.technique, state.setTechnique, state.reset])
  );

  const [idLc, setIdLc, levelLc, setLevelLc, rankLc, setRankLc, promotionLc, setPromotionLc, resetLc] = useLightconeStore(
    useShallow((state) => [state.id, state.setId, state.level, state.setLevel, state.rank, state.setRank, state.promotion, state.setPromotion, state.reset])
  );

  const [relicHead, setRelicHead, setMainStatHead, subHead, setSubStatHead, setUpgradeHead, resetHead] = useHeadStore(
    useShallow((state) => [state.relicHead, state.setRelicHead, state.setMainStatHead, state.sub, state.setSubStat, state.setUpgrade, state.resetHead])
  );

  const [relicHand, setRelicHand, setMainStatHand, subHand, setSubStatHand, setUpgradeHand, resetHand] = useHandStore(
    useShallow((state) => [state.relicHand, state.setRelicHand, state.setMainStatHand, state.subHand, state.setSubStatHand, state.setUpgradeHand, state.resetHand])
  );
  const [relicBody, setRelicBody, setMainStatBody, subBody, setSubStatBody, setUpgradeBody, resetBody] = useBodyStore(
    useShallow((state) => [state.relicBody, state.setRelicBody, state.setMainStatBody, state.subBody, state.setSubStatBody, state.setUpgradeBody, state.resetBody])
  );
  const [relicFeet, setRelicFeet, setMainStatFeet, subFeet, setSubStatFeet, setUpgradeFeet, resetFeet] = useFeetStore(
    useShallow((state) => [state.relicFeet, state.setRelicFeet, state.setMainStatFeet, state.subFeet, state.setSubStatFeet, state.setUpgradeFeet, state.resetFeet])
  );
  const [relicPlanar, setRelicPlanar, setMainStatPlanar, subPlanar, setSubStatPlanar, setUpgradePlanar, resetPlanar] = usePlanarStore(
    useShallow((state) => [state.relicPlanar, state.setRelicPlanar, state.setMainStatPlanar, state.subPlanar, state.setSubStatPlanar, state.setUpgradePlanar, state.resetPlanar])
  );
  const [relicRope, setRelicRope, setMainStatRope, subRope, setSubStatRope, setUpgradeRope, resetRope] = useRopeStore(
    useShallow((state) => [state.relicRope, state.setRelicRope, state.setMainStatRope, state.subRope, state.setSubStatRope, state.setUpgradeRope, state.resetRope])
  );

  const headRelicData = useRelicData(relicHead, 0);
  const handRelicData = useRelicData(relicHand, 1);
  const bodyRelicData = useRelicData(relicBody, 2);
  const feetRelicData = useRelicData(relicFeet, 3);
  const planarRelicData = useRelicData(relicPlanar, 4);
  const ropeRelicData = useRelicData(relicRope, 5);
  const RELIC_COUNT = 6;

  const reset = () => {
    resetChar(); resetLc(); resetHead(); resetHand(); resetBody(); resetFeet(); resetPlanar(); resetRope();
  };

  const extractRelicData = (relics, mainStat) => {
    if (!relics || relics === "null") return null;
    const [relicIdFull, relicLv, mainStatId, subStatCount, ...subStat] = relics.split(",");
    const setId = parseInt(relicIdFull.slice(1, 4));
    const relicName = idToRelic[setId] || idToPlanar[setId] || `Set ${setId}`;

    return {
      relicName,
      relicId: setId.toString(),
      relicLv,
      mainStatId,
      mainStatName: mainStat.find((stat) => stat.id === parseInt(mainStatId))?.name,
      subStatCount: parseInt(subStatCount),
      subStats: subStat.map((stat) => {
        const [statId, step, roll] = stat.split(":");
        const subStatName = subStats.find((sub) => sub.id === parseInt(statId))?.name;
        const rollVal = step !== "0" ? Math.round(parseInt(roll) / parseInt(step)) : 1;
        return { subStatName, statId: parseInt(statId), step: parseInt(step), roll: rollVal };
      }),
    };
  };
  const getPieceFromRelicId = (relicString) => {
    const relicId = relicString.split(",")[0];
    return parseInt(relicId.slice(-1), 10) - 1;
  };

  const setMissingRelics = (relics) => {
    const completeRelics = Array(RELIC_COUNT).fill(null);
    for (const relic of relics) {
      const piece = getPieceFromRelicId(relic);
      if (piece >= 0 && piece < RELIC_COUNT) completeRelics[piece] = relic;
    }
    for (let i = 0; i < RELIC_COUNT; i++) {
      if (!completeRelics[i]) {
        const type = i < 4 ? "relic" : "planar";
        completeRelics[i] = `6${type === "relic" ? "101" : "301"}${i + 1},15,1,4,1:1:1,1:1:1,1:1:1,1:1:1`;
      }
    }
    return completeRelics;
  };

  const setRelicData = (relic, setRelicName, setMainStat, setUpgrade, setSubStat) => {
    if (!relic) return;
    const { relicName, mainStatName, subStats: subList } = relic;
    setRelicName(relicName);
    setMainStat(mainStatName);
    setUpgrade(subList.map((stat) => stat.step).reduce((acc, curr) => acc + (curr - 1), 0));
    for (let i = 0; i < 4; i++) {
      if (subList[i]) setSubStat(i, subList[i].subStatName, subList[i].step, subList[i].roll);
      else setSubStat(i, "", 1, 1);
    }
  };

  const handleOpenDialog = (targetId) => {
    const character = config.find((item) => item.id === targetId);
    if (!character) return;
    const relics = setMissingRelics(character.relics || []);
    
    setNameChar(character.name); setIdChar(character.id); setLevelChar(character.level); setRankChar(character.rank);
    setPromotionChar(character.promotion); setEnergyChar(character.sp * 100); setTechnique(character.use_technique);
    setIdLc(character.lightcone.id); setLevelLc(character.lightcone.level); setRankLc(character.lightcone.rank); setPromotionLc(character.lightcone.promotion);
    setRelicData(extractRelicData(relics[0], mainStatHead), setRelicHead, setMainStatHead, setUpgradeHead, setSubStatHead);
    setRelicData(extractRelicData(relics[1], mainStatHand), setRelicHand, setMainStatHand, setUpgradeHand, setSubStatHand);
    setRelicData(extractRelicData(relics[2], mainStatBody), setRelicBody, setMainStatBody, setUpgradeBody, setSubStatBody);
    setRelicData(extractRelicData(relics[3], mainStatFeet), setRelicFeet, setMainStatFeet, setUpgradeFeet, setSubStatFeet);
    setRelicData(extractRelicData(relics[4], mainStatPlanar), setRelicPlanar, setMainStatPlanar, setUpgradePlanar, setSubStatPlanar);
    setRelicData(extractRelicData(relics[5], mainStatLink), setRelicRope, setMainStatRope, setUpgradeRope, setSubStatRope);
  };

  const formatRelicString = (relicId, mainStat, sub) => {
    const subStatCount = sub.reduce((acc, curr) => (curr.stat !== "" ? acc + 1 : acc), 0);
    const subStat = sub.map((s) => {
      const subId = subStats.find((item) => item.name === s.stat)?.id;
      return `${subId}:${s.step}:${parseInt(s.roll) * s.step}`;
    }).join(",");
    return `${relicId},15,${mainStat},${subStatCount},${subStat}`;
  };

  const handleEditCharacter = () => {
    const character = {
      name: nameChar, id: parseInt(idChar), hp: 100, sp: energyChar / 100, level: levelChar, promotion: promotionChar, rank: rankChar, use_technique: technique,
      lightcone: { id: parseInt(idLc), rank: rankLc, level: levelLc, promotion: promotionLc },
      relics: [
        formatRelicString(headRelicData.relicId, headRelicData.mainStatHeadId, subHead),
        formatRelicString(handRelicData.relicId, handRelicData.mainStatHandId, subHand),
        formatRelicString(bodyRelicData.relicId, bodyRelicData.mainStatBodyId, subBody),
        formatRelicString(feetRelicData.relicId, feetRelicData.mainStatFeetId, subFeet),
        formatRelicString(planarRelicData.relicId, planarRelicData.mainStatPlanarId, subPlanar),
        formatRelicString(ropeRelicData.relicId, ropeRelicData.mainStatLinkId, subRope),
      ]
    };
    editConfig(id, character); reset(); setOpen(false);
  };
  return (
    <div className="border-2 rounded-md w-[200px]">
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${id}.webp`} alt="character" />
      <div className="flex flex-col gap-2 p-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-black text-white dark:bg-white dark:text-black rounded-md px-5 py-2 font-semibold" onClick={() => handleOpenDialog(id)}>
            Edit
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={() => { reset(); setOpen(false); }}>
            <Character isEdit={true} />
            <DialogFooter>
              <Button variant="destructive" onClick={() => { reset(); setOpen(false); }}>Close</Button>
              <Button onClick={handleEditCharacter}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={() => deleteConfig(id)}>Delete</Button>
      </div>
    </div>
  );
}