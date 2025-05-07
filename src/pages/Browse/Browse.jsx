import SectionTitle from '../../components/SectionHeader/SectionHeader';
import TracksSlider from '../../components/Sliders/TracksSlider/TracksSlider';
import PlaylistsSlider from '../../components/Sliders/PlaylistsSlider/PlaylistsSlider';
import DiscoverPlaylistsSlider from '../../components/Sliders/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import GenresSlider from '../../components/Sliders/GenresSlider/GenresSlider';
import AlbumsSlider from '../../components/Sliders/AlbumsSlider/AlbumsSlider';
import PlaylistCard from '../../components/MusicCards/PlaylistCard/PlaylistCard';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import useMediaQuery from '../../hooks/useMediaQuery';
import sectionBgImage from '../../assets/images/backgrounds/section-bg-2.jpg';
import { songs, playlists, genres } from '../../data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Browse() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="flex grow flex-col gap-8 lg:gap-10">
      <div>
        <SectionTitle title="Tranding Tracks" />
        <TracksSlider songs={songs} />
      </div>
      <div>
        <SectionTitle title="Trending Playlists" />
        <PlaylistsSlider playlists={playlists} />
      </div>
      <DiscoverPlaylistsSlider playlists={playlists} />
      <div>
        <SectionTitle title="People's Favorite Artists" />
        <ArtistsSlider />
      </div>
      <div>
        <SectionTitle title="Trending Genres" />
        <GenresSlider genres={genres} />
      </div>
      <div>
        <SectionTitle title="Trending Albums" />
        <AlbumsSlider albumCardSize="md" albumCardStyles="!max-w-none" />
      </div>
      <div>
        <SectionTitle title="Let's Party" />
        <TracksSlider songs={songs} />
      </div>
      <div
        className="relative overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat lg:rounded-xl"
        style={{ backgroundImage: `url(${sectionBgImage})` }}
      >
        <div className="xs:px-0 flex size-full flex-col items-center justify-between gap-3 bg-black/30 py-4 ps-4 backdrop-blur-sm min-[480px]:flex-row min-[480px]:py-6 min-[480px]:ps-4 sm:flex-col sm:px-0 sm:py-8 lg:gap-6">
          <div className="text-center min-[480px]:text-start sm:px-4">
            <div className="text-white-50 mb-4 sm:text-center">
              <h4 className="md:text-2x mb-1.5 text-lg leading-relaxed sm:text-xl sm:font-semibold md:mx-auto md:mb-4 md:w-[620px] lg:text-3xl">
                {isDesktop
                  ? "Discover Inner Peace with Viotune's Curated Meditation Playlists"
                  : 'Meditation Playlists'}
              </h4>
              <p className="text-secondary-100 text-sm sm:text-base md:mx-auto md:w-[700px] md:text-base lg:text-lg">
                {isDesktop ? (
                  <>
                    Experience tranquility with our specially crafted meditation playlists. Designed
                    by our team, these playlists are perfect for
                    <span className="font-bold"> Relaxation, Focus, Mindfulness</span>
                  </>
                ) : (
                  "Discover Inner Peace with Viotune's Curated"
                )}
              </p>
            </div>
            {isDesktop ? (
              <div className="mt-5 mb-6 flex items-center justify-center gap-6 lg:my-7">
                <MainButton title="Join Now" size="lg" classNames="border !border-primary" />
                <MainButton title="Learn About" size="lg" type="text" />
              </div>
            ) : (
              <ul className="hidden list-inside list-disc text-sm min-[480px]:block sm:hidden sm:text-base">
                <li>Relaxation</li>
                <li>Focus</li>
                <li>Mindfulness</li>
              </ul>
            )}
          </div>
          <div className="sm:ps-3 lg:px-4">
            <Swiper
              slidesPerView={1.5}
              spaceBetween={12}
              modules={[FreeMode, Autoplay]}
              autoplay={{ delay: 2000 }}
              freeMode
              className="mx-auto max-w-[90dvw] !bg-transparent min-[480px]:max-w-[225px] min-[480px]:!pe-4 min-[590px]:max-w-[300px] sm:max-w-[93dvw] lg:max-w-[calc(93dvw-86px)] lg:!pe-0 xl:max-w-[calc(95dvw-460px)] 2xl:!max-w-[888px]"
              breakpoints={{
                360: { slidesPerView: 2 },
                480: { slidesPerView: 1.3 },
                640: { slidesPerView: 3.5 },
                768: { slidesPerView: 4.3 },
                1024: { slidesPerView: 5, spaceBetween: 16 },
              }}
            >
              {playlists.map((album) => (
                <SwiperSlide key={album.id} className="overflow-hidden rounded-lg">
                  <PlaylistCard {...album} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div>
        <SectionTitle title="Workout Playlists" />
        <PlaylistsSlider playlists={playlists} />
      </div>
      <div>
        <SectionTitle title="Best Albums Of 2024" />
        <AlbumsSlider albumCardSize="md" albumCardStyles="!max-w-none" />
      </div>
      <div>
        <SectionTitle title="Meet the Top New Singers of 2024" />
        <ArtistsSlider />
      </div>
    </div>
  );
}
