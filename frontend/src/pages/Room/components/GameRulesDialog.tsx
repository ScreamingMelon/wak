import { RegularText, SmallText, textStyles } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';
import Dialog from '../../../components/Dialog';
import styled from 'styled-components';

const TinyText = styled.div`
  ${textStyles}
`;

type GameRulesDialogProps = {
  closeDialog: () => void;
};

export default function GameRulesDialog({ closeDialog }: GameRulesDialogProps) {
  return (
    <Dialog mode={'TALL'} isOpen onClose={closeDialog}>
      <FlexLayout $isCol gap='2.8rem'>
        <FlexLayout $isCol gap='1rem'>
          <RegularText color='black'>{`▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀ 게임 방법 ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀`}</RegularText>
        </FlexLayout>
        <SmallText color='black'>{`<개인전>`}</SmallText>
        <FlexLayout $isCol gap='1rem'>
          <SmallText color='black'>{`1. 게임이 시작되면`}</SmallText>
          <SmallText color='black'>{`참가한 플레이어들의 닉네임이 화면에 보입니다`}</SmallText>
        </FlexLayout>
        <FlexLayout $isCol gap='1rem'>
          <SmallText color='black'>{`2. 빠르고 정확하게!`}</SmallText>
          <SmallText color='black'>{`다른 플레이어의 도트를 클릭하여 제거하세요`}</SmallText>
        </FlexLayout>
        <FlexLayout $isCol gap='1rem'>
          <SmallText color='black'>{`3. 총 3라운드로 진행되며`}</SmallText>
          <SmallText color='black'>{`플레이어를 가장 많이 제거한 플레이어가 우승합니다`}</SmallText>
        </FlexLayout>
        <FlexLayout $isCol gap='1rem'>
          <TinyText color='#725BFF'>{`(tip)`}</TinyText>
          <TinyText color='black'>{`방장이 닉네임 가리기 모드를 설정하면 서로의 닉네임을 볼 수 없어요`}</TinyText>
          <TinyText color='black'>{`왼쪽 상단에 있는 킬로그를 참고해보세요! 누가 제일 빠를까요?`}</TinyText>
        </FlexLayout>
      </FlexLayout>
    </Dialog>
  );
}
