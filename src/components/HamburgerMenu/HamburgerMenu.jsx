import { cloneElement, memo } from 'react';
import { createPortal } from 'react-dom';
import useHamburgerMenu from '../../hooks/useHamburgerMenu';
import {
  Heart,
  Home2,
  MusicFilter,
  MusicSquareSearch,
  CloseCircle,
  Medal,
  Messages3,
} from 'iconsax-react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const HamburgerMenu = memo(() => {
  const { isShowHamburgerMenu, setIsShowHamburgerMenu } = useHamburgerMenu();

  const mobileNavLinks = [
    { id: 1, title: 'Home', href: '/', icon: <Home2 /> },
    { id: 2, title: 'Favorites', href: '/favorites', icon: <Heart /> },
    { id: 3, title: 'Playlists', href: '/playlist', icon: <MusicFilter /> },
    { id: 4, title: 'Browse', href: '/browse', icon: <MusicSquareSearch /> },
  ];

  return createPortal(
    <div
      className={`absolute top-0 h-[100dvh] w-full bg-black/50 transition-all ${isShowHamburgerMenu ? 'z-30 backdrop-blur-xs' : 'z-[-1] backdrop-blur-[0]'}`}
      // close the menu if use clicks outside of menu box
      onClick={(e) => e.target === e.currentTarget && setIsShowHamburgerMenu(false)} 
    >
      <div
        className={`bg-secondary-700/88 fixed h-full w-[250px] p-4 transition-transform ${isShowHamburgerMenu ? 'translate-0' : '-translate-x-full'}`}
      >
        <button className="ms-auto mb-4 block" onClick={() => setIsShowHamburgerMenu(false)}>
          <CloseCircle size={32} className="text-secondary-50" />
        </button>
        <div className="flex h-[calc(100%-48px)] flex-col justify-between">
          <div className="flex grow-1 flex-col gap-4">
            {mobileNavLinks.map((link) => (
              <MobileNavLink key={link.id} {...link} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <MobileNavLink title="Permium" href="/subscription" icon={<Medal />} />
            <MobileNavLink title="Q&A" href="/q&a" icon={<Messages3 />} />
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('hamburgerMenu')
  );
});

function MobileNavLink({ title, href, icon }) {
  const styledIcon = cloneElement(icon, { className: 'size-8' });
  return (
    <NavLink
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg p-1.5 text-lg ${isActive ? 'bg-secondary-300 text-white-50' : 'text-secondary-50'}`
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
  href: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

HamburgerMenu.displayName = 'HamburgerMenu';
export default HamburgerMenu;
