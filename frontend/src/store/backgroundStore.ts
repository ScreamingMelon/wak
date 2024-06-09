import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Store {
  imgNumberData: number;
  setImgNumberData: (imgNumberData: number) => void;
}

const useBackgroundStore = create(
  persist<Store>(
    (set) => ({
      imgNumberData: 0,
      setImgNumberData: (imgNumberData: number) =>
        set(() => ({
          imgNumberData: imgNumberData,
        })),
    }),
    {
      name: 'backgroundStore',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useBackgroundStore;
