import useMediaQuery from '../../hooks/useMediaQuery';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/PlaylistsSlider/PlaylistsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import { shuffleArray } from '../../utils/arrayUtils';
import { songs, genres, playlists as allPlaylists } from '../../data';
import PropTypes from 'prop-types';

export default function PlayLists() {
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
          <PlaylistsContainer numberOfPlayLists={8} />
        </div>
        <div>
          <SectionTitle title="Updated Playlists" />
          <PlaylistsContainer numberOfPlayLists={2} />
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
  playlists: PropTypes.array.isRequired,
  numberOfPlayLists: PropTypes.number,
  classNames: PropTypes.string,
};
