import AlbumCard from '../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../MusicCards/AlbumCard/AlbumCardSkeleton';
import { chunkArray, shuffleArray } from '../../utils/arrayUtils';
import { getAlbumsByGenreIdQueryOptions } from '../../queries/albums';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

function MobileGenerePanelAlbumsList({ genreId }) {
  const { data: albums, isPending: isAlbumPending } = useQuery(
    getAlbumsByGenreIdQueryOptions(genreId)
  );
  
  const hasAlbums = isAlbumPending || albums?.length > 0;
  return (
    <div className="space-y-6">
      <p className="text-2xl font-bold">Related Albums</p>
      {hasAlbums ? (
        <Swiper
          spaceBetween={16}
          modules={[Pagination]}
          slidesPerView={albums?.length > 3 ? 1.2 : 1}
          pagination={{ clickable: true, enabled: false }}
          breakpoints={{
            640: { slidesPerView: 2, pagination: { enabled: true } },
            1200: { slidesPerView: 3, pagination: { enabled: true } },
          }}
        >
          {isAlbumPending
            ? chunkArray(shuffleArray(Array(12).fill()), 3).map((albumsArr, index) => (
                <SwiperSlide key={index} className="sm:pb-11">
                  <div className="space-y-3">
                    {albumsArr.map((_, index) => (
                      <AlbumCardSkeleton key={index} />
                    ))}
                  </div>
                </SwiperSlide>
              ))
            : chunkArray(albums || [], 3).map((albumsArr, index) => (
                <SwiperSlide key={index} className="sm:pb-11">
                  <div className="space-y-3">
                    {albumsArr.map((album) => (
                      <AlbumCard key={album.id} album={album} size="md" classNames="!max-w-full" />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      ) : (
        <p>No albums found</p>
      )}
    </div>
  );
}

MobileGenerePanelAlbumsList.propTypes = { genreId: PropTypes.string };

export default MobileGenerePanelAlbumsList;
