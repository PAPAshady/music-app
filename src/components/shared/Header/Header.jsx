import { memo } from 'react';
import { Link } from 'react-router-dom';
import { HamburgerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-reactjs';
import Logo from '../../Logo/Logo';
import Avatar from '../../Avatar/Avatar';
import NotificationMenu from '../NotificationMenu/NotificationMenu';
import IconButton from '../../Buttons/IconButton/IconButton';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import useCloseOnClickOutside from '../../../hooks/useCloseOnClickOutside';
import { useDispatch, useSelector } from 'react-redux';
import { openMobileSearchPanel } from '../../../redux/slices/mobileSearchPanelSlice';
import { setIsHamburgerMenuOpen } from '../../../redux/slices/hamburgerMenuSlice';
import DesktopSearchBox from '../../DesktopSearchBox/DesktopSearchBox';

export default memo(function Header() {
  const dispatch = useDispatch();
  const {
    isVisible: isNotificationMenuVisible,
    setIsVisible: setIsNotificationMenuVisible,
    setRef: setNotificationMenuRef,
  } = useCloseOnClickOutside();
  const { setRef: setMobileSearchBoxRef } = useCloseOnClickOutside();
  const {
    isVisible: isSettingsMenuVisible,
    setIsVisible: setIsSettingsMenuVisible,
    setRef: setSettingsMenuRef,
  } = useCloseOnClickOutside();
  const userAvatar = useSelector((state) => state.auth.avatar);
  const hasNotifications = useSelector((state) => state.notifications.length);

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => dispatch(setIsHamburgerMenuOpen(true))}
            icon={<HamburgerMenu />}
          />
          <div className="relative" ref={setMobileSearchBoxRef}>
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
          <div className="relative" ref={setNotificationMenuRef}>
            <IconButton
              onClick={() => setIsNotificationMenuVisible((prev) => !prev)}
              icon={<Notification />}
              isActive={isNotificationMenuVisible}
              showBadge={!!hasNotifications}
            />
            <NotificationMenu isVisible={isNotificationMenuVisible} />
          </div>
          <div ref={setSettingsMenuRef} className="relative">
            <IconButton
              icon={<Setting2 />}
              onClick={() => setIsSettingsMenuVisible((prev) => !prev)}
              isActive={isSettingsMenuVisible}
            />
            <SettingsMenu isVisible={isSettingsMenuVisible} />
          </div>
          <Link to="/settings/profile">
            <Avatar size="xs" profilePic={userAvatar} />
          </Link>
        </div>
      </div>
    </header>
  );
});
