import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { chunkArray } from '../../../utils/arrayUtils';
import PropTypes from 'prop-types';
import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';

function SearchBoxTracksSlider({ songs, isPending }) {
  return (
    <Swiper
      slidesPerView={2.4}
      spaceBetween={16}
      modules={[Pagination]}
      pagination={{ clickable: true }}
      freeMode
    >
      {chunkArray(isPending ? Array(8).fill() : songs, 2).map((songsArr, index) => (
        <SwiperSlide key={index} className="pb-11">
          <div className="flex flex-col gap-3">
            {songsArr.map((song, index) =>
              isPending ? (
                <SongCardSkeleton key={index} />
              ) : (
                <SongCard key={song.id} song={song} index={index} size="sm" />
              )
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

SearchBoxTracksSlider.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool,
};

export default SearchBoxTracksSlider;
