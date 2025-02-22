import TracksCard from '../../MusicCards/TracksCard/TracksCard';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';
import 'swiper/css';
import 'swiper/css/pagination';

export default function GenresSlider({ genres }) {
  return (
    <div className="mx-auto w-[95%] max-w-[940px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
        breakpoints={{ 360: { slidesPerView: 3 } }}
      >
        {chunkArray(genres, 3).map((tracksArray, index) => (
          <SwiperSlide key={index} className="mb-11 p-[1px]">
            <div className="flex flex-col gap-4">
              {tracksArray.map((track) => (
                <TracksCard key={track.id} {...track} />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

GenresSlider.propTypes = {
  genres: PropTypes.array.isRequired,
};
