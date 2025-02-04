import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import PlaylistsSlider from '../../components/PlaylistsSlider/PlaylistsSlider';
import { sidebarPlaylistSongs, tracksCardsInfos, playlists } from '../../data';

export default function Home() {
  return (
    <div className="flex items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
          {tracksCardsInfos.map((track) => (
            <div key={track.id} className="flex w-full justify-center">
              <TracksCard {...track} />
            </div>
          ))}
        </div>
        <div>
          <SectionHeader title="Playlists Tailored for You" />
          <PlaylistsSlider playlists={playlists.slice(0, 5)} />
        </div>
        <div>
          <SectionHeader title="Your Personal Music Space" />
          <PlaylistsSlider playlists={playlists.slice(5, 10)} />
        </div>
      </div>
      <div className="hidden xl:block">
        <SidebarPlaylist playList={sidebarPlaylistSongs} />
      </div>
    </div>
  );
}
