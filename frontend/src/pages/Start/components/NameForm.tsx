import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/user';
import useUserStore from '../../../store/userStore';

import styled, { keyframes } from 'styled-components';
import { SmallText } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';
import { motion } from 'framer-motion';

import Input from '../../../components/Input';
import Button from '../../../components/Button';

const BlinkSmallText = styled(SmallText)`
  animation: ${keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
  `} 1s steps(2, jump-none) infinite;
`;

const FormBlock = styled(FlexLayout)`
  position: relative;
`;

const ImgBlock = styled(motion.div)`
  position: absolute;
  top: 0.4rem;
  left: -6rem;
`;

const ExclamationImg = styled.img.attrs({
  src: require('../../../assets/img-exclamation-mark.png'),
  alt: '사용할 수 없는 닉네임',
})`
  width: 5.2rem;
  height: fit-content;
`;

export default function NicknameForm() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState<
    'NO_INPUT' | 'INVALID_LENGTH' | 'DUPLICATED'
  >('NO_INPUT');
  const { userData, setUserData } = useUserStore();

  const handleChange = (e: { target: { value: string } }) => {
    setNickname(e.target.value);
  };

  const handleClick = async () => {
    if (nickname.length === 0) {
      setMessage('NO_INPUT');
    } else if (6 < nickname.length) {
      setMessage('INVALID_LENGTH');
    } else {
      try {
        const fetchedData = await login(nickname);
        setUserData({
          ...userData,
          nickname: nickname,
          color: fetchedData.data.color,
          token: fetchedData.data.token,
        });
        navigate(`/lobby`);
      } catch (error: any) {
        const { message } = error.response.data.error.apierror;
        if (message === 'USER IS ALREADY FOUND') {
          setMessage('DUPLICATED');
        } else {
          console.error('로그인 에러', error);
          navigate('/error', { replace: true });
        }
      }
    }
  };

  return (
    <FlexLayout $isCol gap='1rem'>
      {message === 'NO_INPUT' ? (
        <BlinkSmallText>{`시작하려면 닉네임을 입력하세요`}</BlinkSmallText>
      ) : (
        <SmallText>
          {message === 'INVALID_LENGTH'
            ? `닉네임은 6자 이하로 입력해 주세요`
            : `이미 사용 중인 닉네임이에요 ,_.)o`}
        </SmallText>
      )}
      <FormBlock gap='1rem'>
        {message !== 'NO_INPUT' && (
          <ImgBlock
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 2.5, stiffness: 200 }}
          >
            <ExclamationImg />
          </ImgBlock>
        )}
        <Input isRound name='nickname' width='36rem' onChange={handleChange} />
        <Button isBigger label={`GO!`} onClick={handleClick} />
      </FormBlock>
    </FlexLayout>
  );
}
