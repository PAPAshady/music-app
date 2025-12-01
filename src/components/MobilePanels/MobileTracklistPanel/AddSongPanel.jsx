import { useCallback } from 'react';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import useInput from '../../../hooks/useInput';
import useDebounce from '../../../hooks/useDebounce';
import { ArrowLeft, Music } from 'iconsax-react';
import { addSongToPrivatePlaylistMutationOptions } from '../../../queries/playlists';
import {
  getTrendingSongsQueryOptions,
  getSongsByKeywordQueryOptions,
} from '../../../queries/musics';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import PropTypes from 'prop-types';
import SuggestedSong from './SuggestedSong/SuggestedSong';
import SuggestedSongSkeleton from './SuggestedSong/SuggestedSongSkeleton';

function AddSongPanel({ isOpen, setIsOpen, selectedPlaylistSongs, pendingSongId, setPendingSongId }) {
  const dispatch = useDispatch();
  const searchInput = useInput();
  const tracklistId = useSelector((state) => state.queryState.id);
  const searchedValue = searchInput.value.toLowerCase().trim();
  const debouncedSearchValue = useDebounce(searchedValue, 500);
  const { data: searchedSongs, isPending: isSearchedSongsPending } = useQuery(
    getSongsByKeywordQueryOptions(debouncedSearchValue)
  );
  const playlistSongIds = new Set((selectedPlaylistSongs ?? []).map((song) => song.id));
  const { data: trendingSongs, isTrendingSognsPending } = useQuery(getTrendingSongsQueryOptions());
  const suggestedSongs = (trendingSongs ?? []).filter((song) => !playlistSongIds.has(song.id));
  const addSongMutation = useMutation(addSongToPrivatePlaylistMutationOptions(tracklistId));
  const hasData =
    (searchedValue && searchedSongs?.length > 0) || (!searchedValue && trendingSongs?.length > 0);
  const dataIsloading = isTrendingSognsPending || isSearchedSongsPending;

  const addSongHandler = useCallback(
    async (songId) => {
      const isAlreadyAdded = selectedPlaylistSongs.some((song) => song.id === songId);

      if (isAlreadyAdded) {
        dispatch(
          showNewSnackbar({
            message: 'This song already exists in your playlist.',
            type: 'warning',
          })
        );
        return;
      }

      try {
        setPendingSongId(songId);
        await addSongMutation.mutateAsync(songId);
        dispatch(showNewSnackbar({ message: 'Song added succefully. Enjoy!', type: 'success' }));
      } catch (err) {
        dispatch(
          showNewSnackbar({ message: 'Error while adding new song to playlist. Try again.' })
        );
        console.error('Error adding new song to playlist : ', err);
      } finally {
        setPendingSongId(null);
      }
    },
    [dispatch, selectedPlaylistSongs, addSongMutation, setPendingSongId]
  );

  return (
    <div
      className={`text-secondary-50 bg-primary-800 fixed inset-0 z-[10] size-full pb-4 text-start transition-all duration-300 ${isOpen ? 'tranlate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div className="container flex h-full flex-col gap-4">
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => setIsOpen(false)}>
            <ArrowLeft size={28} />
          </button>
          <p className="font-semibold sm:text-lg">Add to this playlist</p>
        </div>
        <div>
          <SearchInput {...searchInput} />
        </div>
        <div className="bg-primary-700 flex grow flex-col gap-5 overflow-y-scroll rounded-md pb-16 min-[400px]:pb-20 min-[480px]:gap-7 sm:pb-24 md:pb-26">
          {hasData || dataIsloading ? (
            <>
              <div className="px-4 pt-4 min-[480px]:px-6 min-[480px]:pt-6">
                <p className="text-xl font-semibold text-white min-[480px]:text-2xl">
                  {searchedValue ? `Results for "${searchedValue}"` : 'Suggested'}
                </p>
                {!searchedValue && (
                  <p className="mt-1 text-sm min-[480px]:mt-3 min-[480px]:text-lg">
                    See what&apos;s trending
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 px-3 pb-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-4">
                {searchedValue
                  ? isSearchedSongsPending
                    ? Array(6)
                        .fill()
                        .map((_, index) => <SuggestedSongSkeleton key={index} />)
                    : searchedSongs.map((song) => (
                        <SuggestedSong
                          key={song.id}
                          isPending={song.id === pendingSongId}
                          onAdd={addSongHandler}
                          song={song}
                        />
                      ))
                  : isTrendingSognsPending
                    ? Array(6)
                        .fill()
                        .map((_, index) => <SuggestedSongSkeleton key={index} />)
                    : suggestedSongs
                        .filter((song) => song.title.toLowerCase().includes(searchedValue))
                        .map((song) => (
                          <SuggestedSong
                            key={song.id}
                            isPending={song.id === pendingSongId}
                            onAdd={addSongHandler}
                            song={song}
                          />
                        ))}
              </div>
            </>
          ) : (
            <div className="size-full p-4">
              <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed p-2 text-center">
                <Music size={64} className="text-secondary-300" />
                <p className="mt-2 px-4 font-semibold text-white">
                  No songs found matching that keyword.
                </p>
                <p className="text-sm">Try something else</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AddSongPanel.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  pendingSongId: PropTypes.string,
  setPendingSongId: PropTypes.func,
  selectedPlaylistSongs: PropTypes.array,
};

export default AddSongPanel;
