import { useState } from 'react';
import useGameStore from '../../../store/gameStore';

import styled from 'styled-components';
import { SmallText } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';
import GrayBox from '../../../components/GrayBox';
import CheckboxInput from '../../../components/CheckboxInput';
import Input from '../../../components/Input';

const TextBlock = styled(FlexLayout)`
  align-items: start;
`;

export default function RoomSetting() {
  const { gameData, setGameData } = useGameStore();
  const [warn, setWarn] = useState(false);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (value.length > 15) {
      setWarn(true);
    } else {
      setWarn(false);
      setGameData({ ...gameData, [name]: value });
    }
  };

  return (
    <GrayBox mode='SHORT' width='79.2rem'>
      <TextBlock $isCol gap='1.6rem'>
        <SmallText color='black'>{`방장 게임 룰 설정`}</SmallText>
        <TextBlock $isCol gap='1.4rem'>
          <FlexLayout gap='1rem'>
            <SmallText color='black'>{`>> 게임 화면에서 닉네임 가리기`}</SmallText>
            <CheckboxInput
              onClick={() =>
                setGameData({
                  ...gameData,
                  showNickname: !gameData.showNickname,
                })
              }
            />
          </FlexLayout>
          <FlexLayout gap='1rem'>
            <SmallText color='black'>{`>> 도발 멘트:`}</SmallText>
            <Input name={`comment`} width='38rem' onChange={handleChange} />
            <SmallText
              color={warn ? '#e84b4b' : 'black'}
            >{`(15자 이내)`}</SmallText>
          </FlexLayout>
        </TextBlock>
      </TextBlock>
    </GrayBox>
  );
}
