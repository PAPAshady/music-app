import SidebarPlaylist from '../../../SidebarPlaylist/SidebarPlaylist';
import { Outlet, NavLink } from 'react-router-dom';
import { songs } from '../../../../data';

export default function SettingsLayout() {
  const navLinks = [
    { id: 1, title: 'Profile', href: 'profile' },
    { id: 2, title: 'Analytics', href: 'analytics' },
    { id: 3, title: 'Contact Us', href: 'contact-us' },
    { id: 4, title: 'F&Q', href: 'f&q' },
  ];

  return (
    <div className="flex w-full items-start gap-6">
      <div className="grow">
        <div className="xs:gap-2 mb-8 flex items-center gap-1 min-[480px]:gap-3">
          {navLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `xs:text-sm rounded-md p-2 px-3 text-xs font-semibold sm:text-base lg:text-base ${isActive ? 'text-white-50 bg-secondary-300/64' : 'text-primary-100'}`
              }
              key={link.id}
              to={link.href}
            >
              {link.title}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}
