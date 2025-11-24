import sectionBg from '../../../assets/images/backgrounds/section-bg-1.jpg';
import PlaylistCard from '../../MusicCards/PlaylistCard/PlaylistCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay } from 'swiper/modules';
import PropTypes from 'prop-types';
import 'swiper/css';

export default function DiscoverPlaylistsSlider({ playlists }) {
  return (
    <div
      className="mx-auto flex w-full max-w-[95dvw] flex-col overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat md:mx-auto lg:w-[93%] lg:max-w-[calc(95dvw-126px)] xl:w-[calc(95dvw-428px)] xl:max-w-[940px]"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      <div className="size-full items-center justify-between gap-4 backdrop-blur-md min-[480px]:flex min-[480px]:py-5 min-[480px]:ps-4 min-[480px]:pe-0 sm:flex-col sm:gap-8 sm:px-0 sm:py-8 lg:gap-10">
        <div className="grow p-4 text-center min-[480px]:w-1/2 min-[480px]:p-0 min-[480px]:text-start sm:w-full sm:px-6 sm:text-center">
          <p className="text-white-50 mb-4 text-lg sm:text-xl md:mb-6 lg:text-2xl xl:text-[32px]">
            <span className="hidden sm:inline">Discover The</span> Magic of Series Musics with
            Viotune
          </p>
          <p className="text-white-200 text-sm sm:hidden">
            Dive into the music that brings your beloved shows to life.
          </p>
        </div>
        <div className="mx-auto max-w-full py-4 min-[480px]:p-0">
          <Swiper
            slidesPerView={1.5}
            spaceBetween={28}
            modules={[Autoplay, FreeMode]}
            autoplay={{ delay: 2000 }}
            freeMode
            className="mx-auto max-w-[85dvw] min-[480px]:max-w-[225px] min-[590px]:max-w-[300px] sm:max-w-[95dvw] sm:!px-4 md:!pe-7 xl:!pe-0"
            breakpoints={{
              360: { slidesPerView: 2, spaceBetween: 14 },
              480: {
                slidesPerView: 1.3,
                spaceBetween: 12,
                freeMode: false,
              },
              590: {
                slidesPerView: 1.5,
                spaceBetween: 24,
                freeMode: false,
              },
              640: { slidesPerView: 3.5 },
              768: { slidesPerView: 4.4 },
              1024: { slidesPerView: 4.5 },
            }}
          >
            {playlists.map((playlist) => (
              <SwiperSlide
                key={playlist.id}
                className="p-[1px] min-[480px]:last-of-type:pe-4 sm:pe-[1px]"
              >
                <PlaylistCard {...playlist} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

DiscoverPlaylistsSlider.propTypes = {
  playlists: PropTypes.array.isRequired,
};
