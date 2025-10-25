import { Outlet, NavLink } from 'react-router-dom';

export default function SettingsLayout() {
  const navLinks = [
    { id: 1, title: 'Profile', href: 'profile' },
    { id: 2, title: 'Analytics', href: 'analytics' },
    { id: 3, title: 'Contact Us', href: 'contact-us' },
    { id: 4, title: 'FAQ', href: 'FAQ' },
  ];

  return (
    <div className="grow">
      <div className="xs:gap-2 mb-8 flex items-center gap-1 min-[480px]:gap-3">
        {navLinks.map((link) => (
          <NavLink
            className={({ isActive }) =>
              `xs:text-sm rounded-md p-2 px-3 text-xs font-semibold transition-colors duration-300 sm:text-base lg:text-base ${isActive ? 'text-white-50 bg-secondary-300/64' : 'text-primary-100'}`
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
  );
}
