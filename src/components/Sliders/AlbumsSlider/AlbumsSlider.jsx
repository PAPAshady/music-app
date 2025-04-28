import { useCallback } from 'react';
import AlbumCard from '../../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../../MusicCards/AlbumCard/AlbumCardSkeleton';
import { chunkArray } from '../../../utils/arrayUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { getAllAlbums } from '../../../services/albums';
import useMusicPlayer from '../../../hooks/useMusicPlayer';

export default function AlbumsSlider({ albumCardSize = 'lg', albumCardStyles }) {
  const { setPlaylist } = useMusicPlayer();
  const { data, isLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: getAllAlbums,
    staleTime: Infinity,
    retryDelay: 5000,
    retry: true,
  });

  const playAlbum = useCallback((albumSongs) => setPlaylist(albumSongs), [setPlaylist]);

  return (
    <div className="mx-auto w-[95%] xl:max-w-[940px]">
      <Swiper
        slidesPerView={1}
        spaceBetween={24}
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
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
        {isLoading
          ? chunkArray(Array(9).fill(0), 3).map((skeletonCardsArray, index) => (
              <SwiperSlide key={index} className="p-[1px] pb-11">
                <div className="flex flex-col gap-4">
                  {skeletonCardsArray.map((_, index) => (
                    <AlbumCardSkeleton size={albumCardSize} key={index} />
                  ))}
                </div>
              </SwiperSlide>
            ))
          : chunkArray(data?.albums ?? [], 3).map((albumsArray, index) => (
              <SwiperSlide key={index} className="p-[1px] pb-11">
                <div className="flex flex-col gap-4">
                  {albumsArray.map((album) => (
                    <AlbumCard
                      key={album.id}
                      size={albumCardSize}
                      classNames={albumCardStyles}
                      onClick={playAlbum}
                      {...album}
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
  albumCardSize: PropTypes.oneOf(['md', 'lg']),
  albumCardStyles: PropTypes.string,
};
