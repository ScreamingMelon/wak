import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterRoom } from '../../../services/room';

import styled from 'styled-components';
import { textStyles, SmallText } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const ContentBlock = styled(FlexLayout)`
  align-items: start;
`;

const WarnText = styled.div`
  ${textStyles}
`;

type EnterCheckDialogProps = {
  clickedRoom: { roomId: number; isPublic: boolean };
  closeDialog: () => void;
};

export default function EnterCheckDialog({
  clickedRoom,
  closeDialog,
}: EnterCheckDialogProps) {
  const navigate = useNavigate();
  const { roomId, isPublic } = clickedRoom;
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<
    'OK' | 'WRONG_PASSWORD' | 'FULL_ROOM' | 'ALREADY_START'
  >('OK');

  const handleChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };
  const handleClick = async () => {
    try {
      const fetchedData = await enterRoom(roomId, password);
      fetchedData.success && navigate(`/room/${roomId}`);
    } catch (error: any) {
      const { message } = error.response.data.error.apierror;
      if (message === 'ROOM PASSWORD IS WRONG') {
        setMessage('WRONG_PASSWORD');
      } else if (message === 'ROOM IS FULL') {
        setMessage('FULL_ROOM');
      } else if (message === 'ROOM IS START') {
        setMessage('ALREADY_START');
      } else {
        console.error('방 입장하기 에러', error);
        navigate('/error', { replace: true });
      }
    }
  };

  return (
    <Dialog mode={'SHORT'} width='40rem' isOpen onClose={closeDialog}>
      {message === 'OK' || message === 'WRONG_PASSWORD' ? (
        isPublic ? (
          <FlexLayout $isCol gap='2rem'>
            <SmallText color='black'>{`게임에 입장하시겠습니까?`}</SmallText>
            <Button isBigger label={`YES`} onClick={handleClick} />
          </FlexLayout>
        ) : (
          <ContentBlock
            $isCol
            gap={message === 'WRONG_PASSWORD' ? '1.4rem' : '2rem'}
          >
            <ContentBlock $isCol gap='0.6rem'>
              <SmallText color='black'>{`비밀번호 입력`}</SmallText>
              {message === 'WRONG_PASSWORD' && (
                <WarnText color='#e84b4b'>{`비밀번호를 다시 확인해 주세요 ( ᵕ‧̯ᵕ̥̥ )`}</WarnText>
              )}
            </ContentBlock>
            <FlexLayout gap='1rem'>
              <Input name={`password`} width='26rem' onChange={handleChange} />
              <Button label={`입장`} onClick={handleClick} />
            </FlexLayout>
          </ContentBlock>
        )
      ) : (
        <FlexLayout $isCol gap='2rem'>
          <SmallText color='black'>
            {message === 'FULL_ROOM'
              ? `인원이 초과된 방입니다`
              : `이미 게임이 시작된 방입니다`}
          </SmallText>
          <Button
            isBigger
            label={`⟳`}
            onClick={() => {
              window.location.reload();
            }}
          />
        </FlexLayout>
      )}
    </Dialog>
  );
}
