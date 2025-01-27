import { NavLink } from 'react-router-dom';
import { Home2, Heart, MusicFilter, MusicSquareSearch, Medal, Messages3 } from 'iconsax-react';
import PropTypes from 'prop-types';

export default function DesktopNavbar() {
  const navLinks = [
    { id: 1, href: '/', icon: <Home2 /> },
    { id: 2, href: '/favorites', icon: <Heart /> },
    { id: 3, href: '/playlist', icon: <MusicFilter /> },
    { id: 4, href: '/browse', icon: <MusicSquareSearch /> },
  ];

  document.body.style.background = '#152740';

  return (
    <div className="border-primary-50 bg-secondary-400/40 relative inline-flex flex-col items-center justify-between rounded-lg border px-2.5 py-3">
      <div className="flex flex-col gap-4 pb-[300px]">
        {navLinks.map((link) => (
          <DesktopNavLink key={link.id} {...link} />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <DesktopNavLink href="/subscription" icon={<Medal />} />
        <DesktopNavLink href="/messages" icon={<Messages3 />} />
      </div>
    </div>
  );
}

function DesktopNavLink({ icon, href }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex size-8 items-center justify-center rounded-lg border border-transparent transition-colors duration-300 ${isActive ? 'text-primary-900 bg-primary-50' : 'text-primary-50 hover:scale-110'}`
      }
      to={href}
    >
      {icon}
    </NavLink>
  );
}

DesktopNavLink.propTypes = {
  icon: PropTypes.element.isRequired,
  href: PropTypes.string.isRequired,
};
