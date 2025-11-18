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
      id: 2,
      title: 'Subscribed playlists',
      playlists: subscribedPlaylists,
      isLoading: isSusbscribedPlaylistsPending,
    },

    {
      id: 3,
      title: 'Playlists You Recently Seen',
      playlists: recentlyPlayedPlaylists,
      isLoading: isRecentlyPlayedPlaylistsPending,
    },
    {
      id: 4,
      title: 'Popular playlists based on you',
      playlists: reccomendedPlaylists,
      isLoading: isReccomendedPlaylistsPending,
    },
  ];

  return (
    <>
      {playlistsSections.map(({ id, title, playlists, numberOfPlayLists, isLoading }) => (
        <div key={id}>
          <SectionTitle title={title} />
          <PlaylistsContainer
            playlists={playlists}
            isLoading={isLoading}
            numberOfPlayLists={numberOfPlayLists}
          />
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

function PlaylistsContainer({
  playlists = [],
  numberOfPlayLists = playlists?.length,
  classNames = 'grow !max-w-[170px]',
  isLoading,
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return (
    <>
      {isDesktop ? (
        <div className="flex flex-wrap gap-6">
          {isLoading
            ? Array(7)
                .fill()
                .map((_, index) => (
                  <div key={index} className="w-[170px] max-w-[170px]">
                    <PlaylistCardSkeleton />
                  </div>
                ))
            : playlists
                .slice(0, numberOfPlayLists)
                .map((playList) =>
                  playList.type === 'add-playlist-button' ? (
                    <AddPlaylistButton key={playList.id} classNames={classNames} />
                  ) : (
                    <PlaylistCard key={playList.id} {...playList} classNames={classNames} />
                  )
                )}
        </div>
      ) : (
        <PlaylistsSlider
          isLoading={isLoading}
          playlists={playlists}
          numberOfPlaylists={numberOfPlayLists}
        />
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
