import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { BASE_URL, getAccessToken } from '../../constants/api';

import useUserStore from '../../store/userStore';
import useGameStore from '../../store/gameStore';
import useResultStore from '../../store/resultStore';
import useFinalResultStore from '../../store/finalResultStore';
import {
  PlayersTypes,
  KillLogPlayersTypes,
  RankPlayersTypes,
} from '../../types/GameTypes';
import { ResultTypes, FinalResultTypes } from '../../types/ResultTypes';

import { FlexLayout } from '../../styles/layout';
import Background from '../../components/Background';
import GameHeader from './components/GameHeader';
import ChatBox from '../../components/ChatBox';
import RankBox from './components/RankBox';

import GameWait from './GameWait/GameWait';
import GamePlay from './GamePlay/GamePlay';
import GameResult from './GameResult/GameResult';

export default function GamePage() {
  const COUNTDOWN_TIME = 5;
  const ACCESS_TOKEN = getAccessToken();
  const header = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const { id } = useParams();
  const { userId } = useUserStore().userData;
  const { gameData, setGameData } = useGameStore();
  const { setResultData } = useResultStore();
  const { setFinalResultData } = useFinalResultStore();
  const client = useRef<CompatClient | null>(null);

  const [state, setState] = useState<'WAIT' | 'PLAY' | 'RESULT'>('WAIT');
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [players, setPlayers] = useState<PlayersTypes[]>([]);
  const [logs, setLogs] = useState<KillLogPlayersTypes[]>([]);
  const [ranks, setRanks] = useState<RankPlayersTypes[]>([]);
  const [comment, setComment] = useState({
    sender: '',
    color: '',
    mention: '',
  });
  const [dashBoard, setDashBoard] = useState({
    roundNumber: 1,
    totalCount: 0,
    aliveCount: 0,
  });

  const connectHandler = () => {
    if (client.current && client.current.connected) {
      return;
    }
    const socket = new SockJS(`${BASE_URL}/socket`);
    client.current = Stomp.over(socket);
    client.current.connect(header, () => {
      client.current?.subscribe(
        `/topic/games/${id}/battle-field`,
        (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          if (data.isFinished) {
            console.log('finised');
            setGameData({
              ...gameData,
              roundNumber: data.roundNumber,
              nextRoundId: data.nextRoundId,
            });
            checkMyResult(data.results);
            data.roundNumber === 3 && checkMyFinalResult(data.finalResults);
            setState('RESULT');
          } else {
            setPlayers(data.players);
            checkAlive(data.players);
          }
        },
        header
      );
      client.current?.subscribe(
        `/topic/games/${id}/dashboard`,
        (message) => {
          console.log('대시보드');
          console.log(JSON.parse(message.body));
          setDashBoard(JSON.parse(message.body));
        },
        header
      );
      client.current?.subscribe(
        `/topic/games/${id}/kill-log`,
        (message) => {
          console.log('킬로그');
          console.log(JSON.parse(message.body));
          setLogs((prevLogs) => {
            const newLogs = [JSON.parse(message.body), ...prevLogs];
            return newLogs;
          });
        },
        header
      );
      client.current?.subscribe(
        `/topic/games/${id}/rank`,
        (message) => {
          console.log('랭킹');
          console.log(JSON.parse(message.body));
          setRanks([...JSON.parse(message.body).ranks]);
        },
        header
      );
      client.current?.subscribe(
        `/topic/games/${id}/mention`,
        (message) => {
          console.log('멘트');
          console.log(JSON.parse(message.body));
          setComment(JSON.parse(message.body));
        },
        header
      );
    });
  };

  const checkMyResult = (newResults: ResultTypes[]) => {
    newResults.forEach((result) => {
      if (userId === result.userId) {
        setResultData(result);
        return;
      }
    });
  };

  const checkMyFinalResult = (newResults: FinalResultTypes[]) => {
    newResults.forEach((result) => {
      if (userId === result.userId) {
        setFinalResultData(result);
        return;
      }
    });
  };

  const checkAlive = (newPlayers: PlayersTypes[]) => {
    newPlayers.forEach((player) => {
      if (userId === player.userId && player.stamina === 0) {
        setGameData({ ...gameData, isAlive: false });
        return;
      }
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    connectHandler();
    return () => {
      client.current?.disconnect(() => {}, header);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    setLogs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData.roundNumber]);

  useEffect(() => {
    if (countdown === 0) {
      setState('PLAY');
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <Background>
      {client.current && (
        <FlexLayout gap='4rem'>
          <FlexLayout $isCol gap='2rem'>
            <GameHeader dashBoard={dashBoard} />
            {state === 'WAIT' ? (
              <GameWait countdown={countdown} logs={logs} comment={comment} />
            ) : state === 'PLAY' ? (
              <GamePlay
                client={client.current}
                logs={logs}
                players={players}
                comment={comment}
              />
            ) : (
              <GameResult
                client={client.current}
                changeState={() => setState('PLAY')}
              />
            )}
          </FlexLayout>
          <FlexLayout $isCol gap='1.2rem'>
            <ChatBox mode='ROOM' isShort text={`방 채팅`} />
            <RankBox ranks={ranks} />
          </FlexLayout>
        </FlexLayout>
      )}
    </Background>
  );
}
