import IconButton from '../../Buttons/IconButton/IconButton';
import { Additem } from 'iconsax-reactjs';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import { Edit, Trash } from 'iconsax-reactjs';
import PropTypes from 'prop-types';
import MainButton from '../../Buttons/MainButton/MainButton';
import { useMutation } from '@tanstack/react-query';
import {
  unsubscribeFromPlaylistMutationOptions,
  subscribeToPlaylistMutationOptions,
} from '../../../queries/playlists';

function MobileTracklistPanelPlayButtons({ playlist, setIsAddMenuOpen }) {
  const dispatch = useDispatch();
  const playlistSubscriptionMutation = useMutation(
    playlist?.is_subscribed
      ? unsubscribeFromPlaylistMutationOptions()
      : subscribeToPlaylistMutationOptions()
  );

  const privatePlaylistButtons = [
    {
      id: 1,
      icon: <Edit />,
      onClick: () =>
        dispatch(openModal({ title: `Edit ${playlist?.title}`, actionType: 'edit_playlist' })),
    },
    { id: 2, icon: <Additem />, onClick: () => setIsAddMenuOpen(true) },
    {
      id: 3,
      icon: <Trash />,
      title: 'Delete playlist',
      onClick: () =>
        dispatch(
          openConfirmModal({
            title: `Delete "${playlist?.title}" playlist.`,
            message: 'Are you sure you want to delete this playlist ?',
            buttons: { confirm: true, cancel: true },
            buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
            actionType: 'delete_playlist',
          })
        ),
    },
  ];

  return playlist?.is_public ? (
    <MainButton
      onClick={() => playlistSubscriptionMutation.mutate(playlist.id)}
      size="sm"
      title={playlist.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
      variant="secondary"
      disabled={playlistSubscriptionMutation.isPending}
    />
  ) : (
    privatePlaylistButtons.map((button) => (
      <IconButton key={button.id} classNames="sm:size-9 md:size-10" {...button} />
    ))
  );
}

export default MobileTracklistPanelPlayButtons;

MobileTracklistPanelPlayButtons.propTypes = {
  playlist: PropTypes.object,
  setIsAddMenuOpen: PropTypes.func.isRequired,
};
