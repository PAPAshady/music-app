import PropTypes from 'prop-types';
import PlaylistCard from '../../MusicCards/PlaylistCard/PlaylistCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import PlaylistCardSkeleton from '../../MusicCards/PlaylistCard/PlaylistCardSkeleton';
import 'swiper/css';
import AddPlaylistButton from '../../AddPlaylistButton/AddPlaylistButton';
import { Like1 } from 'iconsax-reactjs';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import NowPlayingIndicator from '../../NowPlayingIndicator/NowPlayingIndicator';
import { Link, useLocation } from 'react-router-dom';

export default function PlaylistsSlider({
  playlists,
  isLoading,
  numberOfPlaylists = playlists?.length,
}) {
  const dispatch = useDispatch();
  const playingTracklistId = useSelector((state) => state.playContext.currentCollection?.id);
  const pathname = useLocation().pathname;

  const showFavoriteSongs = () => {
    dispatch(setSelectedCollection(favoriteSongsInfos));
    dispatch(openMobilePanel('favorites'));
  };

  return (
    <div className="mx-auto w-[95%] max-w-235">
      <Swiper
        slidesPerView={1.5}
        spaceBetween={24}
        modules={[FreeMode]}
        freeMode
        breakpoints={{
          480: {
            slidesPerView: 2.5,
          },
          640: {
            slidesPerView: 3.5,
          },
          768: {
            slidesPerView: 4.3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="max-w-[95dvw] lg:max-w-[calc(95dvw-86px)] xl:max-w-[calc(95dvw-428px)]"
      >
        {isLoading
          ? Array(10)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <PlaylistCardSkeleton />
                </SwiperSlide>
              ))
          : playlists &&
            playlists.slice(0, numberOfPlaylists).map((playlist) => (
              <SwiperSlide
                key={playlist.id}
                className="xs:max-w-37.5 p-px min-[480px]:max-w-56.5 sm:max-w-47.5 md:max-w-51.25 lg:p-0 xl:max-w-47.5"
              >
                {playlist.type === 'add-playlist-button' ? ( // render a button to add playlist. this button will be rendered only in Playlists.jsx page.
                  <AddPlaylistButton />
                ) : playlist.type === 'favorite-songs' ? (
                  // render a button to show favorite musics onClick
                  <Link
                    className="hover:border-secondary-50 relative flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-transparent bg-linear-to-br from-[#822F6A] via-[#434EAA] to-[#005E4B] transition-colors lg:h-48 lg:gap-3"
                    onClick={showFavoriteSongs}
                    to={`${pathname}?type=favorites`}
                  >
                    {playingTracklistId === 'favorites' && (
                      <div className="absolute top-5 left-2.5">
                        <NowPlayingIndicator />
                      </div>
                    )}
                    <div className="size-16">
                      <Like1 size="100%" />
                    </div>
                    <p className="font-semibold lg:text-lg">Your favorites</p>
                  </Link>
                ) : (
                  <PlaylistCard {...playlist} />
                )}
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

PlaylistsSlider.propTypes = {
  playlists: PropTypes.array,
  isLoading: PropTypes.bool,
  numberOfPlaylists: PropTypes.number,
};
