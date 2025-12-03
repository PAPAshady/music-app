import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../queries/playlists';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { getSingleSongByPlaylistIdQueryOptions } from '../../queries/musics';
import queryClient from '../../queryClient';
import { AddCircle, TickCircle } from 'iconsax-react';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';

function Playlist({ cover, title, totaltracks, id }) {
  const dispatch = useDispatch();
  const songId = useSelector((state) => state.addSongToPlaylistMobilePanel.selectedSongId);
  const { data: isSongInPlaylist, isLoading } = useQuery(
    getSingleSongByPlaylistIdQueryOptions(id, songId)
  );
  const addSongMutation = useMutation({
    ...(isSongInPlaylist
      ? removeSongFromPrivatePlaylistMutationOptions(id)
      : addSongToPrivatePlaylistMutationOptions(id)),
    enabled: !!id && !isLoading,
    onSuccess: async () => {
      // invalidate getSingleSongByPlaylistIdQueryOptions to update isSongInPlaylist value
      await queryClient.invalidateQueries({ queryKey: ['songs', { playlistId: id, songId }] });
      // show real time update of totaltracks in playlists list
      await queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
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
      className="flex w-full cursor-pointer items-center rounded-md p-1 min-[560px]:border min-[560px]:border-slate-600 min-[560px]:py-0.5 md:p-1.5"
      onClick={() => addSongMutation.mutate(songId)}
      disabled={addSongMutation.isPending}
    >
      <div className="flex grow items-center gap-2">
        <img src={cover || defaultCover} className="size-11 rounded-sm object-cover md:size-14" />
        <div className="text-start">
          <p className="font-semibold">{title}</p>
          <span className="text-secondary-200 text-sm">
            {totaltracks ? `${totaltracks} song${totaltracks > 1 ? 's' : ''}` : 'Empty'}
          </span>
        </div>
      </div>
      <div>
        {addSongMutation.isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <div className="size-6 md:size-7">
            {isSongInPlaylist ? (
              <TickCircle size="100%" className="fill-secondary-400 text-secondary-50" />
            ) : (
              <AddCircle size="100%" />
            )}
          </div>
        )}
      </div>
    </button>
  );
}

Playlist.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  totaltracks: PropTypes.number,
  id: PropTypes.string,
};
export default Playlist;
