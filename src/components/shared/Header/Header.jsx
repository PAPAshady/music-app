import { memo } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import useHamburgerMenu from '../../../hooks/useHamburgerMenu';
import useInput from '../../../hooks/useInput';
import Logo from '../../Logo/Logo';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Avatar from '../../Avatar/Avatar';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import IconButton from '../../Buttons/IconButton/IconButton';
import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside ';
import profileImg from '../../../assets/images/Avatar/profile-pic.jpg';

export default memo(function Header() {
  const { setIsShowHamburgerMenu } = useHamburgerMenu();
  const searchInput = useInput();
  const notificationMenu = useCloseOnClickOutside();
  const mobileSearchBox = useCloseOnClickOutside();

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <IconButton onClick={() => setIsShowHamburgerMenu(true)} icon={<HambergerMenu />} />
          <div className="relative" ref={mobileSearchBox.ref}>
            <IconButton
              icon={<SearchNormal1 />}
              onClick={() => mobileSearchBox.setIsVisible((prev) => !prev)}
              isActive={mobileSearchBox.isVisible}
            />
            <div
              className={`absolute z-10 transition-all duration-300 ${mobileSearchBox.isVisible ? 'visible top-[110%] opacity-100' : 'invisible top-[150%] opacity-0'}`}
            >
              <SearchInput classNames="backdrop-blur-sm" {...searchInput} />
            </div>
          </div>
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
          <div className="relative" ref={notificationMenu.ref}>
            <IconButton
              onClick={() => notificationMenu.setIsVisible((prev) => !prev)}
              icon={<Notification />}
              isActive={notificationMenu.isVisible}
            />
            <NotificationMenu isVisible={notificationMenu.isVisible} />
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
