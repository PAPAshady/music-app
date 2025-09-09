import { cloneElement, memo } from 'react';
import { Music, Timer, User, Edit2, Trash, Heart, Play, Pause, AddCircle } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import DropDownList from '../../DropDownList/DropDownList';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
} from '../../../queries/musics';
import { useQuery } from '@tanstack/react-query';
import {
  play,
  pause,
  setCurrentSongIndex,
  formatTime,
} from '../../../redux/slices/musicPlayerSlice';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';

const SidebarPlaylist = memo(() => {
  const selectedTracklist = useSelector((state) => state.playContext.selectedCollection);
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const { data: selectedPlaylistSongs, isLoading } = useQuery(
    selectedTracklist.tracklistType === 'album'
      ? getSongsByAlbumIdQueryOptions(selectedTracklist.id)
      : getSongsByPlaylistIdQueryOptions(selectedTracklist.id)
  );
  const dispatch = useDispatch();
  const playlistCover = selectedTracklist.cover ? selectedTracklist.cover : defaultCover;
  const isPlayingPlaylistSelected =
    playingTracklist.id === selectedTracklist.id &&
    playingTracklist.title === selectedTracklist.title;
  const totalTracklistTime = selectedPlaylistSongs?.reduce((acc, next) => acc + next.duration, 0);

  const playPauseButtonHandler = () => {
    if (!isPlayingPlaylistSelected) {
      dispatch(setCurrentCollection(selectedTracklist));
      dispatch(setCurrentSongIndex(0));
      return;
    }
    dispatch(isPlaying ? pause() : play());
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
    { id: 3, title: selectedTracklist.artist ?? 'No Artist', icon: <User /> },
  ];

  const playlistDropDownListItems =
    selectedTracklist.is_public || selectedTracklist.tracklistType === 'album'
      ? [
          {
            id: 1,
            icon: <AddCircle />,
            title: 'Add to library',
          },
          { id: 2, icon: <Heart />, title: 'Add to favorite playlists' },
        ]
      : [
          {
            id: 1,
            icon: <Edit2 />,
            title: 'Edit playlist',
            onClick: () =>
              dispatch(
                openModal({ title: `Edit ${selectedTracklist.title}`, actionType: 'edit_playlist' })
              ),
          },
          {
            id: 2,
            icon: <Trash />,
            title: 'Delete playlist',
            onClick: () =>
              dispatch(
                openConfirmModal({
                  title: `Delete "${selectedTracklist.title}" playlist.`,
                  message: 'Are you sure you want to delete this playlist ?',
                  buttons: { confirm: true, cancel: true },
                  buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
                  actionType: 'delete_playlist',
                })
              ),
          },
          { id: 3, icon: <Heart />, title: 'Add to favorite playlists' },
        ];
  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`playlist-header-${selectedTracklist.title}-${selectedTracklist.id}`}
            variants={headerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-1">
              <p
                className="text-white-50 subheading-3 truncate"
                title={selectedTracklist.title || 'Select a playlist'}
              >
                {selectedTracklist.title || 'Select a playlist'}
              </p>
              <DropDownList menuItems={playlistDropDownListItems} dropDownPlacement="bottom end" />
            </div>

            <div className="my-6 flex gap-2">
              <div className="group relative overflow-hidden rounded-[10px]">
                <img
                  src={playlistCover}
                  alt={selectedTracklist.title || 'Select a playlist'}
                  className="size-32 object-cover xl:size-[140px]"
                />
                <div
                  className={`absolute inset-0 flex size-full items-center justify-center p-3 transition-opacity duration-300 ${isLoading && 'bg-black/50'} ${
                    !isPlayingPlaylistSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`}
                >
                  {isLoading ? (
                    <LoadingSpinner size="lg" />
                  ) : selectedPlaylistSongs?.length ? (
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
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                {playlistInfosArray.map((info) => (
                  <PlaylistInfo key={info.id} {...info} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedTracklist.title}-${selectedTracklist.id}`}
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className={`flex grow flex-col gap-2 pe-2 pt-[2px] ${selectedPlaylistSongs?.length || isLoading ? 'overflow-y-auto' : 'overflow-visible'}`}
          >
            {isLoading ? (
              Array(10)
                .fill()
                .map((_, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <PlayBarSkeleton size="sm" />
                  </motion.div>
                ))
            ) : selectedPlaylistSongs?.length ? (
              selectedPlaylistSongs?.map((song, index) => (
                <motion.div key={song.id} variants={itemVariants}>
                  <PlayBar size="sm" index={index} song={song} />
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center"
              >
                <Music size={68} className="text-secondary-300" />
                <p className="mt-2 text-xl font-semibold text-white">
                  This {selectedTracklist.tracklistType} is empty
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

SidebarPlaylist.displayName = 'SidebarPlaylist';

PlaylistInfo.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default SidebarPlaylist;
