import ArtistCard from '../../MusicCards/ArtistCard/ArtistCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';
import ArtistCardSkeleton from '../../MusicCards/ArtistCard/ArtistCardSkeleton';
import PropTypes from 'prop-types';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ArtistsSlider({ artists, isLoading }) {
  return (
    <div className="mx-auto w-[97%] max-w-[940px]">
      <Swiper
        slidesPerView={1.7}
        spaceBetween={20}
        modules={[Pagination, Autoplay, FreeMode]}
        pagination={{ enabled: false, clickable: true }}
        autoplay={{ delay: 2500, enabled: false }}
        freeMode
        breakpoints={{
          360: { slidesPerView: 2 },
          420: { slidesPerView: 2.3 },
          480: { slidesPerView: 2.7 },
          590: { slidesPerView: 3.3 },
          640: { slidesPerView: 3.5 },
          768: { slidesPerView: 4 },
          850: { slidesPerView: 4.5 },
          1024: { slidesPerView: 4.5, freeMode: false },
          1440: { slidesPerView: 3.9, pagination: { enabled: true }, freeMode: false },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
      >
        {isLoading
          ? Array(10)
              .fill(0)
              .map((_, index) => (
                <SwiperSlide key={index} className="pb-11">
                  <ArtistCardSkeleton />
                </SwiperSlide>
              ))
          : artists?.map((artist) => (
              <SwiperSlide key={artist.id} className="pb-11">
                <ArtistCard {...artist} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

ArtistsSlider.propTypes = {
  artists: PropTypes.array,
  isLoading: PropTypes.bool,
};
