import PropTypes from 'prop-types';
import PlaylistCard from '../../MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../../MusicCards/PlaylistCard/PlaylistCardSkeleton';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';

function SearchBoxPlaylistsSlider({ playlists, isPending }) {
  return (
    <Swiper spaceBetween={20} slidesPerView="auto" modules={[Pagination]}>
      {isPending
        ? Array(8)
            .fill()
            .map((_, index) => (
              <SwiperSlide key={index} className="w-auto! pb-11">
                <PlaylistCardSkeleton />
              </SwiperSlide>
            ))
        : playlists.map((playlist) => (
            <SwiperSlide key={playlist.id} className="w-auto! pb-11">
              <PlaylistCard {...playlist} />
            </SwiperSlide>
          ))}
    </Swiper>
  );
}

SearchBoxPlaylistsSlider.propTypes = {
  playlists: PropTypes.array,
  isPending: PropTypes.bool,
};

export default SearchBoxPlaylistsSlider;
