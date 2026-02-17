import { getItem } from "@/services/hakush";
import { useCharStore, useLightconeStore } from "@/stores/character-store";
import { useBodyStore, useFeetStore, useHandStore, useHeadStore, usePlanarStore, useRopeStore } from "@/stores/relic-store";
import { useEffect, useMemo, useState } from "react";
import { mainStatHead, mainStatHand, mainStatBody, mainStatFeet, mainStatPlanar, mainStatLink, subStats } from "@/utils/dataStat";
import { useShallow } from "zustand/react/shallow";

export default function CharacterStat() {
  const [dataCharacter, setDataCharacter] = useState({});
  const [dataLightcone, setDataLightcone] = useState({});

  useEffect(() => {
    getItem("character", idChar, (data) => {
      setDataCharacter(data);
    });
    getItem("lightcone", idLc, (data) => {
      setDataLightcone(data);
    });
  }, []);

  const [idChar, rankChar] = useCharStore(useShallow((state) => [state.id, state.rank]));
  const [idLc, rankLc, promotionLc] = useLightconeStore(useShallow((state) => [state.id, state.rank, state.promotion]));
  const [mainStatHeadPiece, subHead] = useHeadStore(useShallow((state) => [state.mainStatHead, state.sub]));
  const [mainStatHandPiece, subHand] = useHandStore(useShallow((state) => [state.mainStatHand, state.subHand]));
  const [mainStatBodyPiece, subBody] = useBodyStore(useShallow((state) => [state.mainStatBody, state.subBody]));
  const [mainStatFeetPiece, subFeet] = useFeetStore(useShallow((state) => [state.mainStatFeet, state.subFeet]));
  const [mainStatPlanarPiece, subPlanar] = usePlanarStore(useShallow((state) => [state.mainStatPlanar, state.subPlanar]));
  const [mainStatRopePiece, subRope] = useRopeStore(useShallow((state) => [state.mainStatRope, state.subRope]));

  const statsCharacter = dataCharacter?.Stats?.["6"];
  const statsLightcone = dataLightcone?.Stats?.[promotionLc];

  const traces = useMemo(() => Object.values(dataCharacter?.SkillTrees || {}).slice(8), [dataCharacter]);

  const calcBaseStat = (stat, base, add) => {
    if (!stat) return;
    return stat[base] + stat[add] * 79;
  };

  const baseStat = statsCharacter && {
    hp: parseInt(calcBaseStat(statsCharacter, "HPBase", "HPAdd") + (idLc && calcBaseStat(statsLightcone, "BaseHP", "BaseHPAdd"))),
    atk: parseInt(calcBaseStat(statsCharacter, "AttackBase", "AttackAdd") + (idLc && calcBaseStat(statsLightcone, "BaseAttack", "BaseAttackAdd"))),
    def: parseInt(calcBaseStat(statsCharacter, "DefenceBase", "DefenceAdd") + (idLc && calcBaseStat(statsLightcone, "BaseDefence", "BaseDefenceAdd"))),
    spd: statsCharacter.SpeedBase,
    critRate: (statsCharacter.CriticalChance || 0) * 100,
    critDmg: (statsCharacter.CriticalDamage || 0) * 100,
    breakEffect: 0,
    outgoingHealing: 0,
    energyRegenRate: 100,
    physicalDmg: 0,
    fireDmg: 0,
    iceDmg: 0,
    lightningDmg: 0,
    windDmg: 0,
    quantumDmg: 0,
    imaginaryDmg: 0,
    effectHitRate: 0,
    effectRes: 0,
  };

  const traceBonus = useMemo(() => {
    const bonus = {
      hp: 0,
      atk: 0,
      def: 0,
      spd: 0,
      critRate: 0,
      critDmg: 0,
      breakEffect: 0,
      effectHitRate: 0,
      effectRes: 0,
      physicalDmg: 0,
      fireDmg: 0,
      iceDmg: 0,
      lightningDmg: 0,
      windDmg: 0,
      quantumDmg: 0,
      imaginaryDmg: 0,
    };

    traces.forEach((trace) => {
      const list = trace?.["1"]?.StatusAddList || [];
      list.forEach(({ PropertyType, Value }) => {
        switch (PropertyType) {
          case "HPAddedRatio":
            bonus.hp += Value;
            break;
          case "AttackAddedRatio":
            bonus.atk += Value;
            break;
          case "DefenceAddedRatio":
            bonus.def += Value;
            break;
          case "SpeedDelta":
            bonus.spd += Value;
            break;
          case "CriticalChanceBase":
            bonus.critRate += Value * 100;
            break;
          case "CriticalDamageBase":
            bonus.critDmg += Value * 100;
            break;
          case "BreakDamageAddedRatioBase":
            bonus.breakEffect += Value * 100;
            break;
          case "StatusProbabilityBase":
            bonus.effectHitRate += Value * 100;
            break;
          case "StatusResistanceBase":
            bonus.effectRes += Value * 100;
            break;
          case "PhysicalAddedRatio":
            bonus.windDmg += Value * 100;
            break;
          case "FireAddedRatio":
            bonus.fireDmg += Value * 100;
            break;
          case "IceAddedRatio":
            bonus.iceDmg += Value * 100;
            break;
          case "LightningAddedRatio":
            bonus.lightningDmg += Value * 100;
            break;
          case "WindAddedRatio":
            bonus.windDmg += Value * 100;
            break;
          case "QuantumAddedRatio":
            bonus.quantumDmg += Value * 100;
            break;
          case "ImaginaryAddedRatio":
            bonus.imaginaryDmg += Value * 100;
            break;
          default:
            break;
        }
      });
    });

    return bonus;
  }, [traces]);

  const getSubStatValue = (statName, step = 0, roll) => {
    const found = subStats.find((s) => s.name === statName);
    if (!found) return 0;
    return found.value[roll] * step;
  };

  const aggregateSubStats = (subs) => {
    const statMap = {};
    subs.forEach((sub) => {
      const { stat, step, roll } = sub;
      if (!stat || typeof step !== "number") {
        return;
      }
      const value = getSubStatValue(stat, step, roll);
      const key = stat.toLowerCase().replaceAll(" ", "");
      if (!statMap[key]) statMap[key] = 0;
      statMap[key] += value;
    });
    return statMap;
  };

  const relicMainStats = [
    { piece: mainStatHeadPiece, list: mainStatHead, stat: "hp" },
    { piece: mainStatHandPiece, list: mainStatHand, stat: "atk" },
    { piece: mainStatBodyPiece, list: mainStatBody, stat: null },
    { piece: mainStatFeetPiece, list: mainStatFeet, stat: null },
    { piece: mainStatPlanarPiece, list: mainStatPlanar, stat: null },
    { piece: mainStatRopePiece, list: mainStatLink, stat: null },
  ];

  const relicMainBonus = {};
  relicMainStats.forEach(({ piece, list }) => {
    const found = list.find((stat) => stat.name === piece);
    if (!found) return;
    const key = found.name.toLowerCase().replaceAll(" ", "");
    if (!relicMainBonus[key]) relicMainBonus[key] = 0;
    relicMainBonus[key] += found.max;
  });

  const allSubs = [...subHead, ...subHand, ...subBody, ...subFeet, ...subPlanar, ...subRope];
  const relicSubBonus = aggregateSubStats(allSubs);

  const totalRelicBonus = {};
  [...Object.entries(relicMainBonus), ...Object.entries(relicSubBonus)].forEach(([key, value]) => {
    if (!totalRelicBonus[key]) totalRelicBonus[key] = 0;
    totalRelicBonus[key] += value;
  });

  const finalStat = baseStat && {
    hp: baseStat.hp * (1 + (totalRelicBonus["hp%"] || 0) + traceBonus.hp) + (totalRelicBonus.hp || 0),
    atk: baseStat.atk * (1 + (totalRelicBonus["atk%"] || 0) + traceBonus.atk) + (totalRelicBonus.atk || 0),
    def: baseStat.def * (1 + (totalRelicBonus["def%"] || 0) + traceBonus.def) + (totalRelicBonus.def || 0),
    spd: baseStat.spd + traceBonus.spd + (totalRelicBonus.speed || 0),
    critRate: baseStat.critRate + traceBonus.critRate + (totalRelicBonus.critrate * 100 || 0),
    critDmg: baseStat.critDmg + traceBonus.critDmg + (totalRelicBonus.critdmg * 100 || 0),
    breakEffect: baseStat.breakEffect + traceBonus.breakEffect + (totalRelicBonus.breakeffect * 100 || 0),
    outgoingHealing: baseStat.outgoingHealing + (totalRelicBonus.outgoinghealing * 100 || 0),
    energyRegenRate: baseStat.energyRegenRate + (totalRelicBonus.energyregenerationrate * 100 || 0),
    effectHitRate: baseStat.effectHitRate + traceBonus.effectHitRate + (totalRelicBonus.effecthitrate * 100 || 0),
    effectRes: baseStat.effectRes + traceBonus.effectRes + (totalRelicBonus.effectres * 100 || 0),
    physicalDmg: baseStat.physicalDmg + traceBonus.physicalDmg + (totalRelicBonus.physicaldamage * 100 || 0),
    fireDmg: baseStat.fireDmg + traceBonus.fireDmg + (totalRelicBonus.firedamage * 100 || 0),
    iceDmg: baseStat.iceDmg + traceBonus.iceDmg + (totalRelicBonus.icedamage * 100 || 0),
    lightningDmg: baseStat.lightningDmg + traceBonus.lightningDmg + (totalRelicBonus.lightningdamage * 100 || 0),
    windDmg: baseStat.windDmg + traceBonus.windDmg + (totalRelicBonus.winddamage * 100 || 0),
    quantumDmg: baseStat.quantumDmg + traceBonus.quantumDmg + (totalRelicBonus.quantumdamage * 100 || 0),
    imaginaryDmg: baseStat.imaginaryDmg + traceBonus.imaginaryDmg + (totalRelicBonus.imaginarydamage * 100 || 0),
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <img className="w-52 aspect-square object-contain" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${id}.webp`} alt={idChar} />
          <div className="text-lg font-semibold">
            <p>Eidolon {rankChar}</p>
            {idLc && <p>Superimpose {rankLc}</p>}
            {idLc && <img className="w-32 aspect-square object-contain" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/itemfigures/lightcone/${idLc}.webp`} alt={idLc} />}
          </div>
        </div>
        <div className="text-lg font-semibold flex gap-4">
          <div>
            <p>HP: {Math.round(finalStat?.hp)}</p>
            <p>ATK: {Math.round(finalStat?.atk)}</p>
            <p>DEF: {Math.round(finalStat?.def)}</p>
            <p>Speed: {Math.round(finalStat?.spd)}</p>
            <p>Crit Rate: {finalStat?.critRate.toFixed(1)}%</p>
            <p>Crit Dmg: {finalStat?.critDmg.toFixed(1)}%</p>
            <p>Break Effect: {finalStat?.breakEffect.toFixed(1)}%</p>
            <p>Outgoing Healing: {finalStat?.outgoingHealing.toFixed(1)}%</p>
            <p>Energy Regen Rate: {finalStat?.energyRegenRate.toFixed(1)}%</p>
          </div>
          <div>
            <p>Effect Hit Rate: {finalStat?.effectHitRate.toFixed(1)}%</p>
            <p>Effect Res: {finalStat?.effectRes.toFixed(1)}%</p>
            <p>Physical DMG: {finalStat?.physicalDmg.toFixed(1)}%</p>
            <p>Fire DMG: {finalStat?.fireDmg.toFixed(1)}%</p>
            <p>Ice DMG: {finalStat?.iceDmg.toFixed(1)}%</p>
            <p>Lightning DMG: {finalStat?.lightningDmg.toFixed(1)}%</p>
            <p>Wind DMG: {finalStat?.windDmg.toFixed(1)}%</p>
            <p>Quantum DMG: {finalStat?.quantumDmg.toFixed(1)}%</p>
            <p>Imaginary DMG: {finalStat?.imaginaryDmg.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        <p>
          Please note that this doesn't represent the final stats. <br /> The calculation does not include relic set effects and Lightcone passive.
        </p>
      </div>
    </>
  );
}
