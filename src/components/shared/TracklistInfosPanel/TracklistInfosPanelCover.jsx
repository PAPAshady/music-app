import {
  play,
  pause,
  setCurrentSongIndex,
  formatTime,
} from '../../../redux/slices/musicPlayerSlice';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';
import { useDispatch, useSelector } from 'react-redux';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import favoritesCover from '../../../assets/images/covers/favorites-cover.png';
import { Music, Timer, AddCircle, User, Play, Pause, MinusCirlce } from 'iconsax-reactjs';
import PlaylistInfo from './PlaylistInfo/PlaylistInfo';
import PlaylistInfoSkeleton from './PlaylistInfo/PlaylistInfoSkeleton';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import PropTypes from 'prop-types';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import { useMutation } from '@tanstack/react-query';
import {
  unsubscribeFromPlaylistMutationOptions,
  subscribeToPlaylistMutationOptions,
} from '../../../queries/playlists';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

function TracklistInfosPanelCover({
  tracklist,
  isTracklistPending,
  tracklistType,
  tracklistSongs,
  isTracklistSongsPending,
}) {
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const dispatch = useDispatch();
  const playlistCover =
    tracklistType === 'favorites' ? favoritesCover : tracklist?.cover || defaultCover;
  const isPlayingPlaylistSelected =
    playingTracklist.id === tracklist?.id && playingTracklist.title === tracklist?.title;
  const totalTracklistTime = tracklistSongs?.reduce((acc, next) => acc + next.duration, 0);
  const playlistSubscriptionMutation = useMutation(
    tracklist?.is_subscribed
      ? unsubscribeFromPlaylistMutationOptions()
      : subscribeToPlaylistMutationOptions()
  );
  const isPublicPlaylist =
    tracklist && tracklist.tracklistType === 'playlist' && tracklist.is_public;
  const subscriptionButtonIcon = tracklist?.is_subscribed ? (
    <MinusCirlce size={22} />
  ) : (
    <AddCircle size={22} />
  );

  const playPauseButtonHandler = () => {
    if (isPlayingPlaylistSelected) {
      dispatch(isPlaying ? pause() : play());
    } else {
      if (tracklistType === 'favorites') {
        dispatch(setCurrentCollection(favoriteSongsInfos));
      } else {
        dispatch(setCurrentCollection(tracklist));
      }
      dispatch(setCurrentSongIndex(0));
    }
  };

  const publicPlaylistInfosArray = [
    {
      id: 1,
      title: tracklistSongs?.length
        ? `${tracklistSongs?.length} ${tracklistSongs?.length > 1 ? 'tracks' : 'track'}`
        : 'No tracks',
      icon: <Music />,
    },
    {
      id: 2,
      title: tracklistSongs ? formatTime(totalTracklistTime) : '00:00',
      icon: <Timer />,
    },
  ];

  const tracklistInfosArray = [
    {
      id: 1,
      title: tracklistSongs?.length
        ? `${tracklistSongs?.length} ${tracklistSongs?.length > 1 ? 'tracks' : 'track'}`
        : 'No tracks',
      icon: <Music />,
    },
    {
      id: 2,
      title: tracklistSongs ? formatTime(totalTracklistTime) : '00:00',
      icon: <Timer />,
    },
    { id: 3, title: tracklist?.artist ?? 'No Artist', icon: <User /> },
  ];

  return (
    <div className="my-6 flex gap-2">
      {isTracklistPending && tracklistType !== 'favorites' ? (
        <div className="relative size-32 overflow-hidden rounded-[10px] bg-gray-600/60 xl:size-35">
          <ShimmerOverlay />
        </div>
      ) : (
        <div className="group relative overflow-hidden rounded-[10px]">
          <img
            src={playlistCover}
            alt={tracklistType === 'favorites' ? 'Your Favorites' : tracklist?.title}
            className="size-32 object-cover xl:size-35"
          />
          <div
            className={`absolute inset-0 flex size-full items-center justify-center p-3 transition-opacity duration-300 ${
              isPlayingPlaylistSelected ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}
          >
            {!!tracklistSongs?.length && (
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
      <div className="flex grow flex-col items-start">
        {isPublicPlaylist ? (
          <>
            {publicPlaylistInfosArray.map((info) =>
              isTracklistSongsPending ? (
                <PlaylistInfoSkeleton key={info.id} />
              ) : (
                <PlaylistInfo key={info.id} {...info} />
              )
            )}
            <button
              className="bg-primary-500/80 hover:bg-primary-500 flex grow-[0.4] items-center gap-1 rounded-md px-3 text-start text-xs"
              onClick={() => playlistSubscriptionMutation.mutate(tracklist.id)}
              disabled={playlistSubscriptionMutation.isPending}
            >
              {playlistSubscriptionMutation.isPending ? (
                <LoadingSpinner size="xs" />
              ) : (
                subscriptionButtonIcon
              )}
              <span className="font-semibold">
                {tracklist?.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
              </span>
            </button>
          </>
        ) : (
          tracklistInfosArray.map((info) =>
            isTracklistSongsPending ? (
              <PlaylistInfoSkeleton key={info.id} />
            ) : (
              <PlaylistInfo key={info.id} {...info} />
            )
          )
        )}
      </div>
    </div>
  );
}

TracklistInfosPanelCover.propTypes = {
  tracklist: PropTypes.object,
  tracklistType: PropTypes.string,
  tracklistSongs: PropTypes.array,
  isTracklistPending: PropTypes.bool,
  isTracklistSongsPending: PropTypes.bool,
};

export default TracklistInfosPanelCover;
