/* eslint-disable react/prop-types */
import { useCharStore, useLightconeStore } from "@/stores/character-store";
import Char from "./Char";
import CreateRelic from "./CreateRelic";
import Lightcone from "./Lightcone";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useShallow } from "zustand/react/shallow";
import Code from "./Code";
import CharacterStat from "./CharacterStat";

export default function Character({ isEdit = false, isTingyun = false }) {
  const [idChar, rankChar, energy] = useCharStore(useShallow((state) => [state.id, state.rank, state.energy]));
  const [idLc, levelLc, rankLc, promotionLc] = useLightconeStore(useShallow((state) => [state.id, state.level, state.rank, state.promotion]));

  return (
    <>
      <div className="w-full border-2 rounded-md p-3 max-h-[calc(100vh-14rem)] overflow-auto">
        <div className="pb-5">
          <div className="grid grid-cols-2 divide-x-2">
            <Char isEdit={isEdit} isTingyun={isTingyun} />
            <Lightcone />
          </div>
        </div>
        <div className="border-t pt-5">
          <CreateRelic />
        </div>
      </div>
      <div className="flex gap-4">
        <Dialog>
          <DialogTrigger className="dark:text-white underline font-semibold w-full rounded-md py-3 text-lg">See all commands</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Commands</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {idChar && (
                <>
                  <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1">
                    /set avatar eidolon {idChar} {rankChar}
                  </div>
                  <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1">/set avatar max_trace {idChar}</div>
                  <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1">/set avatar energy {energy}</div>
                </>
              )}
              {idLc && (
                <div className="bg-slate-300 dark:bg-slate-800 px-3 py-1">
                  /give equipment {idLc} {levelLc} {rankLc} {promotionLc}
                </div>
              )}
              <Code />
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger disabled={!idChar} className="dark:bg-white dark:text-black bg-black text-white underline font-semibold w-full rounded-md py-3 text-lg disabled:bg-opacity-50 disabled:cursor-not-allowed">
            View stats
          </DialogTrigger>
          <DialogContent className="max-w-[850px]">
            <DialogHeader>
              <DialogTitle>Character stats</DialogTitle>
            </DialogHeader>
            <CharacterStat />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
