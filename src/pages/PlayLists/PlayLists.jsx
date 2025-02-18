import useMediaQuery from '../../hooks/useMediaQuery';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/PlaylistsSlider/PlaylistsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import { songs, genres, playlists } from '../../data';

export default function PlayLists() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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
          {isDesktop ? (
            <div className="flex flex-wrap gap-6">
              {playlists.slice(0, 8).map((playList) => (
                <PlaylistCard key={playList.id} {...playList} classNames="grow !max-w-[170px]" />
              ))}
            </div>
          ) : (
            <PlaylistsSlider playlists={playlists} />
          )}
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
