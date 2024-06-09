import styled from 'styled-components';
import { SmallText, textStyles } from '../styles/fonts';
import { FlexLayout } from '../styles/layout';

const NicknameBox = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
`;

const TinyText = styled.div`
  ${textStyles}
  font-size: 1.2rem;
`;

type PlayerNicknameProps = {
  isCol?: boolean;
  isHidden?: boolean;
  nickname: string;
  color: string;
  onClick?: () => void;
};

export default function PlayerNickname({
  isCol,
  isHidden,
  nickname,
  color,
  ...props
}: PlayerNicknameProps) {
  return (
    <FlexLayout $isCol={isCol} gap={isCol ? '0.2rem' : '1rem'}>
      <NicknameBox color={color} {...props} />
      {isHidden ? (
        <></>
      ) : isCol ? (
        <TinyText color={color}>{nickname}</TinyText>
      ) : (
        <SmallText color={color}>{nickname}</SmallText>
      )}
    </FlexLayout>
  );
}
