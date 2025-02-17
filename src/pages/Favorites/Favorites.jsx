import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import { songs } from '../../data';

export default function Favorites() {
  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10"></div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
