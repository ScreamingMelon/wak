import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';

import { CHAT_URL, getAccessToken } from '../constants/api';
import useUserStore from '../store/userStore';

import styled from 'styled-components';
import { FlexLayout } from '../styles/layout';
import { textStyles } from '../styles/fonts';

import WhiteBox from './WhiteBox';
import GrayTitleBox from './GrayTitleBox';
import Input from './Input';
import Button from './Button';

const ChatBlock = styled.div<{ height: string }>`
  width: 32rem;
  height: ${(props) => props.height};
  ${textStyles}
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
`;

const ChatLine = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const ChatText = styled.div`
  ${textStyles}
`;

type ChatBoxProps = {
  mode: 'LOBBY' | 'ROOM';
  isShort?: boolean;
  text: string;
};

export default function ChatBox({ mode, isShort, text }: ChatBoxProps) {
  const ACCESS_TOKEN = getAccessToken();
  const header = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const storage = window.sessionStorage;
  const chattingData = storage.getItem('chattingData');

  const { userData } = useUserStore();
  const [chatting, setChatting] = useState('');
  const [userChatting, setUserChatting] = useState<string[][]>(
    chattingData ? JSON.parse(chattingData) : []
  );
  const [reset, setReset] = useState(false);
  const clientRef = useRef<CompatClient | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  let url: string;
  const { id } = useParams();
  const changeMode = () => {
    if (storage.getItem('mode') !== mode) {
      storage.removeItem('chattingData');
      storage.setItem('mode', mode);
    }
  };

  if (mode === 'LOBBY') {
    url = 'lobby-chat';
    changeMode();
  } else {
    url = `chats/${id}`;
    changeMode();
  }

  const handleChange = (e: { target: { value: string } }) => {
    setChatting(e.target.value);
  };

  const handleClick = () => {
    const chat = JSON.stringify({
      message: chatting,
      sender: userData.nickname,
      color: userData.color,
    });
    clientRef.current?.send(`/app/${url}`, header, chat);
    setReset(true);
  };

  const connectChatHandler = () => {
    const socket = new SockJS(`${CHAT_URL}/socket`);
    clientRef.current = Stomp.over(socket);
    clientRef.current.connect(header, () => {
      clientRef.current?.subscribe(
        `/topic/${url}`,
        (message) => {
          const fetchedData = JSON.parse(message.body);
          setUserChatting((prevChatting) => {
            const newChatting = [
              ...prevChatting,
              [fetchedData.color, fetchedData.sender, fetchedData.message],
            ];
            return newChatting;
          });
        },
        header
      );
    });
  };

  useEffect(() => {
    storage.setItem('chattingData', JSON.stringify(userChatting));
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userChatting]);

  useEffect(() => {
    setUserChatting([]);
    connectChatHandler();
    return () => {
      clientRef.current?.disconnect(() => {
        clientRef.current?.unsubscribe(`/topic/${url}`);
      }, header);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  return (
    <WhiteBox mode={isShort ? 'MEDIUM' : 'TALL'} width='32rem'>
      <GrayTitleBox text={text} />
      <ChatBlock height={isShort ? '15.2rem' : '45.2rem'}>
        {userChatting.map((value, index) => {
          const [color, sender, message] = value;
          return (
            <ChatLine key={index}>
              <ChatText color={color}>{sender}</ChatText>
              <ChatText>{`: ${message}`}</ChatText>
            </ChatLine>
          );
        })}
        <div ref={messageEndRef}></div>
      </ChatBlock>
      <FlexLayout gap='1rem'>
        <Input
          name='chatting'
          reset={reset}
          onChange={handleChange}
          handleKeyDown={handleClick}
        />
        <Button label={`전송`} onClick={handleClick} />
      </FlexLayout>
    </WhiteBox>
  );
}