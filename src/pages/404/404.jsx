import Header from '../../components/shared/Header/Header';
import Logo from '../../components/Logo/Logo';
import { Link } from 'react-router-dom';
import DesktopNavbar from '../../components/shared/DesktopNavbar/DesktopNavbar';
import { useState, useEffect } from 'react';
import desktopBgImage from '../../assets/images/backgrounds/404-page-desktop.jpg';
import mobileBgImage from '../../assets/images/backgrounds/404-page-mobile.jpg';
import TextField from '../../components/Inputs/TextField/TextField';
import { SearchNormal1 } from 'iconsax-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import useMediaQuery from '../../hooks/useMediaQuery';

const schema = z.object({
  search: z.string().min(1, { message: 'Please provide a keyword.' }),
});

function NotFoundPage() {
  const [showDesktopLogoNavbar, setShowDesktopLogoNavbar] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { search: '' }, resolver: zodResolver(schema) });

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

  const onSubmit = () => {
    console.log('Submitted successfully!');
  };

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
          <div className="flex w-full grow flex-col items-center justify-center gap-4 px-2 pt-24 pb-42 text-center lg:gap-6 lg:px-10 lg:pb-26">
            <h1 className="font-bold">404</h1>
            <p className="sm:text-lg lg:text-2xl">Sorry, we were unable to find that page :(</p>
            <form
              className="mt-4 flex w-full flex-col items-center gap-6 sm:w-4/5 lg:max-w-[720px]"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                type="text"
                icon={<SearchNormal1 />}
                placeholder="Search"
                value={watch('search')}
                isInvalid={!!errors.search}
                errorMsg={errors.search?.message}
                {...register('search')}
              />
              <MainButton
                title={isSubmitting ? 'Searching...' : 'Search'}
                size="lg"
                variant="secondary"
                disabled={isSubmitting}
              />
            </form>
            <p className="mt-2">
              Start from{' '}
              <Link className="hover:text-secondary-100 underline" to="/">
                Home page
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

export default NotFoundPage;
