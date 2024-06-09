import { create } from 'zustand';
import { ResultTypes } from '../types/ResultTypes';

interface Store {
  resultData: ResultTypes;
  setResultData: (resultData: ResultTypes) => void;
}

const useResultStore = create<Store>((set) => ({
  resultData: {
    userId: 0,
    killCount: 0,
    rank: 0,
    playTime: 0,
    aliveTime: 0,
    victim: '',
    victimColor: '',
  } as ResultTypes,
  setResultData: (resultData: ResultTypes) =>
    set(() => ({ resultData: { ...resultData } })),
}));

export default useResultStore;
