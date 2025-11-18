import { memo } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import Logo from '../../Logo/Logo';
import Avatar from '../../Avatar/Avatar';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import IconButton from '../../Buttons/IconButton/IconButton';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside ';
import { useDispatch, useSelector } from 'react-redux';
import { openMobileSearchPanel } from '../../../redux/slices/mobileSearchPanelSlice';
import { setIsHamburgerMenuOpen } from '../../../redux/slices/hamburgerMenuSlice';
import DesktopSearchBox from '../../DesktopSearchBox/DesktopSearchBox';

export default memo(function Header() {
  const dispatch = useDispatch();
  const notificationMenu = useCloseOnClickOutside();
  const mobileSearchBox = useCloseOnClickOutside();
  const settingsMenu = useCloseOnClickOutside();
  const userAvatar = useSelector((state) => state.auth.avatar);
  const hasNotifications = useSelector((state) => state.notifications.length);

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
              onClick={() => dispatch(openMobileSearchPanel())}
            />
          </div>
        </div>
        <div>
          <Link className="block">
            <Logo size="sm" />
          </Link>
        </div>
      </div>
      <div className="hidden items-center justify-between lg:flex">
        <DesktopSearchBox />

        <div className="text-secondary-100 flex items-center gap-2">
          <div className="relative" ref={notificationMenu.ref}>
            <IconButton
              onClick={() => notificationMenu.setIsVisible((prev) => !prev)}
              icon={<Notification />}
              isActive={notificationMenu.isVisible}
              showBadge={!!hasNotifications}
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
          <Link to="/settings/profile">
            <Avatar size="xs" profilePic={userAvatar} />
          </Link>
        </div>
      </div>
    </header>
  );
});
