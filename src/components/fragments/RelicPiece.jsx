import Combobox from "./Combobox";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRelicStore } from "@/stores/relic-store";
import { idToRelic } from "@/utils/relicData";




export default function RelicPiece({ reset, relicMain, name, relicPc, setRelic, mainStat, setMainStat, upgradePc, random, randomStep, setAll = null, children }) {
  const { relics: data, isLoading } = useRelicStore();

  if (isLoading || !data || Object.keys(data).length === 0) {
    return <div className="border-b py-5 text-zinc-500 italic">Loading relic database...</div>;
  }

  return (
    <div className="border-b py-5">
      <div className="flex items-center gap-5">
        <span className="text-xl font-semibold pb-3">{name}</span>
        <Button variant={"destructive"} onClick={reset}>
          Reset
        </Button>
        {setAll && <Button onClick={() => setAll()}>Set all</Button>}
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2">
          <p className="text-md">Relic Set</p>
          <ComboboxRelic data={data} name={"relic set"} value={relicPc} setValue={setRelic} />
          <p className="font-mono text-sm mt-1">{relicPc}</p>
          <p className="pt-5 font-semibold">Select Main Stat</p>
          <Combobox data={relicMain} name={"main stat"} value={mainStat} setValue={setMainStat} />
        </div>
        <div className="col-span-3">
          <div className="flex items-center gap-3">
            <h2>Sub Stat</h2>
            <Button disabled={!mainStat} onClick={random}>
              Random sub stat
            </Button>
            <Button disabled={!mainStat} onClick={randomStep}>
              Random upgrade
            </Button>
          </div>
          <p>Upgrade: {upgradePc}/5</p>
          <div className="flex flex-col gap-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ComboboxRelic({ data, name, value, setValue }) {
  const [open, setOpen] = useState(false);

  
  const uniqueRelics = [];
  const seenNames = new Set();

  Object.entries(data)
    .filter(([id, item]) => item.type === "HEAD") // use HEAD to represent the set
    .reverse()
    .forEach(([id, item]) => {
      const displayName = idToRelic[item.set_id] || item.tag || `Set ${item.set_id}`;
      if (!seenNames.has(displayName)) {
        seenNames.add(displayName);
        uniqueRelics.push({ id, item, displayName });
      }
    });

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-64">
          {value ? value : `Select ${name}...`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandEmpty>No relic found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {uniqueRelics.map(({ id, item, displayName }) => (
                <CommandItem
                  key={id}
                  value={displayName}
                  onSelect={() => {
                    setValue(displayName);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img className="h-8 w-8 object-contain" src={item.icon} alt={displayName} />
                    <span className="text-sm truncate">{displayName}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}