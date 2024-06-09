import { KillLogPlayersTypes } from '../../../types/GameTypes';

import styled, { css } from 'styled-components';
import { FlexLayout } from '../../../styles/layout';
import { textStyles } from '../../../styles/fonts';
import WhiteRoundBox from '../../../components/WhiteRoundBox';

const KillLogBlock = styled.div<{ $isWaiting?: boolean }>`
  width: 100%;
  height: 90%;
  overflow-y: auto;
  ${(props) =>
    props.$isWaiting &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
    `}
`;

const TextBlock = styled(FlexLayout)`
  justify-content: space-evenly;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
`;

const Text = styled.div`
  ${textStyles}
`;

type KillLogProps = {
  isWaiting?: boolean;
  logs: KillLogPlayersTypes[];
};

export default function KillLog({ isWaiting, logs }: KillLogProps) {
  return (
    <WhiteRoundBox width='32rem'>
      <KillLogBlock $isWaiting={isWaiting}>
        {isWaiting ? (
          <TextBlock>
            <Text>{`Kill Log`}</Text>
          </TextBlock>
        ) : (
          logs.map((value, index) => {
            return (
              <TextBlock key={index}>
                <Text color={value.color}>{value.userNickname}</Text>
                <Text>{`⌐╦═╦═─`}</Text>
                <Text color={value.victimColor}>{value.victimNickName}</Text>
                <Text>{`X`}</Text>
              </TextBlock>
            );
          })
        )}
      </KillLogBlock>
    </WhiteRoundBox>
  );
}
