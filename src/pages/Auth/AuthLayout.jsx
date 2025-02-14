import { useEffect, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import bgImg from '../../assets/images/backgrounds/login-signup-page.jpg';
import './AuthLayout.css';

export default function Authentication() {
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = useLocation().pathname.split('/')[2];
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isSignUpPage = currentPath === 'sign-up';

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 3000);
  }, []);

  return (
    <div className="bg-primary-800 relative h-[100dvh]">
      <div
        className="absolute size-full bg-cover bg-top bg-no-repeat opacity-50 blur-md"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div>
        <div
          className={`relative flex h-[100dvh] items-center justify-center transition-all duration-300 ${isLoading ? 'visible z-10 opacity-100' : 'invisible z-[-1] opacity-0'}`}
        >
          <Logo size={isDesktop ? 'xl' : 'lg'} isLoading />
        </div>
        <div
          className={`absolute top-0 flex size-full transition-all duration-300 ${isLoading ? 'invisible z-[-1] size-0 opacity-0' : 'visible z-10 opacity-100'}`}
        >
          <div className="relative hidden w-[300px] overflow-hidden rounded-4xl lg:block">
            <div
              className={`mask-layer mask-1 absolute size-full bg-[#E5E8F3]/50 transition-opacity ${isSignUpPage ? 'opacity-0' : 'opacity-100'}`}
            ></div>
            <div
              className={`mask-layer mask-2 absolute size-full bg-[#E5E8F3]/50 transition-opacity ${isSignUpPage ? 'opacity-100' : 'opacity-0'}`}
            ></div>
            <NavLink
              className={({ isActive }) =>
                `absolute top-[36.3%] right-0 py-[15px] ps-7 pe-3.5 text-[28px] font-semibold ${isActive ? 'text-primary-50' : 'text-primary-700'}`
              }
              to="sign-in"
            >
              Sign In
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `absolute top-[49.5%] right-[-1%] rounded-s-[17px] py-[14px] ps-[14px] pe-3 text-[28px] font-semibold ${isActive ? 'text-primary-50' : 'text-primary-700'}`
              }
              to="sign-up"
            >
              Sign Up
            </NavLink>
          </div>
          <div className="flex grow items-center justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
