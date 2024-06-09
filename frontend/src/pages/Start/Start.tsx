import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

import { FlexLayout } from '../../styles/layout';
import Background from '../../components/Background';
import StartTitle from './components/StartTitle';
import NameForm from './components/NameForm';
import StartFooter from './components/StartFooter';
import BackgroundButton from './components/BackgroundButton';

export default function StartPage() {
  const navigate = useNavigate();
  const { token } = useUserStore().userData;

  useEffect(() => {
    if (token) {
      navigate('/lobby', { replace: true });
    }
  }, [token, navigate]);

  return (
    <Background isCol opaque={0.32}>
      <FlexLayout $isCol gap='10rem'>
        <StartTitle />
        <NameForm />
      </FlexLayout>
      <StartFooter />
      <BackgroundButton />
    </Background>
  );
}
