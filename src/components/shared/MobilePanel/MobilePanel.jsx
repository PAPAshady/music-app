import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import tracklistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import artistDefaultImage from '../../../assets/images/Avatar/no-avatar.png';
import { ArrowLeft } from 'iconsax-react';
import Player from '../Player/Player';
import { useDispatch, useSelector } from 'react-redux';
import { closePanel, closeMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import MobileTracklistPanel from '../../MobilePanels/MobileTracklistPanel/MobileTracklistPanel';
import MobileArtistPanel from '../../MobilePanels/MobileArtistPanel/MobileArtistPanel';

export default function MobilePanel() {
  const { isMobilePanelOpen, title, description, image, type } = useSelector(
    (state) => state.mobilePanel
  );
  const dispatch = useDispatch();
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);
  const defaultImage = type === 'artist' ? artistDefaultImage : tracklistDefaultCover;

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

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-10 min-h-[100dvh] w-full overflow-hidden transition-all duration-300 ${isMobilePanelOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-15 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 relative container mx-auto h-[100dvh] overflow-y-auto py-12 min-[360px]:px-3 md:pb-4"
        onScroll={handleScroll}
      >
        {/* Top bar */}
        <div
          className={`fixed top-0 left-0 z-[2] flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3 sm:gap-6 sm:px-2 sm:py-1">
            <button className="size-6 sm:size-8" onClick={() => dispatch(closeMobilePanel())}>
              <ArrowLeft size="100%" />
            </button>
            <p
              className={`transition-opacity duration-300 lg:text-xl ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {title}
            </p>
          </div>
        </div>

        <div className="flex min-h-full flex-col items-center justify-center gap-4 py-10 text-center min-[360px]:pb-12 min-[400px]:pb-16 sm:gap-5 sm:pb-22 md:pb-0 lg:gap-7">
          <img
            src={image ?? defaultImage}
            className="size-46 rounded-md object-cover sm:size-56 md:size-64 lg:size-80"
            alt={title}
          />
          <p className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{title}</p>
          <p className="w-[90%] text-sm sm:text-base lg:text-lg">
            {description || 'No Description for this playlist.'}
          </p>

          {type === 'tracklist' && <MobileTracklistPanel />}
          {type === 'artist' && <MobileArtistPanel />}

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
