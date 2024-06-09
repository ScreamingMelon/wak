import useBackgroundStore from '../store/backgroundStore';

import styled from 'styled-components';
import { FlexLayout, ImgBackground, DarkBackground } from '../styles/layout';

import mainImg1 from '../assets/mainImg/img-main1.png';
import mainImg2 from '../assets/mainImg/img-main2.png';
import mainImg3 from '../assets/mainImg/img-main3.png';
import mainImg4 from '../assets/mainImg/img-main4.png';
import mainImg5 from '../assets/mainImg/img-main5.png';
import mainImg6 from '../assets/mainImg/img-main6.png';
import mainImg7 from '../assets/mainImg/img-main7.png';
import mainImg8 from '../assets/mainImg/img-main8.png';

const BackgroundLayout = styled(FlexLayout)`
  width: 100%;
  height: 100%;
`;

type BackgroundProps = {
  isCol?: boolean;
  gap?: string;
  opaque?: number;
  mainImg?: string;
  children: React.ReactNode;
};

export default function Background({
  isCol,
  gap,
  opaque,
  children,
}: BackgroundProps) {
  const mainImgs = [
    mainImg1,
    mainImg2,
    mainImg3,
    mainImg4,
    mainImg5,
    mainImg6,
    mainImg7,
    mainImg8,
  ];
  const { imgNumberData } = useBackgroundStore();

  return (
    <ImgBackground $img={mainImgs[imgNumberData]}>
      <DarkBackground $opaque={opaque}>
        <BackgroundLayout $isCol={isCol} gap={gap}>
          {children}
        </BackgroundLayout>
      </DarkBackground>
    </ImgBackground>
  );
}
