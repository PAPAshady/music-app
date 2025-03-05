import useMediaQuery from '../../hooks/useMediaQuery';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import { shuffleArray } from '../../utils/arrayUtils';
import { songs, genres, playlists as allPlaylists } from '../../data';
import PropTypes from 'prop-types';

export default function PlayLists() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const playlistsSections = [
    // { id: 1, title: 'Your Playlists', numberOfPlayLists: 8 },
    { id: 1, title: 'Updated Playlists', numberOfPlayLists: 2 },
    { id: 2, title: 'Subscribed playlists' },
    { id: 3, title: 'Popular playlists based on you', numberOfPlayLists: 5 },
  ];

  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
          {genres.slice(0, 3).map((track) => (
            <div key={track.id} className="flex w-full justify-center">
              <TracksCard {...track} />
            </div>
          ))}
        </div>
        <div>
          <SectionTitle title="Your Playlists" />
          {/* Render the "Add New Playlist" button as the first item in the playlists list. */}
          {isDesktop ? (
            <div className="flex flex-wrap gap-6">
              {[{ isAddPlaylistButton: true }, ...allPlaylists].slice(0, 8).map((playList) => (
                <PlaylistCard key={playList.id} {...playList} classNames="grow !max-w-[170px]" />
              ))}
            </div>
          ) : (
            <PlaylistsSlider
              playlists={[{ isAddPlaylistButton: true }, ...allPlaylists]}
              numberOfPlaylists={8}
            />
          )}
        </div>
        {playlistsSections.map(({ id, title, numberOfPlayLists }) => (
          <div key={id}>
            <SectionTitle title={title} />
            <PlaylistsContainer numberOfPlayLists={numberOfPlayLists} />
          </div>
        ))}
        <div>
          <SectionTitle title="Add Tracks to your playlists" />
          <div className="flex flex-col gap-4">
            {songs.slice(0, 4).map((song) => (
              <PlayBar key={song.id} size="lg" classNames="!max-w-none" {...song} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Playlists You Recently Seen" />
          <PlaylistsContainer numberOfPlayLists={5} />
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}

function PlaylistsContainer({
  playlists = allPlaylists,
  numberOfPlayLists = playlists.length,
  classNames = 'grow !max-w-[170px]',
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const shuffledPlaylists = shuffleArray(playlists);
  return (
    <>
      {isDesktop ? (
        <div className="flex flex-wrap gap-6">
          {shuffledPlaylists.slice(0, numberOfPlayLists).map((playList) => (
            <PlaylistCard key={playList.id} {...playList} classNames={classNames} />
          ))}
        </div>
      ) : (
        <PlaylistsSlider playlists={shuffledPlaylists} numberOfPlaylists={numberOfPlayLists} />
      )}
    </>
  );
}

PlaylistsContainer.propTypes = {
  playlists: PropTypes.array,
  numberOfPlayLists: PropTypes.number,
  classNames: PropTypes.string,
};
