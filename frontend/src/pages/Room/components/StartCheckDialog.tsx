import { SmallText } from '../../../styles/fonts';
import { FlexLayout } from '../../../styles/layout';
import Dialog from '../../../components/Dialog';
import Button from '../../../components/Button';

type StartCheckDialogProps = {
  closeDialog: () => void;
};

export default function StartCheckDialog({
  closeDialog,
}: StartCheckDialogProps) {
  return (
    <Dialog mode={'SHORT'} width='40rem' isOpen onClose={closeDialog}>
      <FlexLayout $isCol gap='1rem'>
        <SmallText color='black'>{`최소 2명 이상인 경우에`}</SmallText>
        <SmallText color='black'>{`게임을 시작할 수 있습니다`}</SmallText>
        <Button
          label={`BACK`}
          onClick={() => {
            window.location.reload();
          }}
        />
      </FlexLayout>
    </Dialog>
  );
}
