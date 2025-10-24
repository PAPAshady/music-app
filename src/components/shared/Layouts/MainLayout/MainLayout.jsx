import { useState, useEffect } from 'react';
import homePageBgImg from '../../../../assets/images/backgrounds/home-page.jpg';
import favoritesPageBgImg from '../../../../assets/images/backgrounds/favorites-page.jpg';
import playlistAndSubscriptionPageBgImg from '../../../../assets/images/backgrounds/playlist and-subscription-page.jpg';
import browsePageBgImg from '../../../../assets/images/backgrounds/browse-page.jpg';
import settingsPageBgImg from '../../../../assets/images/backgrounds/player-and-settings-page.png';
import Header from '../../Header/Header';
import DesktopNavbar from '../../DesktopNavbar/DesktopNavbar';
import HamburgerMenu from '../../HamburgerMenu/HamburgerMenu';
import Player from '../../Player/Player';
import Footer from '../../Footer/Footer';
import Logo from '../../../Logo/Logo';
import MobilePanel from '../../MobilePanel/MobilePanel';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { useLocation, Outlet, Link } from 'react-router-dom';
import SidebarPlaylist from '../../SidebarPlaylist/SidebarPlaylist';
import SidebarWelcomePanel from '../../SidebarWelcomePanel/SidebarWelcomePanel';
import PlaylistInfosModal from '../../../PlaylistInfosModal/PlaylistInfosModal';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';
import ArtistInfosPanel from '../../ArtistInfosPanel/ArtistInfosPanel';
import SongInfosPanel from '../../SongInfosPanel/SongInfosPanel';
import MobileSearchPanel from '../../../MobileSearchPanel/MobileSearchPanel';
import PlayerPanel from '../../PlayerPanel/PlayerPanel';
import MobilePlayerPanel from '../../../MobilePlayerPanel/MobilePlayerPanel';
import { useSelector } from 'react-redux';

const validSidebarTypes = ['playlist', 'album', 'favorites', 'artist', 'track'];

export default function MainLayout() {
  const [showDesktopLogoNavbar, setShowDesktopLogoNavbar] = useState(false);
  const currentPage = useLocation().pathname;
  const isDesktop = useMediaQuery('(max-width: 1280px)');
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const sidebarType = useSelector((state) => state.queryState.type);
  const isPlayerPanelOpen = useSelector((state) => state.playerPanel.isOpen);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY < 82) {
        setShowDesktopLogoNavbar(false);
      } else {
        setShowDesktopLogoNavbar(true);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const pagesBackgrounds = {
    '/': homePageBgImg,
    '/favorites': favoritesPageBgImg,
    '/playlists': playlistAndSubscriptionPageBgImg,
    '/browse': browsePageBgImg,
    '/permium': playlistAndSubscriptionPageBgImg,
  };

  const backgroundImage = currentPage.includes('/settings') // checks if user is in /settings route and sets the proper background image.
    ? settingsPageBgImg
    : pagesBackgrounds[currentPage];

  return (
    <>
      <div className="bg-primary-800 relative min-h-[100dvh]">
        <div
          className={`absolute size-full bg-cover bg-center bg-no-repeat ${currentPage.includes('/settings') ? 'opacity-70' : 'opacity-10 blur-md'}`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
        <div className="relative w-full pt-4">
          <div className="container">
            <Header />
          </div>
        </div>

        <main className="text-secondary-50 relative container flex gap-8">
          <div className="relative hidden lg:block">
            <div className="sticky top-0 z-10 pt-6">
              <Link
                className={`absolute mb-5 block transition-all duration-300 ${showDesktopLogoNavbar ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}
              >
                <Logo size="md" />
              </Link>
              <div
                className={`transition-all duration-300 ${showDesktopLogoNavbar ? 'pt-[90px]' : 'pt-0'}`}
              >
                <DesktopNavbar />
              </div>
            </div>
          </div>
          <div className="flex grow flex-col items-start gap-12 pt-6 pb-32 lg:pb-10">
            <div className="flex w-full items-start gap-6">
              <div className="flex grow flex-col gap-8 pt-8 lg:gap-11">
                <Outlet />
              </div>

              {sidebarType && validSidebarTypes.includes(sidebarType) ? (
                <>
                  {['album', 'playlist', 'favorites'].includes(sidebarType) && <SidebarPlaylist />}
                  {sidebarType === 'artist' && <ArtistInfosPanel />}
                  {sidebarType === 'track' && <SongInfosPanel />}
                </>
              ) : (
                <SidebarWelcomePanel />
              )}
            </div>
            {!isPlayerPanelOpen && <Player />}
            <Footer />
          </div>
        </main>
        <HamburgerMenu />
        {isDesktop && <MobilePanel />}
        {isMobile && <MobileSearchPanel />}
        {isMobile ? <MobilePlayerPanel /> : <PlayerPanel />}
        <ConfirmModal />
      </div>
      <PlaylistInfosModal />
    </>
  );
}
