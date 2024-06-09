import { create } from 'zustand';
import { RoomInfoTypes } from '../types/RoomTypes';

interface Store {
  roomData: RoomInfoTypes;
  setRoomData: (roomData: RoomInfoTypes) => void;
}

const useRoomStore = create<Store>((set) => ({
  roomData: {
    roomId: -1,
    roomName: '',
    mode: '',
    limitPlayers: 0,
    isPublic: true,
    userId: -1,
    isHost: false,
  } as RoomInfoTypes,
  setRoomData: (roomData: RoomInfoTypes) =>
    set(() => ({ roomData: { ...roomData } })),
}));

export default useRoomStore;
