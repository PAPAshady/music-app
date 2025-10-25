import useMediaQuery from '../../hooks/useMediaQuery';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../../components/MusicCards/PlaylistCard/PlaylistCardSkeleton';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import { songs, genres, playlists } from '../../data';
import { useQuery } from '@tanstack/react-query';
import { getAllPrivatePlaylistsQueryOptions } from '../../queries/playlists';
import PropTypes from 'prop-types';
import usePlayBar from '../../hooks/usePlayBar';
import AddPlaylistButton from '../../components/AddPlaylistButton/AddPlaylistButton';

export default function PlayLists() {
  const userPlaylists = useQuery(getAllPrivatePlaylistsQueryOptions());
  const { playSingleSong } = usePlayBar();
  const isSmallTablet = useMediaQuery('(min-width: 480px)');
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
      title: 'Updated Playlists',
      playlists: userPlaylists.data?.playlist,
      isLoading: userPlaylists.isLoading,
    },
    {
      id: 3,
      title: 'Subscribed playlists',
      playlists: userPlaylists.data,
      isLoading: userPlaylists.isLoading,
    },
    {
      id: 4,
      title: 'Popular playlists based on you',
      playlists,
      numberOfPlayLists: 5,
    },
  ];

  return (
    <>
      <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
        {genres.slice(0, 3).map((track) => (
          <div key={track.id} className="flex w-full justify-center">
            <TracksCard {...track} />
          </div>
        ))}
      </div>
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
        <div className="flex flex-col gap-4">
          {songs.slice(0, 4).map((song) => (
            <PlayBar
              onPlay={playSingleSong}
              key={song.id}
              size={isSmallTablet ? 'lg' : 'sm'}
              classNames="!max-w-none"
              song={song}
            />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle title="Playlists You Recently Seen" />
        <PlaylistsContainer
          playlists={userPlaylists.data}
          isLoading={userPlaylists.isLoading}
          numberOfPlayLists={5}
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
