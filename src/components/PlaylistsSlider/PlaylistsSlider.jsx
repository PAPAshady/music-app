import PropTypes from 'prop-types';
import PlaylistCard from '../MusicCards/PlaylistCard/PlaylistCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';

export default function PlaylistsSlider({ playlists }) {
  return (
    <div className="mx-auto w-[95%] max-w-[1050px]">
      <Swiper
        slidesPerView={1.5}
        spaceBetween={24}
        modules={[FreeMode]}
        freeMode
        breakpoints={{
          480: {
            slidesPerView: 2.5,
          },
          640: {
            slidesPerView: 3.5,
          },
          768: {
            slidesPerView: 4.3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
      >
        {playlists.map((playlist) => (
          <SwiperSlide
            key={playlist.id}
            className="xs:max-w-[295px] p-[1px] min-[480px]:max-w-[226px] sm:max-w-[190px] md:max-w-[205px] lg:p-0 xl:max-w-[190px]"
          >
            <PlaylistCard {...playlist} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

PlaylistsSlider.propTypes = {
  playlists: PropTypes.array.isRequired,
};
