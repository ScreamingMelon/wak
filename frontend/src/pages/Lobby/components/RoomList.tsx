import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomlist } from '../../../services/room';
import { RoomListTypes } from '../../../types/RoomTypes';
import useUserStore from '../../../store/userStore';

import styled, { css } from 'styled-components';
import { FlexLayout, GridLayout } from '../../../styles/layout';
import { LargeText, SmallText, textStyles } from '../../../styles/fonts';
import WhiteRoundBox from '../../../components/WhiteRoundBox';

import arrow from '../../../assets/img-arrow.png';
import Button from '../../../components/Button';

const ListBlock = styled(FlexLayout)`
  position: relative;
`;

const ReloadBlock = styled.div`
  position: absolute;
  top: -6.8rem;
  left: 31.6rem;
`;

const TextBlock = styled(FlexLayout)`
  width: 100%;
  position: relative;
  align-items: start;
  padding-left: 1rem;
  ${textStyles}
`;

const LockImg = styled.img.attrs({
  alt: '자물쇠',
})`
  width: 2.4rem;
  position: absolute;
  top: -1rem;
  right: 1rem;
`;

const PageButton = styled.button<{ $right?: boolean }>`
  width: 3.6rem;
  height: 4.5rem;
  border: 0;
  background-color: transparent;
  background-image: url(${arrow});
  background-position: center;
  background-repeat: no-repeat;
  &:hover {
    background-size: cover;
  }
  ${(props) =>
    props.$right &&
    css`
      transform: rotate(0.5turn);
    `};
`;

type RoomListProps = {
  openDialog: (id: number, isPublic: boolean) => void;
};

export default function RoomList({ openDialog }: RoomListProps) {
  const navigate = useNavigate();
  const ROOM_NUM_SINGLE_PAGE = 6;
  const roomBlocks = Array.from({ length: ROOM_NUM_SINGLE_PAGE });
  const { token } = useUserStore().userData;
  const [roomPage, setRoomPage] = useState<{
    totalPage: number;
    rooms: RoomListTypes[];
  }>({
    totalPage: 0,
    rooms: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { totalPage, rooms } = roomPage;

  const showRoomList = async () => {
    try {
      const fetchedData = await getRoomlist();
      setRoomPage(fetchedData.data);
    } catch (error: any) {
      if (token === null) {
        navigate('/', { replace: true });
      } else {
        console.error('방 목록 가져오기 에러', error);
        navigate('/error', { replace: true });
      }
    }
  };

  useEffect(() => {
    showRoomList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (index: number) => {
    if (index < rooms.length) {
      openDialog(rooms[index].roomId, rooms[index].isPublic);
    }
  };
  const clickReload = () => {
    showRoomList();
    setCurrentPage(1);
  };
  const clickRight = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const clickLeft = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const RoomBlock = (index: number) => {
    return (
      <WhiteRoundBox
        key={index}
        width='36rem'
        clickable
        onClick={() => handleClick(index)}
      >
        {index < rooms.length && (
          <TextBlock $isCol gap='1.2rem'>
            <SmallText>{`${rooms[index].roomName}`}</SmallText>
            <>{`⌐╦╦═─ ${rooms[index].mode === 'SOLO' ? `개인전` : `팀전`} ( ${
              rooms[index].currentPlayers
            } / ${rooms[index].limitPlayers} 명 )`}</>
            <LockImg
              src={
                rooms[index].isPublic
                  ? require('../../../assets/img-unlock.png')
                  : require('../../../assets/img-lock.png')
              }
            />
          </TextBlock>
        )}
      </WhiteRoundBox>
    );
  };

  return (
    <ListBlock $isCol gap='3.6rem'>
      <ReloadBlock>
        <Button label={`⟳`} onClick={clickReload} />
      </ReloadBlock>
      <GridLayout $col={2} gap='2.4rem'>
        {roomBlocks.map((_, index) => {
          const roomsIndex = index + (currentPage - 1) * ROOM_NUM_SINGLE_PAGE;
          return RoomBlock(roomsIndex);
        })}
      </GridLayout>
      <FlexLayout gap='8rem'>
        <PageButton onClick={clickLeft} />
        <LargeText>{currentPage}</LargeText>
        <PageButton $right onClick={clickRight} />
      </FlexLayout>
    </ListBlock>
  );
}
