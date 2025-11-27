import { cloneElement, memo } from 'react';
import {
  Music,
  Timer,
  User,
  Edit2,
  Trash,
  Heart,
  HeartSlash,
  Play,
  Pause,
  AddCircle,
  MinusCirlce,
} from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import DropDownList from '../../DropDownList/DropDownList';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import favoritesCover from '../../../assets/images/covers/favorites-cover.png';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getFavoriteSongsQueryOptions,
} from '../../../queries/musics';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  play,
  pause,
  setCurrentSongIndex,
  formatTime,
} from '../../../redux/slices/musicPlayerSlice';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';
import usePlayBar from '../../../hooks/usePlayBar';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import {
  getPlaylistByIdQueryOptions,
  subscribeToPlaylistMutationOptions,
  unsubscribeFromPlaylistMutationOptions,
} from '../../../queries/playlists';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import {
  unlikePlaylistMutationOptions,
  likePlaylistMutationOptions,
  unlikeAlbumMutationOptions,
  likeAlbumMutationOptions,
} from '../../../queries/likes';

const SidebarPlaylist = memo(() => {
  useSelector((state) => state.queryState.type);
  const tracklistType = useSelector((state) => state.queryState.type);
  const tracklistId = useSelector((state) => state.queryState.id);
  const {
    data: selectedTracklist,
    isPending: isSelectedTracklistPending,
    isError,
    failureReason,
    error,
  } = useQuery(
    tracklistType === 'album'
      ? getAlbumByIdQueryOptions(tracklistId)
      : tracklistType === 'playlist'
        ? getPlaylistByIdQueryOptions(tracklistId)
        : { queryKey: ['favorites'], queryFn: () => favoriteSongsInfos }
  );
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const { data: selectedPlaylistSongs, isPending } = useQuery(
    tracklistType === 'album'
      ? getSongsByAlbumIdQueryOptions(tracklistId)
      : tracklistType === 'playlist'
        ? getSongsByPlaylistIdQueryOptions(tracklistId)
        : getFavoriteSongsQueryOptions()
  );
  const playlistLikeMutation = useMutation(
    selectedTracklist?.is_liked ? unlikePlaylistMutationOptions() : likePlaylistMutationOptions()
  );
  const albumLikeMutation = useMutation(
    selectedTracklist?.is_liked ? unlikeAlbumMutationOptions() : likeAlbumMutationOptions()
  );
  const playlistSubscriptionMutation = useMutation(
    selectedTracklist?.is_subscribed
      ? unsubscribeFromPlaylistMutationOptions()
      : subscribeToPlaylistMutationOptions()
  );

  const dispatch = useDispatch();
  const playlistCover =
    tracklistType === 'favorites' ? favoritesCover : selectedTracklist?.cover || defaultCover;
  const isPlayingPlaylistSelected =
    playingTracklist.id === selectedTracklist?.id &&
    playingTracklist.title === selectedTracklist?.title;
  const totalTracklistTime = selectedPlaylistSongs?.reduce((acc, next) => acc + next.duration, 0);
  const showErrorPanel =
    failureReason?.code === '22P02' ||
    failureReason?.code === 'PGRST116' ||
    selectedTracklist === null ||
    isError;
  const { playTracklist } = usePlayBar();

  const playPauseButtonHandler = () => {
    if (isPlayingPlaylistSelected) {
      dispatch(isPlaying ? pause() : play());
    } else {
      if (tracklistType === 'favorites') {
        dispatch(setCurrentCollection(favoriteSongsInfos));
      } else {
        dispatch(setCurrentCollection(selectedTracklist));
      }
      dispatch(setCurrentSongIndex(0));
    }
  };

  const likeHandler = () => {
    if (selectedTracklist) {
      const { tracklistType, id } = selectedTracklist;
      if (tracklistType === 'album') {
        albumLikeMutation.mutate(id);
      } else {
        playlistLikeMutation.mutate(id);
      }
    }
  };

  const playlistSubscriptionHandler = () => {
    const isPublicPlaylist =
      selectedTracklist &&
      selectedTracklist.tracklistType === 'playlist' &&
      selectedTracklist.is_public;
    if (isPublicPlaylist) {
      playlistSubscriptionMutation.mutate(selectedTracklist.id);
    }
  };

  const headerVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 15 },
    transition: { duration: 0.2 },
  };

  const listVariants = {
    show: {
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  const playlistInfosArray = [
    {
      id: 1,
      title: selectedPlaylistSongs?.length
        ? `${selectedPlaylistSongs?.length} ${selectedPlaylistSongs?.length > 1 ? 'tracks' : 'track'}`
        : 'No tracks',
      icon: <Music />,
    },
    {
      id: 2,
      title: selectedPlaylistSongs ? formatTime(totalTracklistTime) : '00:00',
      icon: <Timer />,
    },
    { id: 3, title: selectedTracklist?.artist ?? 'No Artist', icon: <User /> },
  ];

  const userPlaylistsDropDownItems = [
    {
      id: 1,
      icon: selectedTracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${selectedTracklist?.is_liked ? 'Unlike' : 'Like'} playlist`,
      onClick: likeHandler,
    },
    {
      id: 2,
      icon: <Edit2 />,
      title: 'Edit playlist',
      onClick: () =>
        dispatch(
          openModal({
            title: `Edit ${selectedTracklist?.title}`,
            actionType: 'edit_playlist',
          })
        ),
    },
    {
      id: 3,
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

  const albumDropDownListItems = [
    {
      id: 1,
      icon: selectedTracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${selectedTracklist?.is_liked ? 'Unlike' : 'Like'} album`,
      onClick: likeHandler,
    },
  ];

  const publicPlaylistsDropDownItems = [
    {
      id: 1,
      icon: selectedTracklist?.is_liked ? <HeartSlash /> : <Heart />,
      title: `${selectedTracklist?.is_liked ? 'Unlike' : 'Like'} playlist`,
      onClick: likeHandler,
    },
    {
      id: 2,
      icon: selectedTracklist?.is_subscribed ? <MinusCirlce /> : <AddCircle />,
      title: `${selectedTracklist?.is_subscribed ? 'Remove from' : 'Add to'} library`,
      onClick: playlistSubscriptionHandler,
    },
  ];

  if (showErrorPanel) return <ErrorPanel error={error} />;

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`playlist-header-${tracklistId}`}
            variants={headerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-1">
              {isSelectedTracklistPending && tracklistType !== 'favorites' ? (
                <div className="relative h-2.5 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
              ) : (
                <p
                  className="text-white-50 subheading-3 truncate"
                  title={tracklistType === 'favorites' ? 'Your Favorites' : selectedTracklist.title}
                >
                  {tracklistType === 'favorites' ? 'Your Favorites' : selectedTracklist.title}
                </p>
              )}
              {tracklistType !== 'favorites' && (
                <DropDownList
                  menuItems={
                    tracklistType === 'album'
                      ? albumDropDownListItems
                      : selectedTracklist?.is_public
                        ? publicPlaylistsDropDownItems
                        : userPlaylistsDropDownItems
                  }
                  dropDownPlacement="bottom end"
                />
              )}
            </div>

            <div className="my-6 flex gap-2">
              {isSelectedTracklistPending && tracklistType !== 'favorites' ? (
                <div className="relative size-32 overflow-hidden rounded-[10px] bg-gray-600/60 xl:size-[140px]">
                  <ShimmerOverlay />
                </div>
              ) : (
                <div className="group relative overflow-hidden rounded-[10px]">
                  <img
                    src={playlistCover}
                    alt={
                      tracklistType === 'favorites' ? 'Your Favorites' : selectedTracklist?.title
                    }
                    className="size-32 object-cover xl:size-[140px]"
                  />
                  <div
                    className={`absolute inset-0 flex size-full items-center justify-center p-3 transition-opacity duration-300 ${
                      isPlayingPlaylistSelected ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    {!!selectedPlaylistSongs?.length && (
                      <button
                        className="bg-primary-500/80 flex size-15 items-center justify-center rounded-full border"
                        onClick={playPauseButtonHandler}
                      >
                        <span className="text-secondary-50 block size-7">
                          {isPlaying && isPlayingPlaylistSelected ? (
                            <Pause size="100%" />
                          ) : (
                            <Play size="100%" />
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex grow flex-col">
                {playlistInfosArray.map((info) =>
                  isPending ? (
                    <PlaylistInfoSkeleton key={info.id} />
                  ) : (
                    <PlaylistInfo key={info.id} {...info} />
                  )
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={tracklistId}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={`flex grow flex-col gap-2 pe-2 pt-[2px] ${selectedPlaylistSongs?.length || isPending ? 'overflow-y-auto' : 'overflow-visible'}`}
          >
            {isPending ? (
              Array(10)
                .fill()
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <PlayBarSkeleton size="sm" />
                  </motion.div>
                ))
            ) : selectedPlaylistSongs.length ? (
              selectedPlaylistSongs.map((song, index) => (
                <motion.div key={song.id} variants={itemVariants}>
                  <PlayBar size="sm" index={index} song={song} onPlay={playTracklist} />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center"
              >
                <Music size={68} className="text-secondary-300" />
                <p className="mt-2 text-xl font-semibold text-white">
                  This {selectedTracklist?.tracklistType} is empty
                </p>
                <p>Let the music begin...</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

function PlaylistInfo({ title, icon }) {
  const styledIcon = cloneElement(icon, { size: 18 });
  return (
    <div className="flex grow items-center gap-1">
      {styledIcon}
      <span className="max-w-[90px] truncate text-sm xl:text-base">{title}</span>
    </div>
  );
}

function PlaylistInfoSkeleton() {
  return (
    <div className="flex w-full grow items-center gap-1">
      <div className="relative size-[20px] min-h-[20px] min-w-[20px] overflow-hidden rounded-md bg-gray-600/60">
        <ShimmerOverlay />
      </div>
      {/* {styledIcon} */}
      <div className="relative w-full grow overflow-hidden rounded-full bg-gray-600/60">
        <ShimmerOverlay />
        <div className="h-2.5 w-1/2 max-w-[90px]"></div>
      </div>
    </div>
  );
}

SidebarPlaylist.displayName = 'SidebarPlaylist';

PlaylistInfo.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default SidebarPlaylist;
