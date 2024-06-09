import { useState } from 'react';

import { FlexLayout } from '../../styles/layout';
import Background from '../../components/Background';
import ChatBox from '../../components/ChatBox';
import LobbyHeader from './components/LobbyHeader';
import RoomList from './components/RoomList';
import NewRoomDialog from './components/NewRoomDialog';
import EnterCheckDialog from './components/EnterCheckDialog';

export default function LobbyPage() {
  const [isOpen, setIsOpen] = useState({
    newRoomDialog: false,
    enterCheckDialog: false,
  });
  const [clickedRoom, setClickedRoom] = useState({
    roomId: 0,
    isPublic: false,
  });

  const handleCheckDialog = (id: number, isPublic: boolean) => {
    setClickedRoom({ roomId: id, isPublic: isPublic });
    setIsOpen({ ...isOpen, enterCheckDialog: true });
  };

  return (
    <>
      <Background>
        <FlexLayout gap='4rem'>
          <FlexLayout $isCol gap='3.2rem'>
            <LobbyHeader
              openDialog={() => setIsOpen({ ...isOpen, newRoomDialog: true })}
            />
            <RoomList
              openDialog={(id: number, isPublic: boolean) =>
                handleCheckDialog(id, isPublic)
              }
            />
          </FlexLayout>
          <div>
            <ChatBox mode='LOBBY' text={`전체 채팅`} />
          </div>
        </FlexLayout>
      </Background>
      {isOpen.newRoomDialog && (
        <NewRoomDialog
          closeDialog={() => setIsOpen({ ...isOpen, newRoomDialog: false })}
        />
      )}
      {isOpen.enterCheckDialog && (
        <EnterCheckDialog
          clickedRoom={clickedRoom}
          closeDialog={() => setIsOpen({ ...isOpen, enterCheckDialog: false })}
        />
      )}
    </>
  );
}
