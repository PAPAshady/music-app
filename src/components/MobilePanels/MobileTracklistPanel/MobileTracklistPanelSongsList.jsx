import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../../hooks/useMediaQuery';
import usePlayBar from '../../../hooks/usePlayBar';
import { removeSongFromPrivatePlaylistMutationOptions } from '../../../queries/playlists';
import { useCallback } from 'react';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Trash } from 'iconsax-reactjs';

function MobileTracklistPanelSongsList({
  selectedTracklist,
  tracklistId,
  isSongsPending,
  songs,
  setPendingSongId,
  pendingSongId,
}) {
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const { playTracklist } = usePlayBar();
  const dispatch = useDispatch();
  const isPrivatePlaylist =
    selectedTracklist?.tracklistType === 'playlist' && !selectedTracklist?.is_public;
  const removeSongMutation = useMutation(removeSongFromPrivatePlaylistMutationOptions(tracklistId));
  const isFavorites = selectedTracklist?.tracklistType === 'favorites';

  const removeSongHandler = useCallback(
    async (songId) => {
      try {
        setPendingSongId(songId);
        await removeSongMutation.mutateAsync(songId);
        dispatch(showNewSnackbar({ message: 'Song removed succefully.', type: 'success' }));
      } catch (err) {
        dispatch(
          showNewSnackbar({
            message: 'Error while removing song from playlist. Try again.',
            type: 'error',
          })
        );
        console.error('Error removing song from playlist : ', err);
      } finally {
        setPendingSongId(null);
      }
    },
    [dispatch, removeSongMutation, setPendingSongId]
  );

  return (
    <>
      {isSongsPending ? (
        Array(5)
          .fill()
          .map((_, index) => (
            <PlayBarSkeleton
              key={index}
              size={isLargeMobile ? 'lg' : 'md'}
              classNames="!w-full text-start !max-w-none"
            />
          ))
      ) : !songs?.length ? (
        <div className="my-2 w-full">
          <p className="text-gray-400 md:text-lg">
            No tracks in{' '}
            {isFavorites ? 'your favorites' : `This ${selectedTracklist?.tracklistType}`} yet
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
            {songs?.map((song, index) => (
              <PlayBar
                key={song.id}
                size={isLargeMobile ? 'lg' : 'md'}
                index={index}
                onPlay={playTracklist}
                classNames="!w-full text-start !max-w-none"
                ActionButtonIcon={isPrivatePlaylist && <Trash />}
                actionButtonClickHandler={isPrivatePlaylist ? removeSongHandler : undefined}
                isActionButtonPending={isPrivatePlaylist && pendingSongId === song.id}
                song={song}
              />
            ))}
          </div>
          <p className="mt-2 text-gray-400">
            {songs.length} song{songs.length > 1 && 's'}
          </p>
        </>
      )}
    </>
  );
}

MobileTracklistPanelSongsList.propTypes = {
  selectedTracklist: PropTypes.object,
  tracklistId: PropTypes.string,
  isSongsPending: PropTypes.bool,
  songs: PropTypes.array,
  setPendingSongId: PropTypes.func,
  pendingSongId: PropTypes.string,
};

export default MobileTracklistPanelSongsList;
