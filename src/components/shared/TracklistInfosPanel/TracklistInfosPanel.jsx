import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getFavoriteSongsQueryOptions,
} from '../../../queries/songs';
import { useQuery } from '@tanstack/react-query';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import { getPlaylistByIdQueryOptions } from '../../../queries/playlists';
import ErrorPanel from '../ErrorPanel/ErrorPanel';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import TracklistInfosPanelSongsList from './TracklistInfosPanelSongsList';
import TracklistInfosPanelDropDownMenu from './TracklistInfosPanelDropDownMenu';
import TracklistInfosPanelCover from './TracklistInfosPanelCover';

const MotionDiv = motion.div;

const TracklistInfosPanel = memo(() => {
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

  const { data: selectedPlaylistSongs, isPending } = useQuery(
    tracklistType === 'album'
      ? getSongsByAlbumIdQueryOptions(tracklistId)
      : tracklistType === 'playlist'
        ? getSongsByPlaylistIdQueryOptions(tracklistId)
        : getFavoriteSongsQueryOptions()
  );

  const showErrorPanel =
    failureReason?.code === '22P02' ||
    failureReason?.code === 'PGRST116' ||
    selectedTracklist === null ||
    isError;

  const headerVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 15 },
    transition: { duration: 0.2 },
  };

  if (showErrorPanel) return <ErrorPanel error={error} />;

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-175 min-h-107.5 w-67.5 flex-col rounded-xl border bg-linear-to-b from-slate-700 to-slate-900 px-3 pt-5 pb-4 xl:w-77.5 2xl:h-[calc(100dvh-200px)]">
        <AnimatePresence mode="wait">
          <MotionDiv
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
                <TracklistInfosPanelDropDownMenu
                  tracklist={selectedTracklist}
                  tracklistType={tracklistType}
                />
              )}
            </div>
            <TracklistInfosPanelCover
              tracklist={selectedTracklist}
              tracklistType={tracklistType}
              tracklistSongs={selectedPlaylistSongs}
            />
          </MotionDiv>
        </AnimatePresence>
        <TracklistInfosPanelSongsList
          songs={selectedPlaylistSongs}
          isPending={isPending}
          tracklist={selectedTracklist}
          tracklistId={tracklistId}
        />
      </div>
    </div>
  );
});

TracklistInfosPanel.displayName = 'TracklistInfosPanel';
export default TracklistInfosPanel;
