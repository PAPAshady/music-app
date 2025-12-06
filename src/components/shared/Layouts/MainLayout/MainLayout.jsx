import { useState, useEffect } from 'react';
import Header from '../../Header/Header';
import DesktopNavbar from '../../DesktopNavbar/DesktopNavbar';
import HamburgerMenu from '../../HamburgerMenu/HamburgerMenu';
import Player from '../../Player/Player';
import Footer from '../../Footer/Footer';
import Logo from '../../../Logo/Logo';
import MobilePanel from '../../MobilePanel/MobilePanel';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { useLocation, Outlet, Link, useMatches } from 'react-router-dom';
import TracklistInfosPanel from '../../TracklistInfosPanel/TracklistInfosPanel';
import SidebarWelcomePanel from '../../SidebarWelcomePanel/SidebarWelcomePanel';
import PlaylistInfosModal from '../../../PlaylistInfosModal/PlaylistInfosModal';
import ConfirmModal from '../../../ConfirmModal/ConfirmModal';
import ArtistInfosPanel from '../../ArtistInfosPanel/ArtistInfosPanel';
import SongInfosPanel from '../../SongInfosPanel/SongInfosPanel';
import MobileSearchPanel from '../../../MobileSearchPanel/MobileSearchPanel';
import PlayerPanel from '../../PlayerPanel/PlayerPanel';
import { useSelector } from 'react-redux';
import GenrePanel from '../../../GenrePanel/GenrePanel';
import MobileGenrePanel from '../../../MobileGenrePanel/MobileGenrePanel';
import AddSongToPlaylistMobilePanel from '../../../AddSongToPlaylistMobilePanel/AddSongToPlaylistMobilePanel';

const validSidebarTypes = ['playlist', 'album', 'favorites', 'artist', 'track', 'genre'];

export default function MainLayout() {
  const [showDesktopLogoNavbar, setShowDesktopLogoNavbar] = useState(false);
  const currentPage = useLocation().pathname;
  const isDesktop = useMediaQuery('(max-width: 1280px)');
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isSmallMobile = useMediaQuery('(max-width: 639px)');
  const sidebarType = useSelector((state) => state.queryState.type);
  const isPlayerPanelOpen = useSelector((state) => state.playerPanel.isOpen);
  const matches = useMatches();
  const isSettingsPage = currentPage.includes('/settings');
  const backgroundImage = matches.at(isSettingsPage ? -2 : -1).handle.backgroundCover;

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
                  {['album', 'playlist', 'favorites'].includes(sidebarType) && (
                    <TracklistInfosPanel />
                  )}
                  {sidebarType === 'artist' && <ArtistInfosPanel />}
                  {sidebarType === 'track' && <SongInfosPanel />}
                  {sidebarType === 'genre' && <GenrePanel />}
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
        {isDesktop && <MobileGenrePanel />}
        {isMobile && <MobileSearchPanel />}
        <PlayerPanel />
        <ConfirmModal />
        {isSmallMobile && <AddSongToPlaylistMobilePanel />}
      </div>
      <PlaylistInfosModal />
    </>
  );
}
