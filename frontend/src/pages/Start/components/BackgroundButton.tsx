import styled from 'styled-components';
import Button from '../../../components/Button';
import useBackgroundStore from '../../../store/backgroundStore';

const ButtonBlock = styled.div`
  white-space: pre-line;
  position: fixed;
  top: 4rem;
  right: 4rem;
  display: flex;
  gap: 1rem;
`;

export default function BackgroundButton() {
  const BACKGROUND_IMGS_NUMBER = 8;
  const { imgNumberData, setImgNumberData } = useBackgroundStore();

  const handleLeftClick = () => {
    const newNumber =
      imgNumberData > 0 ? imgNumberData - 1 : BACKGROUND_IMGS_NUMBER - 1;
    setImgNumberData(newNumber);
  };

  const handleRightClick = () => {
    const newNumber =
      imgNumberData < BACKGROUND_IMGS_NUMBER - 1 ? imgNumberData + 1 : 0;
    setImgNumberData(newNumber);
  };

  return (
    <ButtonBlock>
      <Button label={`◀`} onClick={handleLeftClick} />
      <Button label={`▶`} onClick={handleRightClick} />
    </ButtonBlock>
  );
}
