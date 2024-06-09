import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompatClient } from '@stomp/stompjs';

import { getAccessToken } from '../../../constants/api';
import useUserStore from '../../../store/userStore';
import useGameStore from '../../../store/gameStore';
import { isOverlap } from '../../../utils/isOverlap';

import styled from 'styled-components';
import GrayBox from '../../../components/GrayBox';
import PlayerNickname from '../../../components/PlayerNickname';
import { getBattleField } from '../../../services/game';
import { PlayersTypes } from '../../../types/GameTypes';

const BattleFieldLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Dot = styled.div<{ $top: string; $left: string }>`
  position: absolute;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
`;

type DotPosition = {
  top: string;
  left: string;
};

type BattleFieldProps = {
  client: CompatClient;
  players: PlayersTypes[];
};

export default function BattleField({ client, players }: BattleFieldProps) {
  const navigate = useNavigate();
  const ACCESS_TOKEN = getAccessToken();
  const header = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const { id } = useParams();
  const { userId } = useUserStore().userData;
  const { gameData } = useGameStore();
  const [dots, setDots] = useState<DotPosition[]>([]);

  const showBattleField = async () => {
    try {
      id && (await getBattleField(parseInt(id)));
    } catch (error: any) {
      console.error('배틀필드 요청 에러', error);
      navigate('/error', { replace: true });
    }
  };

  useEffect(() => {
    showBattleField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const generatedDots: DotPosition[] = [];
    const generateRandomPosition = () => ({
      top: `${Math.random() * 92}%`,
      left: `${Math.random() * 92}%`,
    });

    while (generatedDots.length < gameData.playersNumber) {
      const newPosition = generateRandomPosition();
      if (!isOverlap(newPosition, generatedDots)) {
        generatedDots.push(newPosition);
      }
    }
    setDots(generatedDots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData.roundNumber]);

  const handleClick = (victimId: number) => {
    if (userId && userId !== victimId) {
      const currentTime = new Date().toISOString();
      const message = JSON.stringify({
        roomId: id && parseInt(id),
        roundId: gameData.roundId,
        userId: userId,
        victimId: victimId,
        clickTime: currentTime,
      });
      client.send(`/app/click/${id}`, header, message);
    }
  };

  return (
    <GrayBox mode={'MEDIUM'} width={'79.2rem'}>
      <BattleFieldLayout>
        {dots.map((dot, index) => (
          <Dot key={index} $top={dot.top} $left={dot.left}>
            {index < players.length && players[index].stamina > 0 && (
              <PlayerNickname
                isCol
                isHidden={!gameData.showNickname}
                nickname={players[index].nickname}
                color={gameData.showNickname ? players[index].color : 'black'}
                onClick={() => handleClick(players[index].userId)}
              />
            )}
          </Dot>
        ))}
      </BattleFieldLayout>
    </GrayBox>
  );
}
