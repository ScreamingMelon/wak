import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameTypes } from '../types/GameTypes';

interface Store {
  gameData: GameTypes;
  setGameData: (gameData: GameTypes) => void;
}

const useGameStore = create(
  persist<Store>(
    (set) => ({
      gameData: {
        roundId: -1,
        nextRoundId: -1,
        roundNumber: 1,
        roomName: '',
        hostName: '',
        comment: '',
        showNickname: true,
        isAlive: true,
        playersNumber: 0,
      } as GameTypes,
      setGameData: (gameData: GameTypes) =>
        set(() => ({ gameData: { ...gameData } })),
    }),
    {
      name: 'gameStore',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useGameStore;
