export type ResultTypes = {
  userId: number;
  killCount: number;
  rank: number;
  playTime: number;
  aliveTime: number;
  victim: string;
  victimColor: string;
};

export type FinalResultTypes = {
  userId: number;
  totalTime: number;
  totalAliveTime: number;
  totalKillCount: number;
  finalRank: number;
  rankwinnerNickname: string;
  winnerColor: string;
};
