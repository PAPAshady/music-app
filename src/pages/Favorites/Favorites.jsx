import bannerBg from '../../assets/images/backgrounds/player-and-settings-page.png';
import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import PlayBar from '../../components/MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../hooks/useMediaQuery';
import { songs } from '../../data';

export default function Favorites() {
  const isTablet = useMediaQuery('(min-width: 480px)');
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

        <div className="sm: flex max-h-[280px] flex-col gap-3 overflow-y-auto px-3 sm:max-h-[360px] lg:max-h-[414px] lg:gap-4">
          {songs.map((song) => (
            <PlayBar
              key={song.id}
              size={isTablet ? 'lg' : 'md'}
              {...song}
              classNames="!max-w-full"
            />
          ))}
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
