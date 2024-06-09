import styled from 'styled-components';
import { RegularText } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';

const TitleImg = styled.img.attrs({
  src: require('../../../assets/mainImg/img-title1.png'),
  alt: 'WAK GAME',
})`
  width: 28rem;
  height: fit-content;
`;

export default function GameTitle() {
  return (
    <FlexLayout $isCol gap='2rem'>
      <TitleImg />
      <RegularText>{`Win Alive with Clicks`}</RegularText>
    </FlexLayout>
  );
}
