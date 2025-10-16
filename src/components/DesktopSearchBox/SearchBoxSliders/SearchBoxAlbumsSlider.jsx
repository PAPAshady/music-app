import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import AlbumCard from '../../MusicCards/AlbumCard/AlbumCard';
import PropTypes from 'prop-types';
import AlbumCardSkeleton from '../../MusicCards/AlbumCard/AlbumCardSkeleton';

function SearchBoxAlbumsSlider({ albums, isPending }) {
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={16}
      modules={[Pagination]}
      pagination={{ clickable: true }}
      breakpoints={{
        1120: {
          slidesPerView: 2.2,
        },
        1200: {
          slidesPerView: 2,
        },
        1280: { slidesPerView: 2.2 },
      }}
    >
      {isPending
        ? Array(10)
            .fill()
            .map((_, index) => (
              <SwiperSlide key={index} className="pb-11">
                <AlbumCardSkeleton size="md" classNames="!max-w-full" />
              </SwiperSlide>
            ))
        : albums.map((album) => (
            <SwiperSlide key={album.id} className="pb-11">
              <AlbumCard size="md" album={album} classNames="!max-w-full" />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}

SearchBoxAlbumsSlider.propTypes = {
  albums: PropTypes.array,
  isPending: PropTypes.bool,
};

export default SearchBoxAlbumsSlider;
