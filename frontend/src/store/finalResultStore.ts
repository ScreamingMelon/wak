import { create } from 'zustand';
import { FinalResultTypes } from '../types/ResultTypes';

interface Store {
  finalResultData: FinalResultTypes;
  setFinalResultData: (finalResultData: FinalResultTypes) => void;
}

const useFinalResultStore = create<Store>((set) => ({
  finalResultData: {
    userId: 0,
    totalTime: 0,
    totalAliveTime: 0,
    totalKillCount: 0,
    finalRank: 0,
    rankwinnerNickname: '',
    winnerColor: '',
  } as FinalResultTypes,
  setFinalResultData: (finalResultData: FinalResultTypes) =>
    set(() => ({ finalResultData: { ...finalResultData } })),
}));

export default useFinalResultStore;
