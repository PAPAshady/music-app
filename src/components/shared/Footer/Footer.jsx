import Logo from '../../Logo/Logo';
import TextField from '../../Inputs/TextField/TextField';
import MainButton from '../../Buttons/MainButton/MainButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Sms } from 'iconsax-react';
import instagramImg from '../../../assets/images/socials/instagram.png';
import twitterImg from '../../../assets/images/socials/twitter.png';
import facebookImg from '../../../assets/images/socials/facebook.png';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';

const formSchema = z.object({
  email: z.string().email({ message: 'Please provide an valid email' }),
});

export default function Footer() {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width:1024px)');
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' }, resolver: zodResolver(formSchema) });

  const headerLinks = [
    {
      id: 1,
      mainTitle: 'Main Links',
      links: [
        { id: 1, href: '/settings/profile', title: 'Profile' },
        { id: 2, href: '/settings/contact-us', title: 'Contact Us' },
        { id: 3, href: '/settings/FAQ', title: 'FAQ' },
        { id: 4, href: '/settings/analytics', title: 'Analytics' },
      ],
    },
    {
      id: 2,
      mainTitle: 'Categories',
      links: [
        { id: 1, href: '/favorites', title: 'Your favorites' },
        { id: 2, href: '/playlists', title: 'Playlists' },
        { id: 3, href: '/browse', title: 'Browse' },
      ],
    },
    {
      id: 3,
      mainTitle: 'Main Links',
      links: [
        { id: 1, href: '/settings/profile', title: 'Profile' },
        { id: 2, href: '/settings/contact-us', title: 'Contact Us' },
        { id: 3, href: '/settings/FAQ', title: 'FAQ' },
        { id: 4, href: '/settings/analytics', title: 'Analytics' },
      ],
    },
  ];

  const submitHandler = async () => {
    dispatch(showNewSnackbar({ message: 'Subscribed successfully', type: 'success' }));
    reset();
  };

  return (
    <>
      <footer className="bg-primary-50/10 border-primary-200 w-full rounded-4xl border px-3 py-6 min-[420px]:p-6 lg:p-6">
        <div className="!container !w-[90%]">
          <div className="flex flex-col gap-10 md:flex-row md:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4">
              <Logo size={isDesktop ? 'lg' : 'md'} row={isDesktop ? true : false} />
              <div className="lg:text-star lg:text-star mx-auto max-w-[310px] text-center">
                <p className="text-primary-50 mb-2 text-sm sm:text-base lg:text-lg">
                  Welcome to VioTune!
                </p>
                <p className="text-primary-200 text-xs sm:text-sm lg:text-base">
                  At Echo Stream, we are passionate about bringing music closer to you.{' '}
                </p>
              </div>
            </div>
            <div className="mx-auto flex w-full justify-between gap-2 sm:max-w-[600px] md:max-w-none lg:m-0 lg:max-w-[580px]">
              {headerLinks.map((link) => (
                <HeaderLinksWrapper key={link.id} headerLink={link} />
              ))}
            </div>
          </div>
          <div className="bg-primary-50/50 mx-auto my-6 hidden h-[1px] w-full items-center justify-between lg:flex">
            <span className="bg-primary-50 size-[3px] rotate-45"></span>
            <span className="bg-primary-50 size-[3px] rotate-45"></span>
          </div>
          <div className="mt-10 items-end justify-between sm:flex sm:gap-4">
            <div className="mb-6 grow-[0.5] sm:m-0">
              <p className="text-primary-200 mb-6 text-sm">
                Enter your email to receive the latest news.
              </p>
              <form
                className="flex flex-col items-center gap-3 pt-4 min-[480px]:flex-row"
                onSubmit={handleSubmit(submitHandler)}
              >
                <TextField
                  type="email"
                  icon={<Sms />}
                  placeholder="Email"
                  value={watch('email')}
                  isInvalid={!!errors.email}
                  errorMsg={errors.email?.message}
                  {...register('email')}
                />
                <div className="w-full min-[480px]:w-auto">
                  <MainButton
                    title={isSubmitting ? 'Submitting...' : 'Subscribe'}
                    size="sm"
                    variant="secondary"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-center gap-6 sm:gap-4">
              <span className="text-primary-200 text-sm font-bold sm:text-base">Follow Us</span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/nima.jsx?igsh=MTlhYmFma2lyc2NoZQ=="
                  target="_blank"
                >
                  <img className="size-8" src={instagramImg} alt="Instagram" />
                </a>
                <a
                  href="https://www.instagram.com/nima.jsx?igsh=MTlhYmFma2lyc2NoZQ=="
                  target="_blank"
                >
                  <img className="size-8" src={twitterImg} alt="Twitter" />
                </a>
                <a
                  href="https://www.instagram.com/nima.jsx?igsh=MTlhYmFma2lyc2NoZQ=="
                  target="_blank"
                >
                  <img className="size-8" src={facebookImg} alt="Facebook" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function HeaderLinksWrapper({ headerLink }) {
  return (
    <div className="grow text-center">
      <span className="text-primary-50 mb-2 block lg:text-xl">{headerLink.mainTitle}</span>
      <ul className="flex flex-col items-center gap-2 text-center">
        {headerLink.links.map((link) => (
          <li key={link.id}>
            <Link
              className="text-secondary-200 block text-xs min-[365px]:text-sm lg:text-base"
              to={link.href}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

HeaderLinksWrapper.propTypes = {
  headerLink: PropTypes.shape({
    id: PropTypes.number.isRequired,
    mainTitle: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        href: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
};
