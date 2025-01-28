import homePageBgImg from '../../../assets/images/backgrounds/home-page.jpg';
import favoritesPageBgImg from '../../../assets/images/backgrounds/favorites-page.jpg';
import playlistAndSubscriptionPageBgImg from '../../../assets/images/backgrounds/playlist and-subscription-page.jpg';
import browsePageBgImg from '../../../assets/images/backgrounds/browse-page.jpg';
import Header from '../Header/Header';
import DesktopNavbar from '../../DesktopNavbar/DesktopNavbar';
import { useLocation, Outlet } from 'react-router-dom';

export default function Layout() {
  const currentPage = useLocation().pathname;

  const pagesBackgrounds = {
    '/': homePageBgImg,
    '/favorites': favoritesPageBgImg,
    '/playlist': playlistAndSubscriptionPageBgImg,
    '/browse': browsePageBgImg,
    '/subscription': playlistAndSubscriptionPageBgImg,
  };

  return (
    <div className="bg-primary-800 relative min-h-[100dvh]">
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-10 blur-lg"
        style={{ backgroundImage: `url(${pagesBackgrounds[currentPage]})` }}
      ></div>
      <div className="relative w-full pt-4">
        <div className="container">
          <Header />
        </div>
      </div>

      <main className="text-secondary-50 relative container flex gap-8">
        <div className="relative hidden lg:block">
          <div className="sticky top-0 z-10 pt-6">
            <DesktopNavbar />
          </div>
        </div>
        <div className="pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
