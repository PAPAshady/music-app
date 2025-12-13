import { useEffect, useRef } from 'react';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode, Mousewheel, Scrollbar } from 'swiper/modules';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import PropTypes from 'prop-types';
import useLockScrollbar from '../../../hooks/useLockScrollbar';

export default function PlayBarSlider({ songs, isPending, onPlay }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 640px)');
  const songsPerChunk = isDesktop ? 5 : 3;
  const itemsToRender = chunkArray(isPending ? Array(10).fill() : songs, songsPerChunk);
  const { isScrollbarLocked, lockScroll, unlockScroll } = useLockScrollbar();
  const isOneSlideOnly = songs?.length <= 3;
  // adjust the size of playbar for both desktop and mobile/tablet. also covers the case when songs has less lenght that more than 1 slide
  const size = isTablet ? (isOneSlideOnly ? 'lg' : 'md') : isDesktop ? 'lg' : 'md';
  const swiperRef = useRef();

  // disable scrollbar when DropDown menu is open
  useEffect(() => {
    const swiper = swiperRef.current;
    if (isScrollbarLocked) {
      swiper.disable();
      swiper.mousewheel.disable();
      swiper.scrollbar.disable();
    } else {
      swiper.enable();
      swiper.mousewheel.enable();
      swiper.scrollbar.enable();
    }
  }, [isScrollbarLocked]);

  return (
    <div className="mx-auto w-[95%] max-w-262.5">
      <Swiper
        key={isOneSlideOnly}
        spaceBetween={24}
        slidesPerView={1}
        modules={[Pagination, FreeMode, Mousewheel, Scrollbar]}
        pagination={{ clickable: true, enabled: !isDesktop }}
        className="max-w-[95dvw] lg:max-h-112.5"
        scrollbar={{ enabled: false, draggable: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          480: {
            slidesPerView: isOneSlideOnly ? 1 : 1.2,
          },
          570: {
            slidesPerView: isOneSlideOnly ? 1 : 1.4,
          },
          640: {
            slidesPerView: isOneSlideOnly ? 1 : 2,
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
        {itemsToRender.map((chunk, chunkIndex) => (
          <SwiperSlide key={chunkIndex} className="p-px pb-11 lg:h-auto! lg:p-0 lg:pe-8">
            <div className="flex flex-col gap-4 lg:gap-6">
              {chunk.map((item, songIndex) =>
                isPending ? (
                  <PlayBarSkeleton key={songIndex} classNames="!max-w-none" size={size} />
                ) : (
                  <PlayBar
                    key={item.id}
                    index={songsPerChunk * chunkIndex + songIndex} // since we are chunking the array, we need to calculate the song index to play them in order
                    size={size}
                    classNames="!max-w-none"
                    song={item}
                    onPlay={onPlay}
                    onDropDownOpen={lockScroll}
                    onDropDownClose={unlockScroll}
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
  onPlay: PropTypes.func,
};
