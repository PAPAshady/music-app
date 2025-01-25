import PropTypes from 'prop-types';
import { User } from 'iconsax-react';

export default function Avatar({ size, profilePic, disabled }) {
  const desktopHoverStyles = `border-2 border-transparent ${profilePic ? 'hover:border-white-50/50' : ''}`;

  const avatarSizes = {
    xs: 'size-8 hover:size-9',
    sm: 'size-10 hover:size-11',
    md: `size-20 ${desktopHoverStyles}`,
    lg: `size-40 ${desktopHoverStyles}`,
  };

  const avatarPaddings = {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-6',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full shadow-[2px_2px_7px_rgba(0,0,0,0.6)] transition-all duration-300 ${avatarSizes[size]} ${profilePic ? 'overflow-hidden' : ''}`}
    >
      {profilePic ? (
        <div className="relative size-full">
          <img src={profilePic} alt="User" className={`size-full`} />
          <div
            className={`absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 ${disabled ? 'bg-white-800/70' : 'bg-transparent'}`}
          ></div>
        </div>
      ) : (
        <div
          className={`hover:border-secondary-500 size-full overflow-hidden rounded-full border-2 ${disabled ? 'text-white-700 bg-white-800/75 border-white-700 hover:border-white-700' : 'text-secondary-50 bg-secondary-700/40 border-transparent'} ${avatarPaddings[size]}`}
        >
          <User size="100%" />
        </div>
      )}
    </div>
  );
}

Avatar.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']).isRequired,
  profilePic: PropTypes.string,
  disabled: PropTypes.bool,
};
