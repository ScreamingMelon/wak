import { RankPlayersTypes } from '../../../types/GameTypes';

import styled from 'styled-components';
import { GridLayout } from '../../../styles/layout';
import { textStyles } from '../../../styles/fonts';
import WhiteBox from '../../../components/WhiteBox';
import GrayTitleBox from '../../../components/GrayTitleBox';

const RankLayout = styled(GridLayout)`
  width: 28rem;
  padding-left: 1.2rem;
  place-self: start;
  ${textStyles}
`;

const GridSpan = styled.div<{ $col: number; $align: string }>`
  grid-column: span ${(props) => props.$col} / span ${(props) => props.$col};
  text-align: ${(props) => props.$align};
  ${textStyles}
`;

const HorizontalLine = styled.div`
  width: 96%;
  height: 0.1rem;
  background-color: white;
`;

const RankingBlock = styled.div`
  width: 100%;
  height: 60%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

type RankBoxProps = { ranks: RankPlayersTypes[] };

export default function RankBox({ ranks }: RankBoxProps) {
  const RankText = (
    ranking: string,
    nickname: string,
    killCount: string,
    color?: string,
    key?: number
  ) => {
    return (
      <RankLayout key={key} $col={4} gap='0.4rem'>
        <GridSpan $col={1} $align={`start`}>
          {ranking}
        </GridSpan>
        <GridSpan color={color} $col={2} $align={`center`}>
          {nickname}
        </GridSpan>
        <GridSpan $col={1} $align={`end`}>
          {killCount}
        </GridSpan>
      </RankLayout>
    );
  };

  return (
    <WhiteBox mode='MEDIUM' width='32rem'>
      <GrayTitleBox text={`랭킹`} />
      {RankText(`순위`, `닉네임`, `킬수`)}
      <HorizontalLine />
      <RankingBlock>
        {ranks.map((rank, index) => {
          return RankText(
            `${index + 1}위`,
            rank.nickname,
            `${rank.killCnt}킬`,
            rank.color,
            index
          );
        })}
      </RankingBlock>
    </WhiteBox>
  );
}
