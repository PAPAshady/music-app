import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import PropTypes from 'prop-types';
import IconButton from '../../Buttons/IconButton/IconButton';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import MainButton from '../../Buttons/MainButton/MainButton';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import useInput from '../../../hooks/useInput';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import { useCallback, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import { setCurrentSongIndex, play, pause } from '../../../redux/slices/musicPlayerSlice';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';
import DropDownList from '../../DropDownList/DropDownList';
import { togglePlayState } from '../../../redux/slices/musicPlayerSlice';
import { getFavoriteSongsQueryOptions } from '../../../queries/musics';
import useDebounce from '../../../hooks/useDebounce';
import {
  Trash,
  ArrowLeft,
  Play,
  AddCircle,
  Edit,
  Additem,
  Pause,
  Shuffle,
  RepeateOne,
  RepeateMusic,
  Music,
} from 'iconsax-react';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../../queries/playlists';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getTrendingSongsQueryOptions,
  getSongsByKeywordQueryOptions,
} from '../../../queries/musics';
import usePlayBar from '../../../hooks/usePlayBar';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import { getPlaylistByIdQueryOptions } from '../../../queries/playlists';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';

function MobileTracklistPanel() {
  const tracklistType = useSelector((state) => state.queryState.type);
  const tracklistId = useSelector((state) => state.queryState.id);
  const searchInput = useInput();
  const dispatch = useDispatch();
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const [pendingSongId, setPendingSongId] = useState(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const { data } = useQuery(
    tracklistType === 'album'
      ? getAlbumByIdQueryOptions(tracklistId)
      : getPlaylistByIdQueryOptions(tracklistId)
  );
  const isMobilePanelOpen = useSelector((state) => state.mobilePanel.isMobilePanelOpen);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const { data: trendingSongs, isTrendingSognsPending } = useQuery(getTrendingSongsQueryOptions());
  const { data: selectedPlaylistSongs, isLoading: isPlaylistSongsLoading } = useQuery(
    tracklistType === 'playlist'
      ? getSongsByPlaylistIdQueryOptions(tracklistId)
      : tracklistType === 'album'
        ? getSongsByAlbumIdQueryOptions(tracklistId)
        : getFavoriteSongsQueryOptions()
  );
  const addSongMutation = useMutation(addSongToPrivatePlaylistMutationOptions(tracklistId));
  const removeSongMutation = useMutation(removeSongFromPrivatePlaylistMutationOptions(tracklistId));
  const searchedValue = searchInput.value.toLowerCase().trim();
  const debouncedSearchValue = useDebounce(searchedValue, 500);
  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const playlistSongIds = new Set((selectedPlaylistSongs ?? []).map((song) => song.id));
  const suggestedSongs = (trendingSongs ?? []).filter((song) => !playlistSongIds.has(song.id));
  const { playTracklist } = usePlayBar();
  const { data: searchedSongs, isPending: isSearchedSongsPending } = useQuery(
    getSongsByKeywordQueryOptions(debouncedSearchValue)
  );
  const hasData =
    (searchedValue && searchedSongs?.length > 0) || (!searchedValue && trendingSongs?.length > 0);
  const dataIsloading = isTrendingSognsPending || isSearchedSongsPending;
  const selectedTracklist = tracklistType === 'favorites' ? favoriteSongsInfos : data;
  const isFavorites = selectedTracklist?.tracklistType === 'favorites';
  const isPrivatePlaylist =
    selectedTracklist?.tracklistType === 'playlist' && !selectedTracklist?.is_public;
  const showAddPanel =
    isMobilePanelOpen &&
    !selectedTracklist?.is_public &&
    selectedTracklist?.tracklistType !== 'favorites';
  const showPlayButtons =
    !selectedTracklist?.is_public && selectedTracklist?.tracklistType !== 'album' && !isFavorites;

  const playPauseButtonHandler = () => {
    if (playingTracklist.id !== selectedTracklist?.id) {
      dispatch(setCurrentCollection(selectedTracklist));
      dispatch(setCurrentSongIndex(0));
    } else {
      dispatch(isPlaying ? pause() : play());
    }
  };

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
    [dispatch, selectedPlaylistSongs, addSongMutation]
  );

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
    [dispatch, removeSongMutation]
  );

  const playButtons = [
    {
      id: 1,
      icon: <Edit />,
      onClick: () =>
        dispatch(
          openModal({ title: `Edit ${selectedTracklist?.title}`, actionType: 'edit_playlist' })
        ),
    },
    { id: 2, icon: <Additem />, onClick: () => setIsAddMenuOpen(true) },
  ];

  const playlistDropDownListItems = [
    {
      id: 1,
      icon: <Edit />,
      title: 'Edit playlist',
      onClick: () =>
        dispatch(
          openModal({ title: `Edit ${selectedTracklist?.title}`, actionType: 'edit_playlist' })
        ),
    },
    {
      id: 2,
      icon: <Trash />,
      title: 'Delete playlist',
      onClick: () =>
        dispatch(
          openConfirmModal({
            title: `Delete "${selectedTracklist?.title}" playlist.`,
            message: 'Are you sure you want to delete this playlist ?',
            buttons: { confirm: true, cancel: true },
            buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
            actionType: 'delete_playlist',
          })
        ),
    },
  ];

  return (
    <>
      {/* Playback buttons */}
      <div className="mt-3 flex w-full items-center justify-between gap-2 lg:px-8">
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px] sm:h-12 sm:w-9">
            <img
              src={selectedTracklist?.cover ?? playlistDefaultCover}
              className="size-full rounded-sm object-cover"
            />
          </button>
          {showPlayButtons && (
            <>
              {playButtons.map((button) => (
                <IconButton key={button.id} classNames="sm:size-9 md:size-10" {...button} />
              ))}
              <DropDownList
                menuItems={playlistDropDownListItems}
                dropDownPlacement="bottom start"
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <IconButton
            icon={
              playingState === 'shuffle' ? (
                <Shuffle />
              ) : playingState === 'repeat_one' ? (
                <RepeateOne />
              ) : (
                <RepeateMusic />
              )
            }
            classNames="sm:size-9 md:size-10"
            onClick={() => dispatch(togglePlayState())}
          />
          <MainButton
            classNames="size-12 sm:size-14 md:size-20 !rounded-full flex justify-center items-center"
            title={
              isPlaying && playingTracklist.id === selectedTracklist?.id ? (
                <Pause size={isTablet ? 32 : 24} />
              ) : (
                <Play size={isTablet ? 32 : 24} />
              )
            }
            onClick={playPauseButtonHandler}
            disabled={!selectedPlaylistSongs?.length}
          />
        </div>
      </div>

      {isPlaylistSongsLoading ? (
        Array(5)
          .fill()
          .map((_, index) => (
            <PlayBarSkeleton
              key={index}
              size={isLargeMobile ? 'lg' : 'md'}
              classNames="!w-full text-start !max-w-none"
            />
          ))
      ) : !selectedPlaylistSongs?.length ? (
        <div className="my-2 w-full">
          <p className="text-gray-400 md:text-lg">
            No tracks in {isFavorites ? 'your favorites' : `This ${selectedTracklist?.title}`} yet
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
            {selectedPlaylistSongs?.map((song, index) => (
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
            {selectedPlaylistSongs.length} song{selectedPlaylistSongs.length > 1 && 's'}
          </p>
        </>
      )}

      {showAddPanel && (
        <div
          className={`text-secondary-50 bg-primary-800 fixed inset-0 z-[10] size-full pb-4 text-start transition-all duration-300 ${isAddMenuOpen ? 'tranlate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <div className="container flex h-full flex-col gap-4">
            <div className="flex items-center justify-between pt-4">
              <button onClick={() => setIsAddMenuOpen(false)}>
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
                      Suggested
                    </p>
                    <p className="mt-1 text-sm min-[480px]:mt-3 min-[480px]:text-lg">
                      See what&apos;s trending
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 px-3 pb-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-4">
                    {searchedValue
                      ? isSearchedSongsPending
                        ? Array(6)
                            .fill()
                            .map((_, index) => <SuggestedSongSkeleton key={index} />)
                        : searchedSongs
                            .filter((song) => !playlistSongIds.has(song.id))
                            .map((song) => (
                              <SuggestedSong
                                key={song.id}
                                isPending={song.id === pendingSongId}
                                onAdd={addSongHandler}
                                {...song}
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
                                {...song}
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
      )}
    </>
  );
}

const SuggestedSong = memo(({ id, title, cover, artist = 'Unknown artist', isPending, onAdd }) => {
  return (
    <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm md:border">
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="relative h-15 w-15 min-w-[60px] overflow-hidden rounded-sm sm:h-[70px] sm:w-[70px] sm:min-w-[70px]">
          <img
            src={cover ? cover : playlistDefaultCover}
            alt={title}
            className="size-full object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Play className="fill-white" />
          </button>
        </div>
        <div className="flex grow flex-col gap-1.5 overflow-hidden">
          <p className="truncate text-[0.9rem] min-[480px]:text-base" title={title}>
            {title}
          </p>
          <p className="text-secondary-200 truncate text-xs min-[480px]:text-sm" title={artist}>
            {artist}
          </p>
        </div>
      </div>
      {isPending ? (
        <LoadingSpinner classNames="me-0.5" />
      ) : (
        <IconButton
          icon={<AddCircle />}
          classNames="min-w-8.5 min-h-8.5 sm:min-w-10 sm:min-h-10 md:me-1"
          onClick={() => onAdd(id)}
        />
      )}
    </div>
  );
});

const SuggestedSongSkeleton = () => {
  return (
    <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-sm bg-gray-600/60">
      <ShimmerOverlay />
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="relative h-15 w-15 min-w-[60px] overflow-hidden rounded-sm sm:h-[70px] sm:w-[70px] sm:min-w-[70px]">
          <div className="size-full bg-gray-800/50"></div>
        </div>
        <div className="flex grow flex-col gap-1.5 overflow-hidden p-1">
          <p className="h-3 w-3/4 rounded-full bg-gray-800/50 sm:w-1/2"></p>
          <p className="h-3 w-1/2 rounded-full bg-gray-800/50 sm:w-1/3"></p>
        </div>
      </div>

      <div className="me-2 min-h-8.5 min-w-8.5 rounded-md bg-gray-800/60 sm:min-h-10 sm:min-w-10"></div>
    </div>
  );
};

SuggestedSong.displayName = 'SuggestedSong';
SuggestedSong.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.string,
  isPending: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
};

export default MobileTracklistPanel;
