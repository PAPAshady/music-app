import Modal from '../Modal/Modal';
import { closeModal, setIsOpen } from '../../redux/slices/confirmModalSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttons, buttonsClassNames, actionType } = useSelector(
    (state) => state.confirmModal
  );

  const onClose = () => {
    // To avoid an unpolished visual effect where the title appears empty
    // during the modal's closing transition, we delay the reset until the transition completes.
    dispatch(setIsOpen(false));
    setTimeout(() => dispatch(closeModal()), 500);
  };

  const onConfirm = () => {
    if (actionType === 'delete_playlist') {
      console.log('Playlist removed successfully.');
      onClose();
    }
  };

  const onCancel = () => {
    if (actionType === 'delete_playlist') {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onCancel}
      title={title}
      confirmButton={buttons.confirm}
      cancelButton={buttons.cancel}
      confirmButtonClassNames={buttonsClassNames.confirm}
      cancelButtonClassNames={buttonsClassNames.cancel}
    >
      <p className="text-secondary-50 mb-2 text-sm min-[480px]:text-base">{message}</p>
    </Modal>
  );
}
