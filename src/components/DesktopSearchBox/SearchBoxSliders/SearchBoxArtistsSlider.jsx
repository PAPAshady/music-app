import SmallArtistCard from '../../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

function SearchBoxArtistsSlider({ artists, isPending }) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={28}
      modules={[Pagination]}
      pagination={{ clickable: true }}
    >
      {isPending
        ? Array(10)
            .fill()
            .map((_, index) => (
              <SwiperSlide key={index} className="!w-auto pb-11">
                <SmallArtistCardSkeleton size="md" />
              </SwiperSlide>
            ))
        : artists.map((artist) => (
            <SwiperSlide key={artist.id} className="!w-auto p-[1px] pb-11">
              <SmallArtistCard size="md" artist={artist} />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}

SearchBoxArtistsSlider.propTypes = {
  artists: PropTypes.array,
  isPending: PropTypes.bool,
};

export default SearchBoxArtistsSlider;
