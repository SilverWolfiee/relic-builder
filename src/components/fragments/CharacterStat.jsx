import { getItem } from "@/services/hakush";
import { useCharStore, useLightconeStore } from "@/stores/character-store";
import { useBodyStore, useFeetStore, useHandStore, useHeadStore, usePlanarStore, useRopeStore } from "@/stores/relic-store";
import { useEffect, useMemo, useState } from "react";
import { mainStatHead, mainStatHand, mainStatBody, mainStatFeet, mainStatPlanar, mainStatLink, subStats } from "@/utils/dataStat";
import { useShallow } from "zustand/react/shallow";

export default function CharacterStat() {
  const [dataCharacter, setDataCharacter] = useState({});
  const [dataLightcone, setDataLightcone] = useState({});

  const [idChar, rankChar] = useCharStore(useShallow((state) => [state.id, state.rank]));
  const [idLc, rankLc, promotionLc] = useLightconeStore(useShallow((state) => [state.id, state.rank, state.promotion]));
  
  const [mainStatHeadPiece, subHead] = useHeadStore(useShallow((state) => [state.mainStatHead, state.sub]));
  const [mainStatHandPiece, subHand] = useHandStore(useShallow((state) => [state.mainStatHand, state.subHand]));
  const [mainStatBodyPiece, subBody] = useBodyStore(useShallow((state) => [state.mainStatBody, state.subBody]));
  const [mainStatFeetPiece, subFeet] = useFeetStore(useShallow((state) => [state.mainStatFeet, state.subFeet]));
  const [mainStatPlanarPiece, subPlanar] = usePlanarStore(useShallow((state) => [state.mainStatPlanar, state.subPlanar]));
  const [mainStatRopePiece, subRope] = useRopeStore(useShallow((state) => [state.mainStatRope, state.subRope]));

  useEffect(() => {
    if (idChar) {
      getItem("avatars", idChar, (data) => {
        setDataCharacter(data);
      });
    }
    if (idLc) {
      getItem("lightcones", idLc, (data) => {
        setDataLightcone(data);
      });
    }
  }, [idChar, idLc]);

  const statsCharacter = dataCharacter?.promotions?.["6"];
  const statsLightcone = dataLightcone?.promotions?.[promotionLc.toString()] || dataLightcone?.promotions?.[promotionLc];

  const traces = useMemo(() => Object.values(dataCharacter?.skill_trees || {}).slice(8), [dataCharacter]);

  const calcBaseStat = (stat, key) => {
    if (!stat || !stat[key]) return 0;
    return (stat[key].base || 0) + (stat[key].step || 0) * 79;
  };

  const baseStat = statsCharacter && {
    hp: parseInt(calcBaseStat(statsCharacter, "hp") + (idLc ? calcBaseStat(statsLightcone, "hp") : 0)),
    atk: parseInt(calcBaseStat(statsCharacter, "atk") + (idLc ? calcBaseStat(statsLightcone, "atk") : 0)),
    def: parseInt(calcBaseStat(statsCharacter, "def") + (idLc ? calcBaseStat(statsLightcone, "def") : 0)),
    spd: statsCharacter.spd?.base || 0,
    critRate: (statsCharacter.crit_rate?.base || 0) * 100,
    critDmg: (statsCharacter.crit_dmg?.base || 0) * 100,
    breakEffect: 0, outgoingHealing: 0, energyRegenRate: 100, physicalDmg: 0, fireDmg: 0, iceDmg: 0, lightningDmg: 0, windDmg: 0, quantumDmg: 0, imaginaryDmg: 0, effectHitRate: 0, effectRes: 0,
  };

  const traceBonus = useMemo(() => {
    const bonus = { hp: 0, atk: 0, def: 0, spd: 0, critRate: 0, critDmg: 0, breakEffect: 0, effectHitRate: 0, effectRes: 0, physicalDmg: 0, fireDmg: 0, iceDmg: 0, lightningDmg: 0, windDmg: 0, quantumDmg: 0, imaginaryDmg: 0 };
    traces.forEach((t) => {
      const list = t?.status_add_list || [];
      list.forEach(({ type, value }) => {
        switch (type) {
          case "HPAddedRatio": bonus.hp += value; break;
          case "AttackAddedRatio": bonus.atk += value; break;
          case "DefenceAddedRatio": bonus.def += value; break;
          case "SpeedDelta": bonus.spd += value; break;
          case "CriticalChanceBase": bonus.critRate += value * 100; break;
          case "CriticalDamageBase": bonus.critDmg += value * 100; break;
          case "BreakDamageAddedRatioBase": bonus.breakEffect += value * 100; break;
          case "StatusProbabilityBase": bonus.effectHitRate += value * 100; break;
          case "StatusResistanceBase": bonus.effectRes += value * 100; break;
          case "PhysicalAddedRatio": bonus.physicalDmg += value * 100; break;
          case "FireAddedRatio": bonus.fireDmg += value * 100; break;
          case "IceAddedRatio": bonus.iceDmg += value * 100; break;
          case "LightningAddedRatio": bonus.lightningDmg += value * 100; break;
          case "WindAddedRatio": bonus.windDmg += value * 100; break;
          case "QuantumAddedRatio": bonus.quantumDmg += value * 100; break;
          case "ImaginaryAddedRatio": bonus.imaginaryDmg += value * 100; break;
        }
      });
    });
    return bonus;
  }, [traces]);

  const getSubStatValue = (statName, step = 0, roll) => {
    const found = subStats.find((s) => s.name === statName);
    if (!found) return 0;
    return (found.value[roll] || 0) * step;
  };

  const aggregateSubStats = (subs) => {
    const statMap = {};
    subs.forEach((sub) => {
      const { stat, step, roll } = sub;
      if (!stat || typeof step !== "number") return;
      const value = getSubStatValue(stat, step, roll);
      const key = stat.toLowerCase().replaceAll(" ", "");
      if (!statMap[key]) statMap[key] = 0;
      statMap[key] += value;
    });
    return statMap;
  };

  const relicMainStats = [
    { piece: mainStatHeadPiece, list: mainStatHead },
    { piece: mainStatHandPiece, list: mainStatHand },
    { piece: mainStatBodyPiece, list: mainStatBody },
    { piece: mainStatFeetPiece, list: mainStatFeet },
    { piece: mainStatPlanarPiece, list: mainStatPlanar },
    { piece: mainStatRopePiece, list: mainStatLink },
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

  if (!statsCharacter) return <div className="p-10 text-center italic text-zinc-500">Calculating stats...</div>;

  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <img className="w-52 aspect-square object-contain" src={`https://cdn.neonteam.dev/neonteam/assets/spriteoutput/avatarshopicon/avatar/${idChar}.webp`} alt={idChar} />
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
          </div>
          <div>
            <p>Energy Regen: {finalStat?.energyRegenRate.toFixed(1)}%</p>
            <p>Effect Hit Rate: {finalStat?.effectHitRate.toFixed(1)}%</p>
            <p>Effect Res: {finalStat?.effectRes.toFixed(1)}%</p>
            {finalStat?.physicalDmg > 0 && <p>Physical DMG: {finalStat.physicalDmg.toFixed(1)}%</p>}
            {finalStat?.fireDmg > 0 && <p>Fire DMG: {finalStat.fireDmg.toFixed(1)}%</p>}
            {finalStat?.iceDmg > 0 && <p>Ice DMG: {finalStat.iceDmg.toFixed(1)}%</p>}
            {finalStat?.lightningDmg > 0 && <p>Lightning DMG: {finalStat.lightningDmg.toFixed(1)}%</p>}
            {finalStat?.windDmg > 0 && <p>Wind DMG: {finalStat.windDmg.toFixed(1)}%</p>}
            {finalStat?.quantumDmg > 0 && <p>Quantum DMG: {finalStat.quantumDmg.toFixed(1)}%</p>}
            {finalStat?.imaginaryDmg > 0 && <p>Imaginary DMG: {finalStat.imaginaryDmg.toFixed(1)}%</p>}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-4 italic">
        *Calculation does not include relic set effects or Lightcone passives.
      </div>
    </>
  );
}
