import { create } from "zustand";
import { subStats } from "@/utils/dataStat";
const BASE_URL = "https://cdn.neonteam.dev/neonteam";
let cachedVersion = null;
const subStat = subStats.map((stat) => stat.name);
const getVersion = async () => {
  if (cachedVersion) return cachedVersion;
  const res = await fetch(`${BASE_URL}/Metadata.json`);
  const meta = await res.json();
  cachedVersion = meta.CurrentVersion;
  return cachedVersion;
};

export const useRelicStore = create((set) => ({
  relics: {},
  isLoading: false,
  error: null,
  fetchRelics: async () => {
    set({ isLoading: true, error: null });
    try {
      const version = await getVersion();
      const res = await fetch(`${BASE_URL}/${version}/relics.json`);
      const data = await res.json();
      
      set({ relics: data, isLoading: false });
      console.log("Relics loaded successfully!");
    } catch (err) {
      console.error("Relic Fetch Error:", err);
      set({ error: err.message, isLoading: false });
    }
  },
}));

export const useHeadStore = create((set, get) => ({
  relicHead: "",
  setRelicHead: (relicHead) => set({ relicHead }),
  mainStatHead: "",
  setMainStatHead: (mainStatHead) => set({ mainStatHead }),
  sub: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStat: (index, stat, step, roll) =>
    set((state) => ({
      sub: state.sub.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStep: (index) =>
    set((state) => ({
      sub: state.sub.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgrade: state.upgrade + 1,
    })),
  decreaseSubStep: (index) =>
    set((state) => ({
      sub: state.sub.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgrade: state.upgrade - 1,
    })),
  setRoll: (index, roll) =>
    set((state) => ({
      sub: state.sub.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgrade: 0,
  setUpgrade: (upgrade) => set({ upgrade }),
  resetHead: () =>
    set({
      relicHead: "",
      mainStatHead: "",
      sub: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgrade: 0,
    }),
  randomSubHead: () => {
    set((state) => {
      const usedStats = [state.mainStatHead];
      const newSubStats = state.sub.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { sub: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().sub.length;
    set((state) => ({
      sub: state.sub.map((subItem) => ({ ...subItem, step: 1 })),
      upgrade: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStep(randomIndex);
    }
  },
}));

export const useHandStore = create((set, get) => ({
  relicHand: "",
  setRelicHand: (relicHand) => set({ relicHand }),
  mainStatHand: "",
  setMainStatHand: (mainStatHand) => set({ mainStatHand }),
  subHand: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStatHand: (index, stat, step, roll) =>
    set((state) => ({
      subHand: state.subHand.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStepHand: (index) =>
    set((state) => ({
      subHand: state.subHand.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgradeHand: state.upgradeHand + 1,
    })),
  decreaseSubStepHand: (index) =>
    set((state) => ({
      subHand: state.subHand.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgradeHand: state.upgradeHand - 1,
    })),
  setRollHand: (index, roll) =>
    set((state) => ({
      subHand: state.subHand.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgradeHand: 0,
  setUpgradeHand: (upgrade) => set({ upgradeHand: upgrade }),
  resetHand: () =>
    set({
      relicHand: "",
      mainStatHand: "",
      subHand: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgradeHand: 0,
    }),
  randomSubHand: () => {
    set((state) => {
      const usedStats = [state.mainStatHand];
      const newSubStats = state.subHand.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { subHand: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().subHand.length;
    set((state) => ({
      subHand: state.subHand.map((subItem) => ({ ...subItem, step: 1 })),
      upgradeHand: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStepHand(randomIndex);
    }
  },
}));

export const useBodyStore = create((set, get) => ({
  relicBody: "",
  setRelicBody: (relicBody) => set({ relicBody }),
  mainStatBody: "",
  setMainStatBody: (mainStatBody) => set({ mainStatBody }),
  subBody: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStatBody: (index, stat, step, roll) =>
    set((state) => ({
      subBody: state.subBody.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStepBody: (index) =>
    set((state) => ({
      subBody: state.subBody.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgradeBody: state.upgradeBody + 1,
    })),
  decreaseSubStepBody: (index) =>
    set((state) => ({
      subBody: state.subBody.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgradeBody: state.upgradeBody - 1,
    })),
  setRollBody: (index, roll) =>
    set((state) => ({
      subBody: state.subBody.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgradeBody: 0,
  setUpgradeBody: (upgrade) => set({ upgradeBody: upgrade }),
  resetBody: () =>
    set({
      relicBody: "",
      mainStatBody: "",
      subBody: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgradeBody: 0,
    }),
  randomSubBody: () => {
    set((state) => {
      const usedStats = [state.mainStatBody];
      const newSubStats = state.subBody.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { subBody: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().subBody.length;
    set((state) => ({
      subBody: state.subBody.map((subItem) => ({ ...subItem, step: 1 })),
      upgradeBody: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStepBody(randomIndex);
    }
  },
}));

export const useFeetStore = create((set, get) => ({
  relicFeet: "",
  setRelicFeet: (relicFeet) => set({ relicFeet }),
  mainStatFeet: "",
  setMainStatFeet: (mainStatFeet) => set({ mainStatFeet }),
  subFeet: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStatFeet: (index, stat, step, roll) =>
    set((state) => ({
      subFeet: state.subFeet.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStepFeet: (index) =>
    set((state) => ({
      subFeet: state.subFeet.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgradeFeet: state.upgradeFeet + 1,
    })),
  decreaseSubStepFeet: (index) =>
    set((state) => ({
      subFeet: state.subFeet.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgradeFeet: state.upgradeFeet - 1,
    })),
  setRollFeet: (index, roll) =>
    set((state) => ({
      subFeet: state.subFeet.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgradeFeet: 0,
  setUpgradeFeet: (upgrade) => set({ upgradeFeet: upgrade }),
  resetFeet: () =>
    set({
      relicFeet: "",
      mainStatFeet: "",
      subFeet: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgradeFeet: 0,
    }),
  randomSubFeet: () => {
    set((state) => {
      const usedStats = [state.mainStatFeet];
      const newSubStats = state.subFeet.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { subFeet: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().subFeet.length;
    set((state) => ({
      subFeet: state.subFeet.map((subItem) => ({ ...subItem, step: 1 })),
      upgradeFeet: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStepFeet(randomIndex);
    }
  },
}));

export const usePlanarStore = create((set, get) => ({
  relicPlanar: "",
  setRelicPlanar: (relicPlanar) => set({ relicPlanar }),
  mainStatPlanar: "",
  setMainStatPlanar: (mainStatPlanar) => set({ mainStatPlanar }),
  subPlanar: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStatPlanar: (index, stat, step, roll) =>
    set((state) => ({
      subPlanar: state.subPlanar.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStepPlanar: (index) =>
    set((state) => ({
      subPlanar: state.subPlanar.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgradePlanar: state.upgradePlanar + 1,
    })),
  decreaseSubStepPlanar: (index) =>
    set((state) => ({
      subPlanar: state.subPlanar.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgradePlanar: state.upgradePlanar - 1,
    })),
  setRollPlanar: (index, roll) =>
    set((state) => ({
      subPlanar: state.subPlanar.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgradePlanar: 0,
  setUpgradePlanar: (upgrade) => set({ upgradePlanar: upgrade }),
  resetPlanar: () =>
    set({
      relicPlanar: "",
      mainStatPlanar: "",
      subPlanar: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgradePlanar: 0,
    }),
  randomSubPlanar: () => {
    set((state) => {
      const usedStats = [state.mainStatPlanar];
      const newSubStats = state.subPlanar.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { subPlanar: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().subPlanar.length;
    set((state) => ({
      subPlanar: state.subPlanar.map((subItem) => ({ ...subItem, step: 1 })),
      upgradePlanar: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStepPlanar(randomIndex);
    }
  },
}));

export const useRopeStore = create((set, get) => ({
  relicRope: "",
  setRelicRope: (relicRope) => set({ relicRope }),
  mainStatRope: "",
  setMainStatRope: (mainStatRope) => set({ mainStatRope }),
  subRope: [
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
    {
      stat: "",
      step: 1,
      roll: 1,
    },
  ],
  setSubStatRope: (index, stat, step, roll) =>
    set((state) => ({
      subRope: state.subRope.map((subItem, i) => {
        if (i !== index) return subItem;

        return {
          ...subItem,
          ...(stat !== undefined && { stat }),
          ...(step !== undefined && { step }),
          ...(roll !== undefined && { roll }),
        };
      }),
    })),
  increaseSubStepRope: (index) =>
    set((state) => ({
      subRope: state.subRope.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step + 1 } : subItem)),
      upgradeRope: state.upgradeRope + 1,
    })),
  decreaseSubStepRope: (index) =>
    set((state) => ({
      subRope: state.subRope.map((subItem, i) => (i === index ? { ...subItem, step: subItem.step - 1 } : subItem)),
      upgradeRope: state.upgradeRope - 1,
    })),
  setRollRope: (index, roll) =>
    set((state) => ({
      subRope: state.subRope.map((subItem, i) => (i === index ? { ...subItem, roll: roll } : subItem)),
    })),
  upgradeRope: 0,
  setUpgradeRope: (upgrade) => set({ upgradeRope: upgrade }),
  resetRope: () =>
    set({
      relicRope: "",
      mainStatRope: "",
      subRope: [
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
        { stat: "", step: 1, roll: 1 },
      ],
      upgradeRope: 0,
    }),
  randomSubRope: () => {
    set((state) => {
      const usedStats = [state.mainStatRope];
      const newSubStats = state.subRope.map((subItem) => {
        let newStat;
        do {
          newStat = subStat[Math.floor(Math.random() * subStat.length)];
        } while (usedStats.includes(newStat));
        usedStats.push(newStat);
        return { ...subItem, stat: newStat };
      });
      return { subRope: newSubStats };
    });
  },
  randomStep: () => {
    const subLength = get().subRope.length;
    set((state) => ({
      subRope: state.subRope.map((subItem) => ({ ...subItem, step: 1 })),
      upgradeRope: 0,
    }));
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * subLength);
      get().increaseSubStepRope(randomIndex);
    }
  },
}));
