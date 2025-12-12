import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PlaylistCard from '../MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../MusicCards/PlaylistCard/PlaylistCardSkeleton';
import { MusicPlaylist } from 'iconsax-reactjs';
import MobileSearchPanelSectionTitle from './MobileSearchPanelSectionTitle';
import PropTypes from 'prop-types';

function MobileSearchPanelPlaylistsList({ playlists, isPlaylistsPending }) {
  return (
    <div>
      <MobileSearchPanelSectionTitle title="Playlists" icon={<MusicPlaylist />} />
      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        modules={[Pagination]}
        pagination={{ clickable: true }}
        className="!m-0 !max-w-full !p-[1px]"
      >
        {isPlaylistsPending
          ? Array(8)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index} className="!w-auto !pb-11">
                  <PlaylistCardSkeleton classNames="!h-48" />
                </SwiperSlide>
              ))
          : playlists.map((playlist) => (
              <SwiperSlide key={playlist.id} className="!w-auto !pb-11">
                <PlaylistCard {...playlist} classNames="!h-48" />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

MobileSearchPanelPlaylistsList.propTypes = {
  playlists: PropTypes.array,
  isPlaylistsPending: PropTypes.bool.isRequired,
};

export default MobileSearchPanelPlaylistsList;
