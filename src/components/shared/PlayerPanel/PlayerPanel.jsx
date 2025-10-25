import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import backgroundImage from '../../../assets/images/backgrounds/player-and-settings-page.png';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { ArrowDown2 } from 'iconsax-react';
import {
  getRelatedSongsBySongDataQueryOptions,
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getPopularSongsByArtistIdQueryOptions,
  getFavoriteSongsQueryOptions,
} from '../../../queries/musics';
import 'swiper/css';
import './PlayerPanel.css';
import { closePanel as closePlayerPanel } from '../../../redux/slices/playerPanelSlice';
import PropTypes from 'prop-types';
import DesktopPlayerPanel from '../../DesktopPlayerPanel/DesktopPlayerPanel';
import MobilePlayerPanel from '../../MobilePlayerPanel/MobilePlayerPanel';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { getSongByIdQueryOptions } from '../../../queries/musics';

export default function PlayerPanel() {
  const songId = useSelector((state) => state.queryState.id);
  const isOpen = useSelector((state) => state.playerPanel.isOpen);
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const dispatch = useDispatch();
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const selectedSingleSong = useSelector((state) => state.playContext.singleSong);
  const { data: song } = useQuery(getSongByIdQueryOptions(songId));
  const queuelistType = useSelector((state) => state.playContext.queuelistType);
  const { data, isPending } = useQuery(
    queuelistType === 'related_songs'
      ? getRelatedSongsBySongDataQueryOptions(selectedSingleSong)
      : queuelistType === 'playlist'
        ? getSongsByPlaylistIdQueryOptions(playingTracklist.id)
        : queuelistType === 'album'
          ? getSongsByAlbumIdQueryOptions(playingTracklist.id)
          : queuelistType === 'artist_popular_songs'
            ? getPopularSongsByArtistIdQueryOptions(song?.artist_id)
            : getFavoriteSongsQueryOptions()
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => (document.body.style.overflow = 'visible');
  }, [isOpen]);

  return createPortal(
    <div
      className={`fixed inset-0 transition-all duration-300 will-change-transform ${isOpen ? 'z-10 translate-y-0 opacity-100' : 'z-[-1] translate-y-full opacity-0'} ${isMobile && 'overflow-y-auto'}`}
    >
      <div
        className={`relative min-h-[100dvh] overflow-y-auto bg-cover bg-center bg-no-repeat ${isMobile && 'flex'}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <button
          onClick={() => dispatch(closePlayerPanel())}
          className="text-secondary-50 fixed top-3 left-3 z-[1] sm:top-5 sm:left-5 md:top-7 md:left-7 lg:hidden"
        >
          <span className="block size-8 cursor-pointer md:size-10">
            <ArrowDown2 size="100%" />
          </span>
        </button>
        {isMobile ? (
          <MobilePlayerPanel isPending={isPending} songs={data} />
        ) : (
          <DesktopPlayerPanel isPending={isPending} songs={data} isPlayerPanelOpen={isOpen} />
        )}
      </div>
    </div>,
    document.getElementById('playerPanel')
  );
}

PlayerPanel.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
};
