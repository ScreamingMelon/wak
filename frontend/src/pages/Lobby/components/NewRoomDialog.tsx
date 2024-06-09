import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../../services/room';

import styled, { keyframes, css } from 'styled-components';
import { FlexLayout } from '../../../styles/layout';
import { RegularText, SmallText, textStyles } from '../../../styles/fonts';
import Dialog from '../../../components/Dialog';
import Input from '../../../components/Input';
import CheckboxInput from '../../../components/CheckboxInput';
import RoundButton from '../../../components/RoundButton';

const DialogTitle = styled(RegularText)`
  margin-top: 1rem;
  margin-bottom: 4rem;
`;

const ContentBlock = styled(FlexLayout)`
  align-items: start;
`;

const InputBlock = styled(FlexLayout)`
  position: relative;
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const WarningText = styled.div<{ $warn: boolean }>`
  position: absolute;
  top: 4.8rem;
  right: 0;
  ${textStyles}
  ${(props) =>
    props.$warn &&
    css`
      color: #e84b4b;
      animation: ${shake} 0.5s;
    `}
`;

const TinyText = styled.div`
  ${textStyles}
`;

const ButtonBlock = styled.div`
  margin-top: 4rem;
  margin-bottom: 0.4rem;
`;

type NewRoomDialogProps = {
  closeDialog: () => void;
};

export default function NewRoomDialog({ closeDialog }: NewRoomDialogProps) {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    title: '',
    players: 0,
    isSecret: false,
    password: '',
    mode: 'SOLO',
  });
  const [warn, setWarn] = useState({
    warnTitle: false,
    warnPlayers: false,
    warnPassword: false,
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleClick = async () => {
    const updatedWarn = { ...warn };
    updatedWarn.warnTitle = info.title.length < 2 || info.title.length > 12;
    updatedWarn.warnPlayers = !/^(?:[2-9]|[1-9][0-9]|100)$/.test(
      info.players.toString()
    );
    updatedWarn.warnPassword = info.isSecret && !/^\d{4}$/.test(info.password);

    setWarn(updatedWarn);
    setTimeout(() => {
      setWarn({
        warnTitle: false,
        warnPlayers: false,
        warnPassword: false,
      });
    }, 500);

    if (
      updatedWarn.warnTitle === false &&
      updatedWarn.warnPlayers === false &&
      updatedWarn.warnPassword === false
    ) {
      try {
        const { title, players, password, mode } = info;
        const fetchedData = await createRoom(title, players, password, mode);
        navigate(`/room/${fetchedData.data.roomId}`);
      } catch (error: any) {
        console.error('방 만들기 에러', error);
        navigate('/error', { replace: true });
      }
    }
  };

  return (
    <Dialog mode='TALL' isOpen onClose={closeDialog}>
      <DialogTitle color='black'>{`₊‧.°.⋆ 새로운 방 •˚₊‧⋆.`}</DialogTitle>
      <ContentBlock $isCol gap='4.8rem'>
        <InputBlock gap='1rem'>
          <SmallText color='black'>{`방 제목 :`}</SmallText>
          <Input name={`title`} width='52rem' onChange={handleChange} />
          <WarningText
            color='#7c7c7c'
            $warn={warn.warnTitle}
          >{`2자에서 12자 입력`}</WarningText>
        </InputBlock>
        <InputBlock gap='1rem'>
          <SmallText color='black'>{`인원 :`}</SmallText>
          <FlexLayout gap='1rem'>
            <Input name={`players`} width='39.8rem' onChange={handleChange} />
            <SmallText color='black'>{`명 / 100 명`}</SmallText>
          </FlexLayout>
          <WarningText
            color='#7c7c7c'
            $warn={warn.warnPlayers}
          >{`2 이상 100 이하의 숫자 입력`}</WarningText>
        </InputBlock>

        <ContentBlock $isCol gap='2.8rem'>
          <FlexLayout gap='4rem'>
            <FlexLayout gap='1rem'>
              <SmallText color='black'>{`비밀방`}</SmallText>
              <CheckboxInput
                onClick={() => setInfo({ ...info, isSecret: !info.isSecret })}
              />
            </FlexLayout>
            <InputBlock gap='1rem'>
              <SmallText color='black'>{`비밀번호`}</SmallText>
              <Input
                name={`password`}
                width='35.8rem'
                disabled={!info.isSecret}
                onChange={handleChange}
              />
              <WarningText
                color='#7c7c7c'
                $warn={warn.warnPassword}
              >{`4자리 숫자 입력`}</WarningText>
            </InputBlock>
          </FlexLayout>
          <FlexLayout gap='4rem'>
            <FlexLayout gap='1rem'>
              <SmallText color='black'>{`개인전`}</SmallText>
              <CheckboxInput checked />
            </FlexLayout>
            <FlexLayout gap='1rem'>
              <SmallText color='black'>{`팀전`}</SmallText>
              <CheckboxInput disabled />
              <TinyText color='#7c7c7c'>{`(준비 중이에요._.)`}</TinyText>
            </FlexLayout>
          </FlexLayout>
        </ContentBlock>
      </ContentBlock>
      <ButtonBlock>
        <RoundButton label={`방 만들기`} onClick={handleClick} />
      </ButtonBlock>
    </Dialog>
  );
}
