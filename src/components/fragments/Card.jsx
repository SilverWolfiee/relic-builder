import { Button } from "../ui/button";
import { useCharStore, useConfigCharacterStore, useLightconeStore } from "@/stores/character-store";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import Character from "./Character";
import { useShallow } from "zustand/react/shallow";
import { mainStatHead, mainStatHand, mainStatBody, mainStatFeet, mainStatPlanar, mainStatLink, subStats } from "@/utils/dataStat";
import { useBodyStore, useFeetStore, useHandStore, useHeadStore, usePlanarStore, useRelicStore, useRopeStore } from "@/stores/relic-store";
import { useRelicData } from "@/hooks/useRelicData";
import { useState } from "react";

export default function Card({ id }) {
  const [open, setOpen] = useState(false);

  const { relics: RelicsData } = useRelicStore();
  const [config, deleteConfig, editConfig] = useConfigCharacterStore(useShallow((state) => [state.config, state.deleteConfig, state.editConfig]));
  const [nameChar, setNameChar, idChar, setIdChar, levelChar, setLevelChar, rankChar, setRankChar, promotionChar, setPromotionChar, energyChar, setEnergyChar, technique, setTechnique, resetChar] = useCharStore(
    useShallow((state) => [
      state.name,
      state.setName,
      state.id,
      state.setId,
      state.level,
      state.setLevel,
      state.rank,
      state.setRank,
      state.promotion,
      state.setPromotion,
      state.energy,
      state.setEnergy,
      state.technique,
      state.setTechnique,
      state.reset,
    ])
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

  const handleRemoveCharacter = (id) => {
    deleteConfig(id);
  };

  const reset = () => {
    resetChar();
    resetLc();
    resetHead();
    resetHand();
    resetBody();
    resetFeet();
    resetPlanar();
    resetRope();
  };

  // extract relic from config json type
  const extractRelicData = (relics, mainStat) => {
    const [relicId, relicLv, mainStatId, subStatCount, ...subStat] = relics.split(",");
    const relicName = RelicsData[relicId.slice(1, 4)]?.en;

    return {
      relicName,
      relicId: relicId.slice(1, 4),
      relicLv,
      mainStatId,
      mainStatName: mainStat.find((stat) => stat.id === parseInt(mainStatId))?.name,
      subStatCount: parseInt(subStatCount),
      subStats: subStat.map((stat) => {
        const [statId, step, roll] = stat.split(":");
        const subStatName = subStats.find((sub) => sub.id === parseInt(statId))?.name;
        return { subStatName, statId: parseInt(statId), step: parseInt(step), roll: parseInt(roll) / parseInt(step) };
      }),
    };
  };

  const getPieceFromRelicId = (relicString) => {
    const relicId = relicString.split(",")[0];
    const piece = parseInt(relicId.slice(-1), 10) - 1;
    return piece;
  };

  const setMissingRelics = (relics) => {
    const completeRelics = Array(RELIC_COUNT).fill(null);

    for (const relic of relics) {
      const piece = getPieceFromRelicId(relic);
      if (piece >= 0 && piece < RELIC_COUNT) {
        completeRelics[piece] = relic;
      }
    }

    for (let i = 0; i < RELIC_COUNT; i++) {
      if (!completeRelics[i]) {
        const type = i < 4 ? "relic" : "planar";
        completeRelics[i] = placeholderRelic(type, i);
      }
    }

    return completeRelics;
  };

  const placeholderRelic = (type, piece) => {
    return `6${type === "relic" ? "101" : "301"}${piece},15,1,4,1:1:1,1:1:1,1:1:1,1:1:1`;
  };

  const setCharacterData = (character) => {
    setNameChar(character.name);
    setIdChar(character.id);
    setLevelChar(character.level);
    setRankChar(character.rank);
    setPromotionChar(character.promotion);
    setEnergyChar(character.sp * 100);
    setTechnique(character.use_technique);
    setIdLc(character.lightcone.id);
    setLevelLc(character.lightcone.level);
    setRankLc(character.lightcone.rank);
    setPromotionLc(character.lightcone.promotion);
  };

  const setRelicData = (relic, setRelicName, setMainStat, setUpgrade, setSubStat) => {
    const { relicName, mainStatName, subStats: subStat } = relic;
    setRelicName(relicName);
    setMainStat(mainStatName);
    setUpgrade(subStat.map((stat) => stat.step).reduce((acc, curr) => acc + (curr - 1), 0));
    setSubStat(0, subStat[0]?.subStatName, subStat[0]?.step, subStat[0]?.roll);
    setSubStat(1, subStat[1]?.subStatName, subStat[1]?.step, subStat[1]?.roll);
    setSubStat(2, subStat[2]?.subStatName, subStat[2]?.step, subStat[2]?.roll);
    setSubStat(3, subStat[3]?.subStatName, subStat[3]?.step, subStat[3]?.roll);
  };

  const handleOpenDialog = (id) => {
    const character = config.find((item) => item.id === id);
    if (!character) return;

    const relics = setMissingRelics(character.relics || []);

    const headRelic = extractRelicData(relics[0], mainStatHead);
    const handRelic = extractRelicData(relics[1], mainStatHand);
    const bodyRelic = extractRelicData(relics[2], mainStatBody);
    const feetRelic = extractRelicData(relics[3], mainStatFeet);
    const planarRelic = extractRelicData(relics[4], mainStatPlanar);
    const ropeRelic = extractRelicData(relics[5], mainStatLink);

    setCharacterData(character);
    setRelicData(headRelic, setRelicHead, setMainStatHead, setUpgradeHead, setSubStatHead);
    setRelicData(handRelic, setRelicHand, setMainStatHand, setUpgradeHand, setSubStatHand);
    setRelicData(bodyRelic, setRelicBody, setMainStatBody, setUpgradeBody, setSubStatBody);
    setRelicData(feetRelic, setRelicFeet, setMainStatFeet, setUpgradeFeet, setSubStatFeet);
    setRelicData(planarRelic, setRelicPlanar, setMainStatPlanar, setUpgradePlanar, setSubStatPlanar);
    setRelicData(ropeRelic, setRelicRope, setMainStatRope, setUpgradeRope, setSubStatRope);
  };

  // convert to config relic type
  const relic = (relic, mainStat, sub) => {
    const id = relic;
    const lv = 15;
    const mainStatId = mainStat;
    const subStatCount = sub.reduce((acc, curr) => (curr.stat !== "" ? acc + 1 : acc), 0);
    const subStat = sub
      .map((s) => {
        const subId = subStats.find((sub) => sub.name === s.stat)?.id;
        const step = s.step;
        const roll = parseInt(s.roll) * step;
        return `${subId}:${step}:${roll}`;
      })
      .join(",");

    return `${id},${lv},${mainStatId},${subStatCount},${subStat}`;
  };

  const handleEditCharacter = () => {
    const characterId = config.find((item) => item.id === id)?.id;

    const lightcone = {
      id: parseInt(idLc),
      rank: rankLc,
      level: levelLc,
      promotion: promotionLc,
    };

    const relics = [
      relic(headRelicData.relicId, headRelicData.mainStatHeadId, subHead),
      relic(handRelicData.relicId, handRelicData.mainStatHandId, subHand),
      relic(bodyRelicData.relicId, bodyRelicData.mainStatBodyId, subBody),
      relic(feetRelicData.relicId, feetRelicData.mainStatFeetId, subFeet),
      relic(planarRelicData.relicId, planarRelicData.mainStatPlanarId, subPlanar),
      relic(ropeRelicData.relicId, ropeRelicData.mainStatLinkId, subRope),
    ];

    const character = {
      name: nameChar,
      id: parseInt(idChar),
      hp: 100,
      sp: energyChar / 100,
      level: levelChar,
      promotion: promotionChar,
      rank: rankChar,
      lightcone: lightcone,
      relics: relics,
      use_technique: technique,
    };

    if (!lightcone.id) {
      alert("Select a lightcone first.");
      return;
    }
    if (
      relics.some((relic) => {
        const [relicId, relicLv, mainStatId, subCount, ...subStat] = relic.split(",");
        const subId = subStat.map((sub) => sub.split(":")[0]);

        return relicId === "null" || mainStatId === "undefined" || subId.includes("undefined");
      })
    ) {
      alert("There are relics you haven't configured.");
      return;
    }

    editConfig(characterId, character);

    reset();
    setOpen(false);
  };

  return (
    <div className="border-2 rounded-md w-[200px]">
      <img src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${id}.webp`} alt="mybini" />
      <div className="flex flex-col gap-2 p-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-black text-white dark:bg-white dark:text-black rounded-md px-5 py-2 font-semibold" onClick={() => handleOpenDialog(id)}>
            Edit
          </DialogTrigger>
          <DialogContent
            className="max-w-[calc(100vw-2rem)]"
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={() => {
              reset();
              setOpen(false);
            }}
          >
            <Character isEdit={true} />
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
              >
                Close
              </Button>
              <Button onClick={handleEditCharacter}>Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="destructive" onClick={() => handleRemoveCharacter(id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
