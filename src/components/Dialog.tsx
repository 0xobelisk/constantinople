import { Dialog } from '../state';
import { useAtom } from 'jotai';

export default function DialogModal(props: any) {
  const [dialog, setDialog] = useAtom(Dialog);

  const closeNoDialog = () => {
    if (dialog.onNo !== undefined) {
      dialog.onNo();
    }
    setDialog({ ...dialog, display: false });
  };

  const closeYesDialog = () => {
    if (dialog.onYes !== undefined) {
      dialog.onYes();
    }
    setDialog({ ...dialog, display: false });
  };

  return (
    <div className="dialog" hidden={!dialog.display}>
      <div className="dialog-content" dangerouslySetInnerHTML={{ __html: dialog.content }}></div>
      <div className="dialog-actions">
        <div
          className="dialog-action-no"
          hidden={dialog.noContent === '' || dialog.noContent === undefined}
          onClick={closeNoDialog}
        >
          {dialog.noContent}
        </div>
        <div
          className="dialog-action-yes"
          hidden={dialog.yesContent === '' || dialog.yesContent === undefined}
          onClick={closeYesDialog}
        >
          {dialog.yesContent}
        </div>
      </div>
    </div>
  );
}
