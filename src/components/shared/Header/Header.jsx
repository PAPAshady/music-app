import { memo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import useHamburgerMenu from '../../../hooks/useHamburgerMenu';
import useInput from '../../../hooks/useInput';
import Logo from '../../Logo/Logo';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Avatar from '../../Avatar/Avatar';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import IconButton from '../../Buttons/IconButton/IconButton';
import profileImg from '../../../assets/images/Avatar/profile-pic.jpg';

export default memo(function Header() {
  const [isNotificationMenuVisible, setIsNotificationMenuVisible] = useState(false);
  const { setIsShowHamburgerMenu } = useHamburgerMenu();
  const searchInput = useInput();
  const notificationMenuRef = useRef(null);

  // Close notification menu when user clicks outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationMenuVisible(false);
      }
    };

    if (isNotificationMenuVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isNotificationMenuVisible]);

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <IconButton clickHandler={() => setIsShowHamburgerMenu(true)} icon={<HambergerMenu />} />
          <IconButton icon={<SearchNormal1 />} />
        </div>
        <div>
          <Link className="block">
            <Logo size="sm" />
          </Link>
        </div>
      </div>
      <div className="hidden items-center justify-between lg:flex">
        <div>
          <SearchInput {...searchInput} />
        </div>
        <div className="text-secondary-100 flex items-center gap-2">
          <div className="relative" ref={notificationMenuRef}>
            <IconButton
              clickHandler={() => setIsNotificationMenuVisible((prev) => !prev)}
              icon={<Notification />}
              isActive={isNotificationMenuVisible}
            />
            <NotificationMenu isVisible={isNotificationMenuVisible} />
          </div>
          <IconButton icon={<Setting2 />} />
          <button>
            <Avatar size="xs" profilePic={profileImg} />
          </button>
        </div>
      </div>
    </header>
  );
});
