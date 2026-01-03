import Modal from '../Modal/Modal';
import { closeModal, setIsOpen } from '../../redux/slices/confirmModalSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { deletePrivatePlaylistMutationOptions } from '../../queries/playlists';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { deletePlaylistCover, removeUserAvatar } from '../../services/storage';
import { useState } from 'react';
import { updateUserAvatar } from '../../redux/slices/authSlice';
import supabase from '../../services/supabaseClient';

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttons, buttonsClassNames, actionType } = useSelector(
    (state) => state.confirmModal
  );
  const selectedTracklist = useSelector((state) => state.playContext.selectedCollection);
  // const userId = useSelector((state) => state.auth.user?.id);
  const deletePlaylistMutation = useMutation(
    deletePrivatePlaylistMutationOptions(selectedTracklist.id)
  );
  const [isPending, setIsPending] = useState(false);

  const onClose = () => {
    // To avoid an unpolished visual effect where the title appears empty
    // during the modal's closing transition, we delay the reset until the transition completes.
    dispatch(setIsOpen(false));
    setTimeout(() => dispatch(closeModal()), 500);
  };

  const onConfirm = async () => {
    setIsPending(true);
    if (actionType === 'delete_playlist') {
      try {
        await deletePlaylistCover(selectedTracklist.title);
        await deletePlaylistMutation.mutateAsync(undefined, { onSuccess: onClose });
      } catch (err) {
        dispatch(
          showNewSnackbar({ message: 'Error removing playlist. Try again.', type: 'error' })
        );
        console.error('Error deleting playlist : ', err);
      }
    } else if (actionType === 'remove_user_avatar') {
      try {
        await removeUserAvatar(); // delete user avatar from storage
        const { error } = await supabase.auth.updateUser({
          data: { avatar_overridden: true, user_avatar: null },
        });
        if (error) throw error;
        dispatch(updateUserAvatar()); // updates user avatar in redux
        dispatch(showNewSnackbar({ message: 'Avatar removed successfully.', type: 'success' }));
        onClose();
      } catch (err) {
        dispatch(showNewSnackbar({ message: 'Error removing avatar. Try again.', type: 'error' }));
        console.error('Error deleting avatar : ', err);
      }
    }
    setIsPending(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onClose}
      title={title}
      confirmButton={buttons.confirm}
      cancelButton={buttons.cancel}
      confirmButtonClassNames={buttonsClassNames.confirm}
      cancelButtonClassNames={buttonsClassNames.cancel}
      confirmButtonDisabled={isPending}
      isSubmitting={isPending}
    >
      <p className="text-secondary-50 mb-2 text-sm min-[480px]:text-base">{message}</p>
    </Modal>
  );
}
