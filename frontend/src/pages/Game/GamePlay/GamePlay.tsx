import { CompatClient } from '@stomp/stompjs';
import { PlayersTypes, KillLogPlayersTypes } from '../../../types/GameTypes';

import { FlexLayout } from '../../../styles/layout';
import KillLog from '../components/KillLog';
import SpeechBubble from '../components/SpeechBubble';
import BattleField from './BattleField';

type GamePlayProps = {
  client: CompatClient;
  logs: KillLogPlayersTypes[];
  players: PlayersTypes[];
  comment: {
    sender: string;
    color: string;
    mention: string;
  };
};

export default function GamePlay({
  client,
  logs,
  players,
  comment,
}: GamePlayProps) {
  return (
    <FlexLayout $isCol gap='1rem'>
      <FlexLayout gap='2rem'>
        <KillLog logs={logs} />
        <SpeechBubble comment={comment} />
      </FlexLayout>
      <BattleField client={client} players={players} />
    </FlexLayout>
  );
}
