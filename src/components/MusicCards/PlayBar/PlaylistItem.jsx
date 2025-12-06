import { getSingleSongByPlaylistIdQueryOptions } from '../../../queries/musics';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import { TickCircle, AddCircle } from 'iconsax-react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../../queries/playlists';
import PropTypes from 'prop-types';
import queryClient from '../../../queryClient';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

function PlaylistItem({ title, cover, id }) {
  const dispatch = useDispatch();
  const songId = useSelector((state) => state.addSongToPlaylist.selectedSongId);
  const { data: isSongInPlaylist, isLoading } = useQuery(
    getSingleSongByPlaylistIdQueryOptions(id, songId)
  );

  const songMutation = useMutation({
    ...(isSongInPlaylist
      ? removeSongFromPrivatePlaylistMutationOptions(id)
      : addSongToPrivatePlaylistMutationOptions(id)),
    enabled: !!id && !isLoading,
    onSuccess: async () => {
      // invalidate getSingleSongByPlaylistIdQueryOptions to update isSongInPlaylist value
      await queryClient.invalidateQueries({ queryKey: ['songs', { playlistId: id, songId }] });
      // show real time update of totaltracks in playlists list
      await queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
      // update the list of songs in the playlist
      await queryClient.invalidateQueries({ queryKey: ['songs', { playlistId: id }] });
      dispatch(
        showNewSnackbar({
          message: isSongInPlaylist ? 'Song removed from playlist' : 'Song added to playlist',
          type: 'success',
        })
      );
    },
  });

  return (
    <button
      className="flex w-full items-center rounded-md p-1.5 hover:bg-slate-700"
      title={title}
      onClick={() => songMutation.mutate(songId)}
    >
      <div className="flex grow items-center gap-2">
        <img className="size-8 rounded-sm object-cover" src={cover || defaultCover} />
        <span className="text-sm">{title}</span>
      </div>
      {songMutation.isPending ? (
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
