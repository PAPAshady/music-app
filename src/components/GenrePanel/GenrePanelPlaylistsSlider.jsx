import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { getPlaylistsByGenreQueryOptions } from '../../queries/playlists';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import PlaylistCard from './GenrePanelPlaylistCard';
import PlaylistCardSkeleton from './GenrePanelPlaylistCardSkeleton';

function GenrePanelPlaylistsSlider({ genreId }) {
  const { data: playlists, isPending: isPlaylistsPending } = useQuery(
    getPlaylistsByGenreQueryOptions(genreId)
  );
  const hasPlaylists = isPlaylistsPending || playlists?.length > 0;

  return (
    <div className="mt-6 space-y-2">
      <p className="font-bold">Top Curated Playlists</p>
      {hasPlaylists ? (
        <Swiper
          modules={[Pagination]}
          spaceBetween={4}
          pagination={{ clickable: true }}
          slidesPerView={2.2}
        >
          {isPlaylistsPending
            ? Array(6)
                .fill()
                .map((_, index) => (
                  <SwiperSlide key={index} className="pb-9">
                    <PlaylistCardSkeleton />
                  </SwiperSlide>
                ))
            : playlists.map((playlist) => (
                <SwiperSlide key={playlist.id} className={playlists.length > 2 ? 'pb-9' : ''}>
                  <PlaylistCard playlist={playlist} />
                </SwiperSlide>
              ))}
        </Swiper>
      ) : (
        <p className="text-secondary-200 text-sm">No playlists found</p>
      )}
    </div>
  );
}

GenrePanelPlaylistsSlider.propTypes = { genreId: PropTypes.string };

export default GenrePanelPlaylistsSlider;
