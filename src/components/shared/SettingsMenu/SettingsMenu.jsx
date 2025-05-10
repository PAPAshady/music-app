import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../Avatar/Avatar';
import { NavLink } from 'react-router-dom';
import { UserEdit, Chart, Headphone, Messages, Login } from 'iconsax-react';
import AuthContext from '../../../contexts/AuthContext';
import useSafeContext from '../../../hooks/useSafeContext';

export default function SettingsMenu({ isVisible }) {
  const { logOut, user } = useSafeContext(AuthContext);

  const listItems = [
    { id: 1, title: 'Edit Profile', icon: <UserEdit />, href: '/settings/profile' },
    { id: 2, title: 'Analytics', icon: <Chart />, href: '/settings/analytics' },
    { id: 3, title: 'Contact Us', icon: <Headphone />, href: '/settings/contact-us' },
    { id: 4, title: 'FAQ', icon: <Messages />, href: '/settings/FAQ' },
  ];

  return (
    <div
      className={`bg-primary-800/60 absolute right-0 z-10 flex w-[230px] flex-col gap-6 rounded-[20px] border p-5 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'visible top-[130%] opacity-100' : 'invisible top-[170%] opacity-0'}`}
    >
      <div className="px-2">
        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <Avatar size="sm" />
          <p className="truncate" title={`${user.first_name} ${user.last_name}`}>
            {user.first_name} {user.last_name}
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-4">
        {listItems.map((item) => (
          <ListItem key={item.id} {...item} />
        ))}

        <li className="text-primary-50 hover:text-primary-200 transition-colors">
          <button className="flex items-center gap-2 text-base" onClick={logOut}>
            <Login />
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

function ListItem({ title, href = '#', icon }) {
  const styledIcon = cloneElement(icon, { size: 24 });
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `hover:text-primary-200 flex items-center gap-2 transition-colors ${isActive ? 'text-primary-300' : 'text-primary-50'}`
        }
        to={href}
      >
        {styledIcon}
        {title}
      </NavLink>
    </li>
  );
}

SettingsMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

ListItem.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string,
  icon: PropTypes.element.isRequired,
};
