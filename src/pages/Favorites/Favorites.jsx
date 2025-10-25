import bannerBg from '../../assets/images/backgrounds/player-and-settings-page.png';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import TracksSlider from '../../components/Sliders/TracksSlider/TracksSlider';
import { songs } from '../../data';
import { useQuery } from '@tanstack/react-query';
import { getAllAlbumsQueryOptions } from '../../queries/albums';
import 'swiper/css';
import 'swiper/css/pagination';
import { getFavoriteSongsQueryOptions } from '../../queries/musics';
import PlayBarSlider from '../../components/Sliders/PlayBarSlider/PlayBarSlider';
import usePlayBar from '../../hooks/usePlayBar';

export default function Favorites() {
  const albums = useQuery(getAllAlbumsQueryOptions());
  const { data: favoriteSongs, isPending: isFavoriteSongsPending } = useQuery(
    getFavoriteSongsQueryOptions()
  );
  const { playFavoriteSongs } = usePlayBar();

  return (
    <>
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
      <PlayBarSlider
        songs={favoriteSongs}
        isPending={isFavoriteSongsPending}
        onPlay={playFavoriteSongs}
      />
      <div>
        <SectionTitle title="Seggestions for you" />
        <TracksSlider songs={songs} />
      </div>
      <div className="-mt-8">
        <SectionTitle title="You Might Also Like" />
        <AlbumsSlider
          albums={albums.data}
          isLoading={albums.isLoading}
          albumCardSize="md"
          albumCardStyles="!max-w-none"
        />
      </div>
    </>
  );
}
