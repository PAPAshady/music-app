import { useState } from 'react';
import { Play, Pause, Heart, Share } from 'iconsax-reactjs';
import { useSelector } from 'react-redux';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import { AnimatePresence, motion } from 'framer-motion';
import { likeSongMutationOptions, unlikeSongMutationOptions } from '../../../queries/likes';
import { formatTime, play, pause } from '../../../redux/slices/musicPlayerSlice';
import { useDispatch } from 'react-redux';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import { getSongByIdQueryOptions } from '../../../queries/songs';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import SongInfosPanelIconButton from './SongInfosPanelIconButton';
import SongInfosPanelTabButton from './SongInfosPanelTabButton';
import LyricsTab from './Tabs/LyricsTab';
import QueuelistTab from './Tabs/QueuelistTab';
import RelatedTab from './Tabs/RelatedTab';
import ArtistTab from './Tabs/ArtistTab';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';

const MotionDiv = motion.div;

export default function SongInfosPanel() {
  const songId = useSelector((state) => state.queryState.id);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('lyrics');
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const {
    data: song,
    isPending,
    isError,
    error,
    failureReason,
  } = useQuery(getSongByIdQueryOptions(songId));
  const { data: artist, isPending: isArtistPending } = useQuery(
    getArtistByIdQueryOptions(song?.artist_id)
  );
  const likeHandlerMutation = useMutation(
    song?.is_liked ? unlikeSongMutationOptions() : likeSongMutationOptions()
  );
  const showErrorPanel =
    failureReason?.code === '22P02' || failureReason?.code === 'PGRST116' || isError;

  if (showErrorPanel) return <ErrorPanel error={error} />;

  const copyLink = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      await navigator.clipboard.writeText(`${baseUrl}?type=track&id=${songId}`);
      dispatch(showNewSnackbar({ message: 'Link copied to clipboard!', type: 'success' }));
    } catch (err) {
      dispatch(showNewSnackbar({ message: 'Error copying link', type: 'error' }));
      console.error('Error copying link : ', err);
    }
  };

  const tabButtons = [
    {
      id: 1,
      title: 'Lyrics',
      active: activeTab === 'lyrics',
      onClick: () => setActiveTab('lyrics'),
    },
    {
      id: 2,
      title: 'Up Next',
      active: activeTab === 'queuelist',
      onClick: () => setActiveTab('queuelist'),
    },
    {
      id: 3,
      title: 'Related',
      active: activeTab === 'related',
      onClick: () => setActiveTab('related'),
    },
    {
      id: 4,
      title: 'Artist',
      active: activeTab === 'artist',
      onClick: () => setActiveTab('artist'),
    },
  ];

  return (
    <div className="sticky top-10 hidden xl:block">
      <aside
        className={`border-secondary-200 flex h-[calc(100dvh-100px)] max-h-175 min-h-107.5 w-67.5 flex-col overflow-y-hidden rounded-xl border bg-linear-to-b from-slate-700 to-slate-900 p-5 px-3 py-5 pb-4 text-white shadow-2xl xl:w-77.5 2xl:h-[calc(100dvh-200px)]`}
      >
        <AnimatePresence mode="wait">
          <MotionDiv
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            key={song?.id}
            variants={{
              initial: { opacity: 0, y: 15 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 15 },
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-center gap-4">
              {isPending ? (
                <>
                  <div className="relative size-20 overflow-hidden rounded-md bg-gray-600/60 shadow-md">
                    <ShimmerOverlay />
                  </div>
                  <div className="flex-1">
                    <div className="relative mb-3 h-3.5 w-3/4 overflow-hidden rounded-full bg-gray-600/60">
                      <ShimmerOverlay />
                    </div>
                    <div className="relative h-2.5 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                      <ShimmerOverlay />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={song.cover || defaultSongCover}
                    alt={`${song.title} cover`}
                    className="h-20 w-20 rounded-md object-cover shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-[22px] leading-tight font-semibold">
                      {song.title}
                    </h3>
                    <button
                      className="mt-1 text-sm text-slate-300 hover:underline"
                      onClick={() => setActiveTab('artist')}
                    >
                      {song.artist}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <SongInfosPanelIconButton
                onClick={() => dispatch(isPlaying ? pause() : play())}
                label={isPlaying ? 'Pause' : 'Play'}
                className="bg-white/6"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </SongInfosPanelIconButton>
              <SongInfosPanelIconButton
                label={song?.is_liked ? 'Unlike' : 'Like'}
                onClick={() => likeHandlerMutation.mutate(song?.id)}
                disabled={likeHandlerMutation.isPending || isPending}
              >
                <Heart
                  size={20}
                  className={`transition-colors ${song?.is_liked ? 'fill-secondary-50 text-secondary-50' : 'fill-transparent text-white'}`}
                />
              </SongInfosPanelIconButton>

              <SongInfosPanelIconButton label="Share song" onClick={copyLink}>
                <Share size={20} />
              </SongInfosPanelIconButton>

              {isPending ? (
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative h-2 w-8 overflow-hidden rounded-full bg-gray-600/60">
                    <ShimmerOverlay />
                  </div>
                  <span className="pb-1 text-slate-400">•</span>
                  <div className="relative h-2 w-8 overflow-hidden rounded-full bg-gray-600/60">
                    <ShimmerOverlay />
                  </div>
                </div>
              ) : (
                <div className="ml-auto text-sm text-slate-400">
                  {formatTime(song.duration)} • {song.release_date?.split('-')[0]}
                </div>
              )}
            </div>
            {/* Tabs */}
            <div className="mt-5">
              <div role="tablist" aria-label="Song panels" className="flex gap-2">
                {tabButtons.map((button) => (
                  <SongInfosPanelTabButton key={button.id} {...button}>
                    {button.title}
                  </SongInfosPanelTabButton>
                ))}
              </div>
            </div>
          </MotionDiv>
        </AnimatePresence>

        {activeTab === 'lyrics' && <LyricsTab songId={song?.id} lyrics={song?.lyrics} />}
        {activeTab === 'queuelist' && <QueuelistTab artistId={song?.artist_id} />}
        {activeTab === 'related' && <RelatedTab song={song} artist={artist} />}
        {activeTab === 'artist' && (
          <ArtistTab artist={artist} isPending={isArtistPending} artistId={song?.artist_id} />
        )}
      </aside>
    </div>
  );
}
