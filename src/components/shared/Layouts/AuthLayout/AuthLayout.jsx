import { useEffect, useState } from 'react';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { Outlet } from 'react-router-dom';
import Logo from '../../../Logo/Logo';
import bgImg from '../../../../assets/images/backgrounds/login-signup-page.jpg';

export default function Authentication() {
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <div
      className="bg-primary-800 relative min-h-[100dvh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="flex min-h-[100dvh] items-center justify-center backdrop-blur-md">
        <div
          className={`absolute grid size-full place-content-center transition-all duration-300 ${isLoading ? 'visible z-10 opacity-100' : 'invisible -z-10 opacity-0'}`}
        >
          <Logo size={isDesktop ? 'xl' : 'lg'} isLoading />
        </div>
        <div
          className={`transision-all grow duration-300 ${isLoading ? 'invisible opacity-0' : 'visible opacity-100'}`}
        >
          <div className="flex w-full items-center justify-center">
            <div className="mx-auto flex w-[85%] max-w-[620px] flex-col lg:max-w-[530px] xl:max-w-[600px]">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
