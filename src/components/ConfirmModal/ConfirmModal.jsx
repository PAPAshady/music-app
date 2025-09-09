import Modal from '../Modal/Modal';
import { closeModal, setIsOpen } from '../../redux/slices/confirmModalSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { deletePrivatePlaylistMutationOptions } from '../../queries/playlists';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { listFiles, deleteFiles } from '../../services/storage';

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const { isOpen, title, message, buttons, buttonsClassNames, actionType } = useSelector(
    (state) => state.confirmModal
  );
  const selectedTracklist = useSelector((state) => state.playContext.selectedCollection);
  const userId = useSelector((state) => state.auth.user?.id);
  const deletePlaylistMutation = useMutation(
    deletePrivatePlaylistMutationOptions(selectedTracklist.id)
  );

  const onClose = () => {
    // To avoid an unpolished visual effect where the title appears empty
    // during the modal's closing transition, we delay the reset until the transition completes.
    dispatch(setIsOpen(false));
    setTimeout(() => dispatch(closeModal()), 500);
  };

  const onConfirm = async () => {
    if (actionType === 'delete_playlist') {
      const { data: listingData, error: listingError } = await listFiles(
        'playlist-covers',
        userId,
        undefined,
        undefined,
        selectedTracklist.title
      );

      if (listingError) {
        dispatch(
          showNewSnackbar({ message: 'Error removing playlist. Try again.', type: 'error' })
        );
        console.error('Error listing files : ', listingError);
        return;
      }

      if (listingData.length) {
        // remove playlist cover from storage
        const { error: deleteError } = await deleteFiles('playlist-covers', [
          `${userId}/${selectedTracklist.title}.${listingData[0].name.split('.').pop()}`,
        ]);

        if (deleteError) {
          dispatch(
            showNewSnackbar({ message: 'Error removing playlist. Try again.', type: 'error' })
          );
          console.error('Error deleting file : ', deleteError);
          return;
        }
      }

      try {
        await deletePlaylistMutation.mutateAsync();
        dispatch(showNewSnackbar({ message: 'Playlist removed successfully.', type: 'success' }));
      } catch (err) {
        dispatch(
          showNewSnackbar({ message: 'Error removing playlist. Try again.', type: 'error' })
        );
        console.error('Error deleting playlist : ', err);
      }
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
      confirmButtonDisabled={deletePlaylistMutation.isPending}
      isSubmitting={deletePlaylistMutation.isPending}
    >
      <p className="text-secondary-50 mb-2 text-sm min-[480px]:text-base">{message}</p>
    </Modal>
  );
}
