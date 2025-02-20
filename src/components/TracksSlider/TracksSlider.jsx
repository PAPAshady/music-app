import PlayBar from '../MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../hooks/useMediaQuery';
import { shuffleArray, chunkArray } from '../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

export default function TracksSlider({ songs }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="mx-auto w-[95%] xl:max-w-[940px]">
      <Swiper
        slidesPerView={1}
        modules={[Pagination]}
        spaceBetween={12}
        pagination={{ clickable: true }}
        breakpoints={{
          360: {
            slidesPerView: 1.2,
          },
          480: {
            slidesPerView: 1.5,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2.4,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
      >
        {chunkArray(shuffleArray(songs), 2).map((songsArray, index) => (
          <SwiperSlide key={index} className="pb-11 p-[1px]">
            <div className="flex flex-col gap-3">
              {songsArray.map((song) => (
                <PlayBar
                  key={song.id}
                  {...song}
                  size={isDesktop ? 'sm' : 'md'}
                  classNames="!max-w-full"
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

TracksSlider.propTypes = {
  songs: PropTypes.array.isRequired,
};
