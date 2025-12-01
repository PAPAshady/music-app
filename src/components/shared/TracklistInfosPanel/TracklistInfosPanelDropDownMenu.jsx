import { Heart, HeartSlash, Edit2, Trash, MinusCirlce, AddCircle } from 'iconsax-react';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import DropDownList from '../../DropDownList/DropDownList';
import {
  unlikePlaylistMutationOptions,
  likePlaylistMutationOptions,
  unlikeAlbumMutationOptions,
  likeAlbumMutationOptions,
} from '../../../queries/likes';
import {
  subscribeToPlaylistMutationOptions,
  unsubscribeFromPlaylistMutationOptions,
} from '../../../queries/playlists';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

function TracklistInfosPanelDropDownMenu({ tracklist, tracklistType }) {
  const dispatch = useDispatch();
  const playlistLikeMutation = useMutation(
    tracklist?.is_liked ? unlikePlaylistMutationOptions() : likePlaylistMutationOptions()
  );
  const albumLikeMutation = useMutation(
    tracklist?.is_liked ? unlikeAlbumMutationOptions() : likeAlbumMutationOptions()
  );
  const playlistSubscriptionMutation = useMutation(
    tracklist?.is_subscribed
      ? unsubscribeFromPlaylistMutationOptions()
      : subscribeToPlaylistMutationOptions()
  );
  const likeHandler = () => {
    if (tracklist) {
      const { tracklistType, id } = tracklist;
      if (tracklistType === 'album') {
        albumLikeMutation.mutate(id);
      } else {
        playlistLikeMutation.mutate(id);
      }
    }
  };

  const playlistSubscriptionHandler = () => {
    const isPublicPlaylist =
      tracklist && tracklist.tracklistType === 'playlist' && tracklist.is_public;
    if (isPublicPlaylist) {
      playlistSubscriptionMutation.mutate(tracklist.id);
    }
  };

  const userPlaylistsDropDownItems = [
    {
      id: 1,
      icon: tracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${tracklist?.is_liked ? 'Unlike' : 'Like'} playlist`,
      onClick: likeHandler,
    },
    {
      id: 2,
      icon: <Edit2 />,
      title: 'Edit playlist',
      onClick: () =>
        dispatch(
          openModal({
            title: `Edit ${tracklist?.title}`,
            actionType: 'edit_playlist',
          })
        ),
    },
    {
      id: 3,
      icon: <Trash />,
      title: 'Delete playlist',
      onClick: () =>
        dispatch(
          openConfirmModal({
            title: `Delete "${tracklist?.title}" playlist.`,
            message: 'Are you sure you want to delete this playlist ?',
            buttons: { confirm: true, cancel: true },
            buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
            actionType: 'delete_playlist',
          })
        ),
    },
  ];

  const albumDropDownListItems = [
    {
      id: 1,
      icon: tracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${tracklist?.is_liked ? 'Unlike' : 'Like'} album`,
      onClick: likeHandler,
    },
  ];

  const publicPlaylistsDropDownItems = [
    {
      id: 1,
      icon: tracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${tracklist?.is_liked ? 'Unlike' : 'Like'} playlist`,
      onClick: likeHandler,
    },
    {
      id: 2,
      icon: tracklist?.is_subscribed ? <MinusCirlce /> : <AddCircle />,
      title: `${tracklist?.is_subscribed ? 'Remove from' : 'Add to'} library`,
      onClick: playlistSubscriptionHandler,
    },
  ];

  return (
    <DropDownList
      menuItems={
        tracklistType === 'album'
          ? albumDropDownListItems
          : tracklist?.is_public
            ? publicPlaylistsDropDownItems
            : userPlaylistsDropDownItems
      }
      dropDownPlacement="bottom end"
    />
  );
}

TracklistInfosPanelDropDownMenu.propTypes = {
  tracklist: PropTypes.object,
  tracklistType: PropTypes.string.isRequired,
};

export default TracklistInfosPanelDropDownMenu;
