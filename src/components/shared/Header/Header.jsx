import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import useInput from '../../../hooks/useInput';
import Logo from '../../Logo/Logo';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Avatar from '../../Avatar/Avatar';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import IconButton from '../../Buttons/IconButton/IconButton';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside ';
import { useDispatch } from 'react-redux';
import { setIsHamburgerMenuOpen } from '../../../redux/slices/hamburgerMenuSlice';

export default memo(function Header() {
  const dispatch = useDispatch();
  const searchInput = useInput();
  const notificationMenu = useCloseOnClickOutside();
  const mobileSearchBox = useCloseOnClickOutside();
  const settingsMenu = useCloseOnClickOutside();
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => dispatch(setIsHamburgerMenuOpen(true))}
            icon={<HambergerMenu />}
          />
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
        <div className="relative w-full">
          <div
            className={`relative z-30 transition-all ${isSearchBarFocused ? 'w-[70%]' : 'w-[315px]'}`}
          >
            <SearchInput
              {...searchInput}
              onFocus={() => setIsSearchBarFocused(true)}
              onBlur={() => setIsSearchBarFocused(false)}
            />
            <div
              className={`absolute z-[-1] -mt-4 max-h-[450px] w-full rounded-md bg-gradient-to-b from-slate-800 to-slate-700 px-4 py-7 transition duration-100 ${isSearchBarFocused ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
            ></div>
          </div>
          <div
            className={`fixed inset-0 size-full transition-all ${isSearchBarFocused && 'z-20 bg-black/50'}`}
          ></div>
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
          <div ref={settingsMenu.ref} className="relative">
            <IconButton
              icon={<Setting2 />}
              onClick={() => settingsMenu.setIsVisible((prev) => !prev)}
              isActive={settingsMenu.isVisible}
            />
            <SettingsMenu isVisible={settingsMenu.isVisible} />
          </div>
          <button>
            <Avatar size="xs" />
          </button>
        </div>
      </div>
    </header>
  );
});
