import { KillLogPlayersTypes } from '../../../types/GameTypes';

import { FlexLayout } from '../../../styles/layout';
import KillLog from '../components/KillLog';
import SpeechBubble from '../components/SpeechBubble';
import BattleFieldWait from './BattleFieldWait';

type GameWaitProps = {
  countdown: number;
  logs: KillLogPlayersTypes[];
  comment: {
    sender: string;
    color: string;
    mention: string;
  };
};

export default function GameWait({ countdown, logs, comment }: GameWaitProps) {
  return (
    <FlexLayout $isCol gap='1rem'>
      <FlexLayout gap='2rem'>
        <KillLog isWaiting logs={logs} />
        <SpeechBubble comment={comment} />
      </FlexLayout>
      <BattleFieldWait countdown={countdown} />
    </FlexLayout>
  );
}
