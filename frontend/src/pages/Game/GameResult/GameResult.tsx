import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompatClient } from '@stomp/stompjs';
import { getAccessToken } from '../../../constants/api';
import useUserStore from '../../../store/userStore';
import useGameStore from '../../../store/gameStore';
import useResultStore from '../../../store/resultStore';
import useFinalResultStore from '../../../store/finalResultStore';

import { FlexLayout } from '../../../styles/layout';
import { RegularText, SmallText } from '../../../styles/fonts';
import GrayBox from '../../../components/GrayBox';
import Input from '../../../components/Input';

type GameResultProps = {
  client: CompatClient;
  changeState: () => void;
};

export default function GameResult({ client, changeState }: GameResultProps) {
  const RESULTS_LENGTH = 4;
  const ROUND_NUMBER = 3;
  const navigate = useNavigate();
  const ACCESS_TOKEN = getAccessToken();
  const header = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const { id } = useParams();
  const { userId } = useUserStore().userData;
  const { gameData, setGameData } = useGameStore();
  const { roundNumber, roundId, nextRoundId } = useGameStore().gameData;
  const { killCount, rank, playTime, aliveTime, victim, victimColor } =
    useResultStore().resultData;
  const {
    totalTime,
    totalAliveTime,
    totalKillCount,
    finalRank,
    rankwinnerNickname,
    winnerColor,
  } = useFinalResultStore().finalResultData;
  const [countdown, setCountdown] = useState(30);
  const [warn, setWarn] = useState(false);
  const [mention, setMention] = useState('');

  const handleChange = (e: { target: { value: string } }) => {
    if (e.target.value.length > 15) {
      setWarn(true);
    } else {
      setWarn(false);
      setMention(e.target.value);
    }
  };

  const sendMention = () => {
    const message = JSON.stringify({
      userId: userId,
      roundId: roundId,
      nextRoundId: nextRoundId,
      roomId: id && parseInt(id),
      mention: mention,
    });
    client.send(`/app/mention/${id}`, header, message);
    console.log(message);
  };

  useEffect(() => {
    if (countdown === 0) {
      if (roundNumber < ROUND_NUMBER) {
        rank === 1 && sendMention();
        const next = nextRoundId;
        setGameData({
          ...gameData,
          roundId: next,
          roundNumber: roundNumber + 1,
        });
        changeState();
      } else {
        navigate(`/lobby`);
      }
    } else {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const ResultText = ({
    title,
    results,
    timeText,
  }: {
    title: string;
    results: string[][];
    timeText: string;
  }) => {
    return (
      <FlexLayout
        $isCol
        gap={roundNumber < ROUND_NUMBER && rank === 1 ? '4rem' : '6rem'}
      >
        <RegularText color='black'>{title}</RegularText>
        <FlexLayout $isCol gap='2.4rem'>
          {results.slice(0, RESULTS_LENGTH - 1).map((value, index) => {
            return (
              <FlexLayout key={index} gap='1.2rem'>
                <SmallText color='black'>{`${value[0]} :`}</SmallText>
                <SmallText color={value[1] === '1위' ? '#ffde32' : 'black'}>
                  {value[1]}
                </SmallText>
              </FlexLayout>
            );
          })}
          {roundNumber < ROUND_NUMBER && rank === 1 ? (
            <FlexLayout $isCol gap='1rem'>
              <SmallText color='black'>{`${
                roundNumber + 1
              } 라운드 도발 멘트`}</SmallText>
              <FlexLayout gap='1rem'>
                <Input name={`mention`} width='38rem' onChange={handleChange} />
                <SmallText
                  color={warn ? '#e84b4b' : 'black'}
                >{`(15자 이내)`}</SmallText>
              </FlexLayout>
            </FlexLayout>
          ) : (
            <FlexLayout gap='1.2rem'>
              <SmallText color='black'>{`${
                results[RESULTS_LENGTH - 1][0]
              } :`}</SmallText>
              <SmallText
                color={roundNumber < ROUND_NUMBER ? victimColor : winnerColor}
              >
                {results[RESULTS_LENGTH - 1][1]}
              </SmallText>
            </FlexLayout>
          )}
        </FlexLayout>
        <SmallText color='black'>{timeText}</SmallText>
      </FlexLayout>
    );
  };

  const roundData = {
    title: `<< ${roundNumber} 라운드 결과 >>`,
    results: [
      ['게임 시간', `${playTime}초`],
      ['나의 킬 수', `${killCount}킬`],
      ['나의 랭킹', `${rank}위`],
      ['나를 죽인 사람', `${rank === 1 ? `없음` : victim}`],
    ],
    timeText: `${
      roundNumber === ROUND_NUMBER
        ? `최종 결과 표시까지`
        : `${roundNumber + 1} 라운드 시작까지`
    } ...${countdown}초`,
  };

  const finalData = {
    title: `<< 최종 결과 >>`,
    results: [
      ['총 게임 시간', `${totalTime}초`],
      ['나의 총 킬 수', `${totalKillCount}킬`],
      ['나의 최종 랭킹', `${finalRank}위`],
      ['최종 1위', `${rankwinnerNickname}`],
    ],
    timeText: `게임 종료까지 ...${countdown}초`,
  };

  return (
    <FlexLayout $isCol gap='1rem'>
      <GrayBox mode={'TALL'} width={'79.2rem'}>
        {roundNumber < ROUND_NUMBER
          ? ResultText(roundData)
          : ResultText(finalData)}
      </GrayBox>
    </FlexLayout>
  );
}
