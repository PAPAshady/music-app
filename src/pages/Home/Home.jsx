import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import TracksCard from '../../components/MusicCards/TracksCard/TracksCard';
import { sidebarPlaylistSongs as playList, tracksCardsInfos } from '../../data';

export default function Home() {
  return (
    <div className="flex items-start gap-4">
      <div className="grow">
        <div className="xs:flex-row xs:w-full mx-auto flex w-[90%] flex-col items-center gap-2 sm:gap-4">
          {tracksCardsInfos.map((track) => (
            <div key={track.id} className="flex w-full justify-center">
              <TracksCard {...track} />
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block">
        <SidebarPlaylist playList={playList} />
      </div>
    </div>
  );
}
