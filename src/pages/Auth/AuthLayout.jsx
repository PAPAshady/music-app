import { useEffect, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import Logo from '../../components/Logo/Logo';
import bgImg from '../../assets/images/backgrounds/login-signup-page.jpg';

export default function Authentication() {
  const [isLoading, setIsLoading] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <div className="bg-primary-800 relative min-h-[100dvh]">
      <div
        className="absolute size-full bg-cover bg-top bg-no-repeat opacity-50 blur-md"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div
        className={`relative flex min-h-[100dvh] items-center justify-center transition-all duration-300 ${isLoading ? 'visible z-10 opacity-100' : 'invisible z-[-1] opacity-0'}`}
      >
        <Logo size={isDesktop ? 'xl' : 'lg'} isLoading />
      </div>
      <div
        className={`text-red absolute top-0 size-full transition-all duration-300 ${isLoading ? 'invisible z-[-1] opacity-0' : 'visible z-10 opacity-100'}`}
      >
        <div className="fixed left-0 h-full w-[300px] overflow-hidden rounded-4xl bg-[#E5E8F3]/60" >
        </div>
      </div>
    </div>
  );
}
