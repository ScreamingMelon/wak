import { Link } from 'react-router-dom';
import { LargeText, RegularText } from '../styles/fonts';
import { FlexLayout } from '../styles/layout';
import Background from './Background';
import Button from './Button';

export default function NotFound() {
  return (
    <Background isCol gap='6rem'>
      <FlexLayout $isCol gap='2rem'>
        <LargeText>{`ERROR! : 404`}</LargeText>
        <RegularText>{`페이지를 찾을 수 없습니다.`}</RegularText>
      </FlexLayout>
      <Link to={`/lobby`}>
        <Button isBigger label={`BACK TO LOBBY`} />
      </Link>
    </Background>
  );
}
