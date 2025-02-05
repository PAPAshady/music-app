import { cloneElement, memo } from 'react';
import { createPortal } from 'react-dom';
import useHamburgerMenu from '../../hooks/useHamburgerMenu';
import Avatar from '../Avatar/Avatar';
import {
  Heart,
  Home2,
  MusicFilter,
  MusicSquareSearch,
  Candle,
  Notification,
  Setting2,
  Medal,
  Messages3,
} from 'iconsax-react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const HamburgerMenu = memo(() => {
  const { isShowHamburgerMenu, setIsShowHamburgerMenu } = useHamburgerMenu();

  const mobileNavLinks = [
    { id: 1, title: 'Home', icon: <Home2 />, href: '/' },
    { id: 2, title: 'Favorites', icon: <Heart />, href: '/favorites' },
    { id: 3, title: 'Playlists', icon: <MusicFilter />, href: '/playlists' },
    { id: 4, title: 'Browse', icon: <MusicSquareSearch />, href: '/browse' },
  ];

  return createPortal(
    <div
      className={`fixed top-0 h-[100dvh] w-full bg-black/50 transition-[backdrop-filter,z-index] ${isShowHamburgerMenu ? 'z-30 backdrop-blur-xs' : 'z-[-1] backdrop-blur-[0]'}`}
      // close the menu if use clicks outside of menu box
      onClick={(e) => e.target === e.currentTarget && setIsShowHamburgerMenu(false)}
    >
      <div
        className={`bg-secondary-400/40 fixed h-full w-[250px] overflow-y-auto p-4 transition-transform ${isShowHamburgerMenu ? 'translate-0' : '-translate-x-full'}`}
      >
        <div className="">
          <div className="text-primary-300 mb-6 flex items-center justify-between">
            <button>
              <Avatar size="sm" />
            </button>
            <button>
              <Candle size={24} />
            </button>
          </div>
          <p className="text-white-50 text-lg">Olivia Rhye</p>

          <div className="my-9 flex flex-col gap-10">
            <div className="flex flex-col gap-7">
              <MobileNavLink title="Notifications" icon={<Notification />} />
              <MobileNavLink title="Settings" icon={<Setting2 />} />
            </div>
            <div className="border-secondary-400/53 flex flex-col gap-7 border-y py-10">
              {mobileNavLinks.map((link) => (
                <MobileNavLink key={link.id} {...link} />
              ))}
            </div>
            <div className="flex flex-col gap-7">
              <MobileNavLink title="Permium" href="/subscription" icon={<Medal />} />
              <MobileNavLink title="Q&A" href="/q&a" icon={<Messages3 />} />
            </div>
          </div>
          <Link to="#" className="text-primary-300 text-xs">
            Do You Need Quick Help?
          </Link>
        </div>
      </div>
    </div>,
    document.getElementById('hamburgerMenu')
  );
});

function MobileNavLink({ title, href, icon }) {
  const styledIcon = cloneElement(icon, { className: 'size-6' });
  return (
    <NavLink
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-2 py-1.5 ${href && isActive ? 'bg-secondary-300 text-white-50' : 'text-secondary-50'}`
      }
      to={href}
    >
      {styledIcon}
      <span>{title}</span>
    </NavLink>
  );
}

MobileNavLink.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  icon: PropTypes.element.isRequired,
};

HamburgerMenu.displayName = 'HamburgerMenu';
export default HamburgerMenu;
