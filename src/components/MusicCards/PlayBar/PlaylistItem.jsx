import { getSingleSongByPlaylistIdQueryOptions } from '../../../queries/musics';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import { TickCircle, AddCircle } from 'iconsax-reactjs';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../../queries/playlists';
import PropTypes from 'prop-types';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

function PlaylistItem({ title, cover, id }) {
  const dispatch = useDispatch();
  const songId = useSelector((state) => state.addSongToPlaylist.selectedSongId);
  const { data: isSongInPlaylist, isLoading } = useQuery(
    getSingleSongByPlaylistIdQueryOptions(id, songId)
  );

  const { mutateAsync, isPending } = useMutation({
    ...(isSongInPlaylist
      ? removeSongFromPrivatePlaylistMutationOptions(id)
      : addSongToPrivatePlaylistMutationOptions(id)),
    enabled: !!id && !isLoading,
  });

  const clickHandler = async () => {
    await mutateAsync(songId);
    dispatch(
      showNewSnackbar({
        message: isSongInPlaylist ? 'Song removed from playlist' : 'Song added to playlist',
        type: 'success',
      })
    );
  };

  return (
    <button
      className="flex w-full items-center rounded-md p-1.5 hover:bg-slate-700"
      title={title}
      onClick={clickHandler}
    >
      <div className="flex grow items-center gap-2">
        <img className="size-8 rounded-sm object-cover" src={cover || defaultCover} />
        <span className="text-sm">{title}</span>
      </div>
      {isPending ? (
        <LoadingSpinner size="xs" />
      ) : (
        <div className="size-5">
          {isSongInPlaylist ? (
            <TickCircle className="fill-secondary-400 text-secondary-100" size="100%" />
          ) : (
            <AddCircle size="100%" />
          )}
        </div>
      )}
    </button>
  );
}

PlaylistItem.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  id: PropTypes.string.isRequired,
};

export default PlaylistItem;
