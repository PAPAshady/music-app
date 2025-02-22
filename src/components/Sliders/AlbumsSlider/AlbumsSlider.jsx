import AlbumCard from '../../MusicCards/AlbumCard/AlbumCard';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PropTypes from 'prop-types';

export default function AlbumsSlider({ albums, albumCardSize = 'lg', albumCardStyles }) {
  return (
    <div className="mx-auto w-[95%] xl:max-w-[940px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-410px)]"
        breakpoints={{
          500: {
            slidesPerView: 1.2,
          },
          570: {
            slidesPerView: 1.4,
          },
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {chunkArray(albums, 3).map((albumsArray, index) => (
          <SwiperSlide key={index} className="p-[1px] pb-11">
            <div className="flex flex-col gap-4">
              {albumsArray.map((album) => (
                <AlbumCard
                  key={album.id}
                  size={albumCardSize}
                  {...album}
                  classNames={albumCardStyles}
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

AlbumsSlider.propTypes = {
  albums: PropTypes.array.isRequired,
  albumCardSize: PropTypes.oneOf(['md', 'lg']),
  albumCardStyles: PropTypes.string,
};
