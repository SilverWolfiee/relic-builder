import { useHandStore, useHeadStore, useBodyStore, useFeetStore, usePlanarStore, useRopeStore, useRelicStore } from "../../stores/relic-store";
import { useShallow } from "zustand/react/shallow";
import { mainStatBody, mainStatFeet, mainStatPlanar, mainStatLink, subStats } from "@/utils/dataStat";

export default function Code() {
  const { relics } = useRelicStore();

  const [relicHead, subHead] = useHeadStore(useShallow((state) => [state.relicHead, state.sub]));
  const [relicHand, subHand] = useHandStore(useShallow((state) => [state.relicHand, state.subHand]));
  const [relicBody, mainStatBodyy, subBody] = useBodyStore(useShallow((state) => [state.relicBody, state.mainStatBody, state.subBody]));
  const [relicFeet, mainStatFeett, subFeet] = useFeetStore(useShallow((state) => [state.relicFeet, state.mainStatFeet, state.subFeet]));
  const [relicPlanar, mainStatPlanarr, subPlanar] = usePlanarStore(useShallow((state) => [state.relicPlanar, state.mainStatPlanar, state.subPlanar]));
  const [relicRope, mainStatRope, subRope] = useRopeStore(useShallow((state) => [state.relicRope, state.mainStatRope, state.subRope]));

  function getRelic(relicPiece, index) {
    if (!relics || Object.keys(relics).length === 0) return { relicId: "" };
    const relicEntry = Object.values(relics).find((data) => data.tag === relicPiece);
    const setId = relicEntry ? relicEntry.set_id : "";
    const mainStatBodyId = mainStatBody.find((stat) => stat.name === mainStatBodyy)?.id;
    const mainStatFeetId = mainStatFeet.find((stat) => stat.name === mainStatFeett)?.id;
    const mainStatPlanarId = mainStatPlanar.find((stat) => stat.name === mainStatPlanarr)?.id;
    const mainStatLinkId = mainStatLink.find((stat) => stat.name === mainStatRope)?.id;
    return {
      relicId: setId ? `6${setId}${index + 1}` : "",
      mainStatHeadId: 1,
      mainStatHandId: 1,
      mainStatBodyId,
      mainStatFeetId,
      mainStatPlanarId,
      mainStatLinkId,
    };
  }
  return (
    (relicHead || relicHand || relicBody || relicFeet || relicPlanar || relicRope) && (
      <div className="w-fit mx-auto mt-5 bg-slate-300 dark:bg-slate-800 px-3 py-1 font-mono text-xs">
        <Relic name={relicHead} relic={getRelic(relicHead, 0).relicId} mainStat={getRelic(relicHead, 0).mainStatHeadId} sub={subHead} />
        <Relic name={relicHand} relic={getRelic(relicHand, 1).relicId} mainStat={getRelic(relicHand, 1).mainStatHandId} sub={subHand} />
        <Relic name={relicBody} relic={getRelic(relicBody, 2).relicId} mainStat={getRelic(relicBody, 2).mainStatBodyId} sub={subBody} />
        <Relic name={relicFeet} relic={getRelic(relicFeet, 3).relicId} mainStat={getRelic(relicFeet, 3).mainStatFeetId} sub={subFeet} />
        <Relic name={relicPlanar} relic={getRelic(relicPlanar, 4).relicId} mainStat={getRelic(relicPlanar, 4).mainStatPlanarId} sub={subPlanar} />
        <Relic name={relicRope} relic={getRelic(relicRope, 5).relicId} mainStat={getRelic(relicRope, 5).mainStatLinkId} sub={subRope} />
      </div>
    )
  );
}

function Relic({ name, relic, mainStat, sub }) {
  return (
    <div>
      {name && (
        <>
          /give relic {relic} 15 {mainStat} {relic && sub.reduce((acc, curr) => (curr.stat !== "" ? acc + 1 : acc), 0)} {sub.map((val) => val.stat && `${subStats.find((sub) => sub.name === val.stat)?.id}:${val.step} `)}
        </>
      )}
    </div>
  );
}
