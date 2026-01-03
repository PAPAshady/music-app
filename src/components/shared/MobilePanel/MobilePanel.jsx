import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import tracklistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import artistDefaultImage from '../../../assets/images/Avatar/no-avatar.png';
import { ArrowLeft } from 'iconsax-reactjs';
import Player from '../Player/Player';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, closeMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import MobileTracklistPanel from '../../MobilePanels/MobileTracklistPanel/MobileTracklistPanel';
import MobileArtistPanel from '../../MobilePanels/MobileArtistPanel/MobileArtistPanel';
import favoritesCover from '../../../assets/images/covers/favorites-cover.png';
import { useQuery } from '@tanstack/react-query';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import { getPlaylistByIdQueryOptions } from '../../../queries/playlists';
import { getFavoriteSongsQueryOptions } from '../../../queries/songs';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import ShimmerOverlay from '../../ShimmerOverlay/ShimmerOverlay';
import { Navigate } from 'react-router-dom';

export default function MobilePanel() {
  const panelType = useSelector((state) => state.queryState.type);
  const id = useSelector((state) => state.queryState.id);
  const { data, isPending, failureReason } = useQuery(
    panelType === 'album'
      ? getAlbumByIdQueryOptions(id)
      : panelType === 'playlist'
        ? getPlaylistByIdQueryOptions(id)
        : panelType === 'artist'
          ? getArtistByIdQueryOptions(id)
          : getFavoriteSongsQueryOptions()
  );
  const image =
    panelType === 'favorites'
      ? favoritesCover
      : panelType === 'artist'
        ? data?.image || artistDefaultImage
        : data?.cover || tracklistDefaultCover;
  const title = panelType === 'favorites' ? 'Your Favorites' : data?.title || data?.name;
  const description =
    panelType === 'favorites'
      ? 'A collection of your favorite songs!'
      : panelType === 'artist'
        ? data?.bio || 'No bio for this artist.'
        : data?.description || `No Description for this ${data?.tracklistType}.`;
  const isMobilePanelOpen = useSelector((state) => state.mobilePanel.isMobilePanelOpen);
  const dispatch = useDispatch();
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);

  // if user clicks on back button of their device, mobilePanel will close
  useEffect(() => {
    const handlePopState = () => {
      if (isMobilePanelOpen) {
        dispatch(closePanel());
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch, isMobilePanelOpen]);

  // remove the main scrolbar because it causes ui gliches in mobile devices
  useEffect(() => {
    if (isMobilePanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    return () => (document.body.style.overflow = 'visible');
  }, [isMobilePanelOpen]);

  const handleScroll = (e) => {
    if (e.target.scrollTop <= 30) {
      setIsTopbarVisible(false);
    } else {
      setIsTopbarVisible(true);
    }
  };

  // in case if "id" is invalid or if no such media exists, redirect to 404
  if (failureReason?.code === '22P02' || failureReason?.code === 'PGRST116')
    return <Navigate to="/404" replace />;

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-11 min-h-dvh w-full overflow-hidden transition-all duration-300 ${isMobilePanelOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-15 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 xs:px-3 relative container mx-auto h-dvh overflow-y-auto py-12 md:pb-4"
        onScroll={handleScroll}
      >
        {/* Top bar */}
        <div
          className={`fixed top-0 left-0 z-2 flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3 sm:gap-6 sm:px-2 sm:py-1">
            <button className="size-6 sm:size-8" onClick={() => dispatch(closeMobilePanel())}>
              <ArrowLeft size="100%" />
            </button>
            {isPending ? (
              <div
                className={`relative h-2.5 w-32 overflow-hidden rounded-full bg-gray-600/60 transition-opacity duration-300 lg:text-xl ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                <ShimmerOverlay />
              </div>
            ) : (
              <p
                className={`transition-opacity duration-300 lg:text-xl ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
              >
                {title}
              </p>
            )}
          </div>
        </div>

        <div className="xs:pb-12 flex min-h-full flex-col items-center justify-center gap-4 py-10 text-center min-[400px]:pb-16 sm:gap-5 sm:pb-22 md:pb-0 lg:gap-7">
          {isPending ? (
            <>
              <div className="relative size-46 overflow-hidden rounded-md bg-gray-600/60 sm:size-56 md:size-64 lg:size-80">
                <ShimmerOverlay />
              </div>
              <div className="relative h-3 w-[40%] overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
              <div className="mt-2 flex w-full flex-col items-center justify-center gap-2.5">
                <div className="relative h-2 w-[45%] overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
                <div className="relative h-2 w-1/3 overflow-hidden rounded-full bg-gray-600/60">
                  <ShimmerOverlay />
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                src={image}
                className="size-46 rounded-md object-cover sm:size-56 md:size-64 lg:size-80"
                alt={title}
              />
              <p className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{title}</p>
              <p className="w-[90%] text-sm sm:text-base lg:text-lg">{description}</p>
            </>
          )}

          {['album', 'playlist', 'favorites'].includes(panelType) && <MobileTracklistPanel />}
          {panelType === 'artist' && <MobileArtistPanel />}

          {/*
              conditionally rendering the <Player> component based on `isMobilePanelOpen` improves performance by preventing unnecessary re-renders when mobilePanel is closed and is not visible by user.
            */}
          {isMobilePanelOpen && <Player classNames="text-start !w-full" />}
        </div>
      </div>
    </div>,
    document.getElementById('mobilePanel')
  );
}
