import { getPlaylistsByGenreQueryOptions } from '../../queries/playlists';
import PlaylistCard from '../MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../MusicCards/PlaylistCard/PlaylistCardSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

function MobileGenrePanelPlaylistsList({ genreId }) {
  const { data: playlists, isPending: isPlaylistsPending } = useQuery(
    getPlaylistsByGenreQueryOptions(genreId)
  );
  const hasPlaylists = isPlaylistsPending || playlists?.length > 0;

  return (
    <div className="space-y-6">
      <p className="text-2xl font-bold">Top Curated Playlists</p>
      {hasPlaylists ? (
        <Swiper
          spaceBetween={16}
          slidesPerView={1.5}
          modules={[Pagination]}
          pagination={{ clickable: true, enabled: false }}
          breakpoints={{
            390: { slidesPerView: 2.2 },
            520: { slidesPerView: 3, pagination: { enabled: true } },
            768: { slidesPerView: 4, pagination: { enabled: true } },
            1024: { slidesPerView: 5.3, pagination: { enabled: true } },
            1120: { slidesPerView: 6.3, pagination: { enabled: true }, spaceBetween: 20 },
          }}
        >
          {isPlaylistsPending
            ? Array(9)
                .fill()
                .map((_, index) => (
                  <SwiperSlide key={index} className="min-[520px]:pb-10">
                    <PlaylistCardSkeleton />
                  </SwiperSlide>
                ))
            : playlists?.map((playlist) => (
                <SwiperSlide key={playlist.id} className="p-[1px] min-[520px]:pb-10">
                  <PlaylistCard {...playlist} />
                </SwiperSlide>
              ))}
        </Swiper>
      ) : (
        <p>No playlists found</p>
      )}
    </div>
  );
}

MobileGenrePanelPlaylistsList.propTypes = { genreId: PropTypes.string };

export default MobileGenrePanelPlaylistsList;
