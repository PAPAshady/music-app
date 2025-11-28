import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import IconButton from '../../Buttons/IconButton/IconButton';
import MainButton from '../../Buttons/MainButton/MainButton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import { setCurrentSongIndex, play, pause } from '../../../redux/slices/musicPlayerSlice';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';
import DropDownList from '../../DropDownList/DropDownList';
import { togglePlayState } from '../../../redux/slices/musicPlayerSlice';
import { getFavoriteSongsQueryOptions } from '../../../queries/musics';
import {
  Trash,
  Play,
  Edit,
  Additem,
  Pause,
  Shuffle,
  RepeateOne,
  RepeateMusic,
} from 'iconsax-react';
import { removeSongFromPrivatePlaylistMutationOptions } from '../../../queries/playlists';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
} from '../../../queries/musics';
import usePlayBar from '../../../hooks/usePlayBar';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import { getPlaylistByIdQueryOptions } from '../../../queries/playlists';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import AddSongPanel from './AddSongPanel';

function MobileTracklistPanel() {
  const tracklistType = useSelector((state) => state.queryState.type);
  const tracklistId = useSelector((state) => state.queryState.id);
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
  const { data: selectedPlaylistSongs, isLoading: isPlaylistSongsLoading } = useQuery(
    tracklistType === 'playlist'
      ? getSongsByPlaylistIdQueryOptions(tracklistId)
      : tracklistType === 'album'
        ? getSongsByAlbumIdQueryOptions(tracklistId)
        : getFavoriteSongsQueryOptions()
  );
  const removeSongMutation = useMutation(removeSongFromPrivatePlaylistMutationOptions(tracklistId));

  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const { playTracklist } = usePlayBar();
  const selectedTracklist = tracklistType === 'favorites' ? favoriteSongsInfos : data;
  const isFavorites = selectedTracklist?.tracklistType === 'favorites';
  const isPrivatePlaylist =
    selectedTracklist?.tracklistType === 'playlist' && !selectedTracklist?.is_public;
  const showAddSongPanel =
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

      {showAddSongPanel && (
        <AddSongPanel
          isOpen={isAddMenuOpen}
          setIsOpen={setIsAddMenuOpen}
          selectedPlaylistSongs={selectedPlaylistSongs}
          pendingSongId={pendingSongId}
          setPendingSongId={setPendingSongId}
        />
      )}
    </>
  );
}

export default MobileTracklistPanel;
