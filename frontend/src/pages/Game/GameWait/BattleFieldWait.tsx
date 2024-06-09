import { FlexLayout } from '../../../styles/layout';
import { RegularText, SmallText } from '../../../styles/fonts';

import GrayBox from '../../../components/GrayBox';

type BattleFiledWaitProps = {
  countdown: number;
};

export default function BattleFieldWait({ countdown }: BattleFiledWaitProps) {
  return (
    <GrayBox mode={'MEDIUM'} width={'79.2rem'}>
      <FlexLayout $isCol gap='2rem'>
        <RegularText color='black'>{`라운드 시작까지 ...${countdown}초`}</RegularText>
        <SmallText color='black'>{`이 곳에 플레이어들이 표시됩니다.`}</SmallText>
      </FlexLayout>
    </GrayBox>
  );
}
