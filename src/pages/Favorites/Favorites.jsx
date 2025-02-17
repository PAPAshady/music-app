import bannerBg from '../../assets/images/backgrounds/player-and-settings-page.png';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import { songs } from '../../data';

export default function Favorites() {
  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div
          className="border-primary-300 relative overflow-hidden rounded-4xl border bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerBg})` }}
        >
          <div className="size-full px-4 py-10 backdrop-blur-[2px] sm:px-6 sm:py-14 lg:px-10 lg:py-16 xl:px-12 xl:py-20">
            <h3 className="text-primary-300 mb-3 text-2xl font-bold sm:text-3xl md:mb-6 lg:text-5xl">
              Favorite Music
            </h3>
            <p className="text-primary-200 sm:text-lg">
              Because Favorites Deserve Their Own Space ..
            </p>
          </div>
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
