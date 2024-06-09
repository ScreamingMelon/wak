import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMention } from '../../../services/game';

import styled from 'styled-components';
import { FlexLayout } from '../../../styles/layout';
import { SmallText, textStyles } from '../../../styles/fonts';

import SpeechImg from '../../../assets/img-speech-bubble.png';

const SpeechBubbleBlock = styled(FlexLayout)`
  width: 38.2rem;
  height: 11.6rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1.8rem;
  background-image: url(${SpeechImg});
  background-repeat: no-repeat;
  align-items: start;
`;

const Text = styled.div`
  ${textStyles}
  line-height: 1.2;
`;

type SpeechBubbleProps = {
  comment: {
    sender: string;
    color: string;
    mention: string;
  };
};

export default function SpeechBubble({ comment }: SpeechBubbleProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const showMention = async () => {
    try {
      id && (await getMention(parseInt(id)));
    } catch (error: any) {
      console.error('도발 멘트 요청 에러', error);
      navigate('/error', { replace: true });
    }
  };

  useEffect(() => {
    showMention();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <SpeechBubbleBlock $isCol gap='1rem'>
      <SmallText color='black'>{`도발 멘트!`}</SmallText>
      <FlexLayout>
        <Text color={comment.color}>{comment.sender}</Text>
        <Text color='black'>
          {comment.mention === ''
            ? `(멘트를 입력하지 않았습니다)`
            : `: ${comment.mention}`}
        </Text>
      </FlexLayout>
    </SpeechBubbleBlock>
  );
}
