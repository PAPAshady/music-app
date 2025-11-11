import Header from '../../components/shared/Header/Header';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';
import DesktopNavbar from '../../components/shared/DesktopNavbar/DesktopNavbar';
import { useState, useEffect } from 'react';
import desktopBgImage from '../../assets/images/backgrounds/404-page-desktop.jpg';
import mobileBgImage from '../../assets/images/backgrounds/404-page-mobile.jpg';
import useMediaQuery from '../../hooks/useMediaQuery';
import MainButton from '../../components/Buttons/MainButton/MainButton';

function NotFoundPage() {
  const [showDesktopLogoNavbar, setShowDesktopLogoNavbar] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
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
      <div className="bg-primary-800 relative flex min-h-[100dvh] flex-col">
        <div
          className={`absolute size-full bg-cover bg-center bg-no-repeat opacity-70`}
          style={{ backgroundImage: `url(${isMobile ? mobileBgImage : desktopBgImage})` }}
        ></div>
        <div className="relative w-full pt-4">
          <div className="container">
            <Header />
          </div>
        </div>

        <main className="text-secondary-50 relative container flex grow gap-8">
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
          <div className="flex w-full grow flex-col items-center justify-center gap-8 px-2 pt-24 pb-42 text-center lg:gap-6 lg:px-10 lg:pb-26">
            <h1 className="text-8xl font-bold sm:text-9xl">404</h1>
            <div className="flex flex-col gap-4">
              <p className="text-xl lg:text-2xl">There is nothing here</p>
              <p className="text-lg">
                The page you are looking for doesn&apos;t exist or has been moved.{' '}
              </p>
            </div>

            <Link to="/">
              <MainButton title="Go back home" size="md" variant="secondary" classNames="w-full" />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

export default NotFoundPage;
