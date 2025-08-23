import { createPortal } from 'react-dom';
import { memo, useCallback } from 'react';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import MainButton from '../../Buttons/MainButton/MainButton';
import {
  ArrowLeft,
  Play,
  Pause,
  Shuffle,
  Additem,
  Edit,
  RepeateOne,
  RepeateMusic,
  AddCircle,
  Trash,
  Heart,
} from 'iconsax-react';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import IconButton from '../../Buttons/IconButton/IconButton';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../../hooks/useMediaQuery';
import Player from '../Player/Player';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import useInput from '../../../hooks/useInput';
import DropDownList from '../../DropDownList/DropDownList';
import { useDispatch, useSelector } from 'react-redux';
import { closeMobilePlaylist } from '../../../redux/slices/mobilePlaylistSlice';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { setIsMobilePlaylistOpen } from '../../../redux/slices/mobilePlaylistSlice';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import {
  togglePlayState,
  setPlaylist,
  setCurrentSongIndex,
  play,
  pause,
} from '../../../redux/slices/musicPlayerSlice';
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
  getSongsByPlaylistIdQueryOptions,
  getSongsByAlbumIdQueryOptions,
  getAllSongsInfiniteQueryOptions,
} from '../../../queries/musics';
import {
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../../queries/playlists';
import PropTypes from 'prop-types';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

export default function MobilePlaylist() {
  const { isOpen: isMobilePlaylistOpen } = useSelector((state) => state.mobilePlaylist);
  const dispatch = useDispatch();
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [pendingSongId, setPendingSongId] = useState(null);
  const searchInput = useInput();
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const selectedPlaylist = useSelector((state) => state.musicPlayer.selectedPlaylist);
  const playlist = useSelector((state) => state.musicPlayer.playlist);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const playlistCover = selectedPlaylist.cover ? selectedPlaylist.cover : playlistDefaultCover;
  const { data: selectedPlaylistSongs, isLoading: isPlaylistSongsLoading } = useQuery(
    selectedPlaylist.tracklistType === 'playlist'
      ? getSongsByPlaylistIdQueryOptions(selectedPlaylist.id)
      : getSongsByAlbumIdQueryOptions(selectedPlaylist.id)
  );
  const addSongMutation = useMutation(addSongToPrivatePlaylistMutationOptions(selectedPlaylist.id));
  const removeSongMutation = useMutation(
    removeSongFromPrivatePlaylistMutationOptions(selectedPlaylist.id)
  );
  const {
    data: allSongs,
    isLoading: isAllSongsLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery(getAllSongsInfiniteQueryOptions({ limit: 6 }));
  const { targetRef } = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && allSongs?.pages?.length > 1) {
        fetchNextPage();
      }
    },
  });

  const searchedValue = searchInput.value.toLowerCase().trim();
  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const playlistSongIds = new Set((selectedPlaylistSongs ?? []).map((song) => song.id));
  const suggestedSongs = (allSongs?.pages?.flat() ?? []).filter(
    (song) => !playlistSongIds.has(song.id)
  );

  // remove scrollbar for the body when mobile playlist is open
  useEffect(() => {
    if (isMobilePlaylistOpen) {
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');

      // Ensure the add menu is closed when the MobilePlaylist is dismissed.
      // This prevents the add menu from remaining open the next time the playlist is opened.
      setIsAddMenuOpen(false);
    };
  }, [isMobilePlaylistOpen]);

  // if user clicks on back button of their device, mobilePlaylist will close
  useEffect(() => {
    const handlePopState = () => {
      if (isMobilePlaylistOpen) {
        dispatch(setIsMobilePlaylistOpen(false));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch, isMobilePlaylistOpen]);

  const handleScroll = (e) => {
    if (e.target.scrollTop <= 30) {
      setIsTopbarVisible(false);
    } else {
      setIsTopbarVisible(true);
    }
  };

  const playPauseButtonHandler = () => {
    if (playlist.id !== selectedPlaylist.id) {
      dispatch(setPlaylist(selectedPlaylist));
      dispatch(setCurrentSongIndex(0));
    } else {
      dispatch(isPlaying ? pause() : play());
    }
  };

  const playButtons = [
    {
      id: 1,
      icon: <Edit />,
      onClick: () =>
        dispatch(
          openModal({ title: `Edit ${selectedPlaylist.title}`, actionType: 'edit_playlist' })
        ),
    },
    { id: 2, icon: <Additem />, onClick: () => setIsAddMenuOpen(true) },
  ];

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

  const playlistDropDownListItems = [
    {
      id: 1,
      icon: <Edit />,
      title: 'Edit playlist',
    },
    {
      id: 2,
      icon: <Trash />,
      title: 'Delete playlist',
    },
  ];

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-10 min-h-[100dvh] w-full overflow-hidden transition-all duration-300 ${isMobilePlaylistOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-15 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 relative container mx-auto h-[100dvh] overflow-y-auto py-12 min-[360px]:px-3 md:pb-4"
        onScroll={handleScroll}
      >
        <div
          className={`fixed top-0 left-0 z-[1] flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3 sm:gap-6 sm:px-2 sm:py-1">
            <button className="size-6 sm:size-8" onClick={() => dispatch(closeMobilePlaylist())}>
              <ArrowLeft size="100%" />
            </button>
            <p
              className={`transition-opacity duration-300 lg:text-xl ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {selectedPlaylist.title}
            </p>
          </div>
        </div>
        <div className="flex min-h-full flex-col items-center justify-center gap-4 py-10 text-center min-[360px]:pb-12 min-[400px]:pb-16 sm:gap-5 sm:pb-22 md:pb-0 lg:gap-7">
          <img
            src={playlistCover}
            className="size-46 rounded-md object-cover sm:size-56 md:size-64 lg:size-80"
            alt={selectedPlaylist.title}
          />
          <p className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {selectedPlaylist.title}
          </p>
          <p className="line-clamp-2 min-h-[45px] w-[90%] text-sm sm:text-base lg:text-lg">
            {selectedPlaylist.description || 'No Description for this playlist.'}
          </p>
          <div className="mt-3 flex w-full items-center justify-between gap-2 lg:px-8">
            <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
              <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px] sm:h-12 sm:w-9">
                <img
                  src={selectedPlaylist.cover ?? playlistDefaultCover}
                  className="size-full rounded-sm object-cover"
                />
              </button>
              {!selectedPlaylist.is_public &&
                playButtons.map((button) => (
                  <IconButton key={button.id} classNames="sm:size-9 md:size-10" {...button} />
                ))}
              <DropDownList
                menuItems={playlistDropDownListItems}
                dropDownPlacement="bottom start"
              />
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
                  isPlaying ? (
                    <Pause size={isTablet ? 32 : 24} />
                  ) : (
                    <Play size={isTablet ? 32 : 24} />
                  )
                }
                onClick={playPauseButtonHandler}
              />
            </div>
          </div>
          {isPlaylistSongsLoading ? (
            'Loading...'
          ) : !selectedPlaylistSongs?.length ? (
            <div className="my-2 w-full">
              <p className="text-gray-400">
                No tracks in this {selectedPlaylist.tracklistType} yet
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
                {selectedPlaylistSongs?.map((song) => (
                  <PlayBar
                    key={song.id}
                    size={isLargeMobile ? 'lg' : 'md'}
                    classNames="!w-full text-start !max-w-none"
                    ActionButtonIcon={selectedPlaylist.is_public ? <Heart /> : <Trash />}
                    actionButtonClickHandler={
                      selectedPlaylist.tracklistType === 'playlist' && removeSongHandler
                    }
                    isActionButtonPending={pendingSongId === song.id}
                    {...song}
                  />
                ))}
              </div>
              <p className="mt-2 text-gray-400">
                {selectedPlaylistSongs.length} song{selectedPlaylistSongs.length > 1 && 's'}
              </p>
            </>
          )}

          {!selectedPlaylist.is_public && (
            <>
              <div className="mt-6 mb-4 w-full text-start">
                <p className="mb-4 text-xl font-bold">Suggestions</p>
                <div className="grid grid-cols-1 gap-4 px-3 pb-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-4">
                  {suggestedSongs.map((song) => (
                    <SuggestedSong
                      key={song.id}
                      isPending={song.id === pendingSongId}
                      onAdd={addSongHandler}
                      {...song}
                    />
                  ))}
                </div>
              </div>
              <div>
                {allSongs?.pages?.length === 1 && (
                  <MainButton
                    size="md"
                    title={isFetchingNextPage ? 'Please wait...' : 'Load more'}
                    disabled={isFetchingNextPage}
                    onClick={fetchNextPage}
                  />
                )}
                <span className="block" ref={targetRef}>
                  {isFetchingNextPage && 'Loading new data...'}
                </span>
              </div>
            </>
          )}

          {/*
              conditionally rendering the <Player> component based on `isMobilePlaylistOpen` improves performance by preventing unnecessary re-renders when MobilePlaylist is closed and is not visible by user.
            */}
          {isMobilePlaylistOpen && <Player classNames="text-start !w-full" />}
        </div>
      </div>
      {isMobilePlaylistOpen && !selectedPlaylist.is_public && (
        <div
          className={`text-secondary-50 bg-primary-800 absolute inset-0 z-[10] size-full pb-4 transition-all duration-300 ${isAddMenuOpen ? 'tranlate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
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
            <div className="bg-primary-700 flex grow flex-col gap-5 overflow-y-scroll rounded-md min-[480px]:gap-7">
              <div className="px-4 pt-4 min-[480px]:px-6 min-[480px]:pt-6">
                <p className="text-xl font-semibold text-white min-[480px]:text-2xl">Suggested</p>
                <p className="mt-1 text-sm min-[480px]:mt-3 min-[480px]:text-lg">
                  Based on tracks you&apos;ve added.
                </p>
              </div>
              {isAllSongsLoading ? (
                'Loading...'
              ) : (
                <div className="grid grid-cols-1 gap-4 px-3 pb-4 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-x-4">
                  {suggestedSongs
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>,
    document.getElementById('mobilePlaylist')
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

SuggestedSong.displayName = 'SuggestedSong';
SuggestedSong.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.array,
  isPending: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
};
