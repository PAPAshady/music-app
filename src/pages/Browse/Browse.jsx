import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import TracksSlider from '../../components/TracksSlider/TracksSlider';
import { songs } from '../../data';

export default function Browse() {
  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div>
          <SectionTitle title="Tranding Tracks" />
          <TracksSlider songs={songs} />
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
