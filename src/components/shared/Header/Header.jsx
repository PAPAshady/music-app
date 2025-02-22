import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import useHamburgerMenu from '../../../hooks/useHamburgerMenu';
import Logo from '../../Logo/Logo';
import SearchInput from '../../Inputs/SearchInput/SearchInput';
import Avatar from '../../Avatar/Avatar';
import IconButton from '../../Buttons/IconButton/IconButton';
import profileImg from '../../../assets/images/Avatar/profile-pic.jpg';

export default memo(function Header() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const { setIsShowHamburgerMenu } = useHamburgerMenu();

  const handleSearchInputChange = useCallback((newValue) => {
    setSearchInputValue(newValue);
  }, []);

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
          <SearchInput value={searchInputValue} onChangeHandler={handleSearchInputChange} />
        </div>
        <div className="text-secondary-100 flex items-center gap-2">
          <IconButton icon={<Notification />} />
          <IconButton icon={<Setting2 />} />
          <button>
            <Avatar size="xs" profilePic={profileImg} />
          </button>
        </div>
      </div>
    </header>
  );
});
