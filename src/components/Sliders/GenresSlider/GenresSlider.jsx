import GenreCard from '../../MusicCards/GenreCard/GenreCard';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';
import 'swiper/css';
import 'swiper/css/pagination';
import GenreCardSkeleton from '../../MusicCards/GenreCard/GenreCardSkeleton';

export default function GenresSlider({ genres, isPending }) {
  return (
    <div className="mx-auto w-[95%] max-w-[940px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={16}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
        breakpoints={{ 360: { slidesPerView: 3 } }}
      >
        {isPending
          ? chunkArray(Array(9).fill(0), 3).map((skeletonCardsArray, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-4">
                  {skeletonCardsArray.map((_, index) => (
                    <GenreCardSkeleton key={index} />
                  ))}
                </div>
              </SwiperSlide>
            ))
          : chunkArray(genres, 3).map((tracksArray, index) => (
              <SwiperSlide key={index} className="mb-11 p-[1px]">
                <div className="flex flex-col gap-4">
                  {tracksArray.map((track) => (
                    <GenreCard key={track.id} {...track} />
                  ))}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

GenresSlider.propTypes = {
  genres: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};
