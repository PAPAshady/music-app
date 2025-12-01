import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import { useCallback, useState } from 'react';
import { Music } from 'iconsax-react';
import { getTrendingSongsQueryOptions, getSongsByKeywordQueryOptions } from '../../queries/musics';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../queries/playlists';
import useDebounce from '../../hooks/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import PlaylistSong from './PlaylistSong/PlaylistSong';
import PlaylistSongSkeleton from './PlaylistSong/PlaylistSongSkeleton';
import TabButton from './TabButton';
import PropTypes from 'prop-types';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { useDispatch } from 'react-redux';

function PlaylistInfosModalSongsList({ tracklist, tracklistSongs }) {
  const dispatch = useDispatch();
  const searchInput = useInput();
  const [selectedTab, setSelectedTab] = useState('view'); // could be one of the following:  [add, view]
  const searchValue = searchInput.value.toLowerCase().trim();

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { mutateAsync: addSongToPlaylist } = useMutation(
    addSongToPrivatePlaylistMutationOptions(tracklist?.id)
  );
  const { mutateAsync: removeSongFromPlaylist } = useMutation(
    removeSongFromPrivatePlaylistMutationOptions(tracklist?.id)
  );
  const { data: trendingSongs, isLoading: isTrendingSongsLoading } = useQuery(
    getTrendingSongsQueryOptions()
  );
  const { data: searchedSongs, isLoading: isSearchedSongsLoading } = useQuery(
    getSongsByKeywordQueryOptions(debouncedSearchValue)
  );
  const [pendingSongId, setPendingSongId] = useState(null); // tracks which song is in loading state (while adding or removing song from playlist)
  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const playlistSongIds = new Set((tracklistSongs ?? []).map((song) => song.id));
  const suggestedSongs = trendingSongs?.filter((song) => !playlistSongIds.has(song.id));
  const addTabContent = (debouncedSearchValue ? searchedSongs : suggestedSongs) || []; // songs to render in the add tab
  const viewTabContent =
    tracklistSongs?.filter((song) => song.title.toLowerCase().includes(searchValue)) || []; // songs to render in the view tab
  const addTabContentPending = isTrendingSongsLoading || isSearchedSongsLoading;
  const numberOfSongsToRender = (selectedTab === 'add' ? addTabContent : viewTabContent).length;
  
  const addSongHandler = useCallback(
    async (songId) => {
      const isAlreadyAdded = tracklistSongs.some((song) => song.id === songId);

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
        await addSongToPlaylist(songId);
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
    [addSongToPlaylist, dispatch, tracklistSongs]
  );

  const removeSongHandler = useCallback(
    async (songId) => {
      try {
        setPendingSongId(songId);
        await removeSongFromPlaylist(songId);
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
    [dispatch, removeSongFromPlaylist]
  );

  const changeTabHandler = (tabName) => {
    searchInput.reset();
    setSelectedTab(tabName);
  };

  const tabButtons = [
    { id: 1, title: 'View Songs', tabName: 'view' },
    { id: 2, title: 'Add Songs', tabName: 'add' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="border-secondary-500 container flex items-center justify-center gap-2 border-b">
        {tabButtons.map((button) => (
          <TabButton
            key={button.id}
            isActive={button.title.toLowerCase().includes(selectedTab)}
            onClick={changeTabHandler}
            {...button}
          />
        ))}
      </div>
      <SearchInput {...searchInput} />
      <div className="text-secondary-50">
        {!!numberOfSongsToRender && (
          <p className="mb-4 font-semibold">
            {selectedTab === 'add'
              ? 'Recommended songs to add.'
              : `You have ${tracklistSongs.length} song${numberOfSongsToRender > 1 ? 's' : ''} in this playlist`}
          </p>
        )}

        <div className="dir-rtl max-h-[260px] min-h-[100px] overflow-y-auto pe-2">
          {addTabContentPending || numberOfSongsToRender ? (
            <div className="dir-ltr grid grid-cols-1 gap-3 min-[580px]:grid-cols-2">
              {/* if user is on add tab, show trending/searched songs or their loading state.  */}
              {selectedTab === 'add' &&
                (addTabContentPending
                  ? Array(6)
                      .fill()
                      .map((_, index) => <PlaylistSongSkeleton key={index} />)
                  : addTabContent.map((song) => (
                      // if search value exists, we know that user is trying to search for a song, so we must show the search result instead of the trending songs
                      <PlaylistSong
                        key={song.id}
                        buttonState={song.id === pendingSongId ? 'pending' : selectedTab}
                        onClick={selectedTab === 'add' ? addSongHandler : removeSongHandler}
                        song={song}
                      />
                    )))}

              {selectedTab === 'view' &&
                viewTabContent.map((song) => (
                  <PlaylistSong
                    key={song.id}
                    buttonState={song.id === pendingSongId ? 'pending' : selectedTab}
                    onClick={selectedTab === 'add' ? addSongHandler : removeSongHandler}
                    song={song}
                  />
                ))}
            </div>
          ) : (
            <div className="dir-ltr flex h-[200px] flex-col items-center justify-center gap-3 rounded-md border border-dashed px-8 text-center">
              <Music size={62} />
              <p className="text-xl font-semibold">
                {searchValue.length ? 'No songs found' : 'This playlist is empty :('}
              </p>
              <p className="text-sm">
                {searchValue.length
                  ? "Oops! Couldn't find any songs with that keyword. Try searching for something else."
                  : 'Switch to "Add Songs" tab and start searching for your tunes!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PlaylistInfosModalSongsList.propTypes = {
  tracklistSongs: PropTypes.array,
  tracklist: PropTypes.object,
};

export default PlaylistInfosModalSongsList;
