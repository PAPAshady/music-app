import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import PropTypes from 'prop-types';
import usePlayBar from '../../../hooks/usePlayBar';

export default function PlayBarSlider({ songs, isPending }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const itemsToRender = chunkArray(isPending ? Array(10).fill(1) : songs, isDesktop ? 5 : 3);
  const { playSingleSong } = usePlayBar();

  return (
    <div className="mx-auto w-[95%] max-w-[1050px]">
      <Swiper
        spaceBetween={24}
        slidesPerView={1}
        modules={[Pagination, FreeMode, Mousewheel, Scrollbar]}
        pagination={{ clickable: true, enabled: !isDesktop }}
        className="max-w-[95dvw] lg:max-h-[450px]"
        scrollbar={{ enabled: false, draggable: true }}
        breakpoints={{
          480: {
            slidesPerView: 1.2,
          },
          570: {
            slidesPerView: 1.4,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            direction: 'vertical',
            slidesPerView: 'auto',
            spaceBetween: 24,
            freeMode: true,
            mousewheel: { enabled: true, forceToAxis: true },
            scrollbar: { enabled: true },
          },
        }}
      >
        {/* Divide the songs array into chunks of 3 or 5 (depnends on screen size) and map over each chunk */}
        {itemsToRender.map((chunk, index) => (
          <SwiperSlide key={index} className="p-[1px] pb-11 lg:!h-auto lg:p-0 lg:pe-8">
            <div className="flex flex-col gap-4 lg:gap-6">
              {chunk.map((item, index) =>
                isPending ? (
                  <PlayBarSkeleton
                    key={index}
                    classNames="!max-w-none"
                    size={isDesktop ? 'lg' : 'md'}
                  />
                ) : (
                  <PlayBar
                    key={item.id}
                    size={isDesktop ? 'lg' : 'md'}
                    classNames="!max-w-none"
                    song={item}
                    onPlay={playSingleSong}
                  />
                )
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

PlayBarSlider.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};
