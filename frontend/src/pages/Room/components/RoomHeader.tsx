import styled, { keyframes } from 'styled-components';
import {
  RegularText,
  SmallText as OriginalSmallText,
} from '../../../styles/fonts';

const HeaderBlock = styled.div`
  place-self: stretch;
  display: flex;
  justify-content: space-between;
  align-items: end;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StateBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const coffeeAnimation = keyframes`
  0% { content: url(${require('../../../assets/img-coffee1.png')}); }
  50% { content: url(${require('../../../assets/img-coffee2.png')}); }
  100% { content: url(${require('../../../assets/img-coffee1.png')}); }
`;

const CoffeeImg = styled.div`
  width: 4rem;
  height: fit-content;
  animation: ${coffeeAnimation} 1s infinite;
`;

const LockImg = styled.img.attrs({
  alt: '자물쇠',
})`
  width: 3.2rem;
`;

const dotsAnimation = keyframes`
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '..'; }
  100% { content: '...'; }
`;

const SmallText = styled(OriginalSmallText)`
  &::after {
    content: '...';
    animation: ${dotsAnimation} 2s steps(4, end) infinite;
  }
`;

type RoomHeaderProps = {
  roomName: string;
  currentPlayers: number;
  limitPlayers: number;
  isPublic: boolean;
  isHost: boolean;
};

export default function RoomHeader({
  roomName,
  currentPlayers,
  limitPlayers,
  isPublic,
  isHost,
}: RoomHeaderProps) {
  return (
    <HeaderBlock>
      <TextBlock>
        {!isHost && (
          <StateBlock>
            <CoffeeImg />
            <SmallText>{`방장이 게임을 시작하기를 기다리는 중입니다`}</SmallText>
          </StateBlock>
        )}
        <RegularText>{`현재 방 이름 : ${roomName}`}</RegularText>
        <RegularText>{`참가자 수 : ${currentPlayers} / ${limitPlayers} 명`}</RegularText>
      </TextBlock>
      <LockImg
        src={
          isPublic
            ? require('../../../assets/img-unlock.png')
            : require('../../../assets/img-lock.png')
        }
      />
    </HeaderBlock>
  );
}
