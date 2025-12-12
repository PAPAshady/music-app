import useMediaQuery from '../../hooks/useMediaQuery';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../../components/MusicCards/PlaylistCard/PlaylistCardSkeleton';
import { useQuery } from '@tanstack/react-query';
import {
  getAllPrivatePlaylistsQueryOptions,
  getUserSubscribedPlaylistsQueryOptions,
  getRecentlyPlayedPlaylistsQueryOptions,
  getRecommendedPlaylistsQueryOptions,
  getTrendingPlaylistsQueryOptions,
  getPlaylistsByGenreQueryOptions,
} from '../../queries/playlists';
import { getTrendingSongsQueryOptions } from '../../queries/musics';
import PropTypes from 'prop-types';
import AddPlaylistButton from '../../components/AddPlaylistButton/AddPlaylistButton';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import usePlayBar from '../../hooks/usePlayBar';

export default function PlayLists() {
  const userPlaylists = useQuery(getAllPrivatePlaylistsQueryOptions());
  const { data: subscribedPlaylists, isPending: isSusbscribedPlaylistsPending } = useQuery(
    getUserSubscribedPlaylistsQueryOptions()
  );
  const { data: recentlyPlayedPlaylists, isPending: isRecentlyPlayedPlaylistsPending } = useQuery(
    getRecentlyPlayedPlaylistsQueryOptions()
  );
  const { data: reccomendedPlaylists, isPending: isReccomendedPlaylistsPending } = useQuery(
    getRecommendedPlaylistsQueryOptions()
  );
  const { data: trendingSongs, isPending: isTrendingSongsPending } = useQuery(
    getTrendingSongsQueryOptions()
  );
  const showSubscribedPlaylists = !!subscribedPlaylists?.length;
  const showRecentPlaylists = !!recentlyPlayedPlaylists?.length;
  const showRecommendedPlaylists = !!reccomendedPlaylists?.length;
  const { data: tredningPlaylists, isLoading: isTrendingPlaylistsLoading } = useQuery({
    ...getTrendingPlaylistsQueryOptions(),
    enabled: !showSubscribedPlaylists,
  });
  const { data: popPlaylists, isLoading: isPopPlaylistsLoading } = useQuery({
    ...getPlaylistsByGenreQueryOptions('bd3083dc-dc17-4bf9-872e-016b40aa11e1'), // get pop playlists
    enabled: !showRecentPlaylists,
  });
  const { data: hipHopPlaylists, isLoading: isHipHopPlaylistsLoading } = useQuery({
    ...getPlaylistsByGenreQueryOptions('22cebc0a-01a0-4f3d-a6b9-45039290936c'), //  get hip-hop playlists
    enabled: !showRecommendedPlaylists,
  });
  const { playSingleSong } = usePlayBar();
  // Render the "Add New Playlist" button as the first item in the playlists list.
  const privatePlaylists = [{ id: 0, type: 'add-playlist-button' }, ...(userPlaylists.data ?? [])];

  const playlistsSections = [
    {
      id: 1,
      title: 'Your Playtlists',
      playlists: privatePlaylists,
      isLoading: userPlaylists.isLoading,
    },
    {
      // if user is not subscribed to any playlist, show trending playlists
      id: 2,
      title: showSubscribedPlaylists ? 'Subscribed playlists' : 'Trending Playlists',
      playlists: showSubscribedPlaylists ? subscribedPlaylists : tredningPlaylists,
      isLoading: isSusbscribedPlaylistsPending || isTrendingPlaylistsLoading,
    },
    {
      // if user is not recently played any playlist, show pop playlists
      id: 3,
      title: showRecentPlaylists ? 'Playlists You Recently Seen' : 'Top pop hits',
      playlists: showRecentPlaylists ? recentlyPlayedPlaylists : popPlaylists,
      isLoading: isRecentlyPlayedPlaylistsPending || isPopPlaylistsLoading,
    },
    {
      id: 4,
      title: showRecommendedPlaylists ? 'Popular playlists based on you' : 'Best of hip-hop',
      playlists: showRecommendedPlaylists ? reccomendedPlaylists : hipHopPlaylists,
      isLoading: isReccomendedPlaylistsPending || isHipHopPlaylistsLoading,
    },
  ];

  return (
    <>
      {playlistsSections.map(({ id, title, playlists, isLoading }) => (
        <div key={id}>
          <SectionTitle title={title} isPending={isLoading} />
          <PlaylistsContainer playlists={playlists} isLoading={isLoading} />
        </div>
      ))}
      <div>
        <SectionTitle title="Add Tracks to your playlists" />
        <PlayBarSlider
          songs={trendingSongs}
          isPending={isTrendingSongsPending}
          onPlay={playSingleSong}
        />
      </div>
    </>
  );
}

function PlaylistsContainer({ playlists = [], classNames = 'grow !max-w-[170px]', isLoading }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return (
    <>
      {isDesktop ? (
        <div className="flex flex-wrap gap-6">
          {isLoading
            ? Array(7)
                .fill()
                .map((_, index) => (
                  <div key={index} className="w-42.5 max-w-42.5">
                    <PlaylistCardSkeleton />
                  </div>
                ))
            : playlists.map((playList) =>
                playList.type === 'add-playlist-button' ? (
                  <AddPlaylistButton key={playList.id} classNames={classNames} />
                ) : (
                  <PlaylistCard key={playList.id} {...playList} classNames={classNames} />
                )
              )}
        </div>
      ) : (
        <PlaylistsSlider isLoading={isLoading} playlists={playlists} />
      )}
    </>
  );
}

PlaylistsContainer.propTypes = {
  playlists: PropTypes.array,
  numberOfPlayLists: PropTypes.number,
  isLoading: PropTypes.bool,
  classNames: PropTypes.string,
};
