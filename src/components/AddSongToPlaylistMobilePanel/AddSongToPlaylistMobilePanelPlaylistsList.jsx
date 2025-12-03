import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { AddCircle, Add, TickCircle } from 'iconsax-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../queries/playlists';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { getSingleSongByPlaylistIdQueryOptions } from '../../queries/musics';
import queryClient from '../../queryClient';
import { openModal as openPlaylistInfosModal } from '../../redux/slices/playlistInfosModalSlice';

function AddSongToPlaylistMobilePanelPlaylistsList({ playlists, isPending }) {
  const dispatch = useDispatch();
  return (
    <div className="mt-3 grow space-y-1 overflow-y-auto px-1 pb-4">
      {isPending ? (
        <div className="grid size-full place-content-center">
          <div className="size-10">
            <LoadingSpinner size="md" />
          </div>
        </div>
      ) : (
        <>
          {playlists.length > 0 ? (
            playlists.map((playlist) => <Playlist key={playlist.id} {...playlist} />)
          ) : (
            <div className="mb-6 space-y-2 pt-3 text-center">
              <p className="text-xl font-bold">No results found</p>
              <p className="text-secondary-100 text-sm">
                Check the spelling, or try different keywords.
              </p>
            </div>
          )}
          <button
            className="flex w-full cursor-pointer items-center rounded-md p-1"
            onClick={() =>
              dispatch(
                openPlaylistInfosModal({
                  title: 'Create new playlist',
                  actionType: 'create_playlist',
                })
              )
            }
          >
            <div className="flex items-center gap-2">
              <div className="grid size-11 place-content-center rounded-md bg-slate-700">
                <Add size={36} />
              </div>
              <div>
                <p className="font-semibold">New playlist</p>
              </div>
            </div>
          </button>
        </>
      )}
    </div>
  );
}

export default AddSongToPlaylistMobilePanelPlaylistsList;

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
      className="flex w-full cursor-pointer items-center rounded-md p-1"
      onClick={() => addSongMutation.mutate(songId)}
      disabled={addSongMutation.isPending}
    >
      <div className="flex grow items-center gap-2">
        <img src={cover || defaultCover} className="size-11 rounded-md object-cover" />
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
        ) : isSongInPlaylist ? (
          <TickCircle className="fill-secondary-400 text-secondary-50" />
        ) : (
          <AddCircle />
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

AddSongToPlaylistMobilePanelPlaylistsList.propTypes = {
  playlists: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};
