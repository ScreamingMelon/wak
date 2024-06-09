import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';

import StartPage from '../pages/Start/Start';
import LobbyPage from '../pages/Lobby/Lobby';
import RoomPage from '../pages/Room/Room';
import GamePage from '../pages/Game/Game';
import NotFound from './NotFound';

const Layout = styled.div`
  width: 100dvw;
  height: 100dvh;
`;

export default function Main() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<StartPage />} />
        <Route path='/lobby' element={<LobbyPage />} />
        <Route path='/room/:id' element={<RoomPage />} />
        <Route path='/game/:id' element={<GamePage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
