import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { HambergerMenu, SearchNormal1, Notification, Setting2 } from 'iconsax-react';
import Logo from '../../Logo/Logo';
import SearchInput from '../../SearchInput/SearchInput';
import Avatar from '../../Avatar/Avatar';
import profileImg from '../../../assets/images/Avatar/profile-pic.jpg';

export default memo(function Header() {
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSearchInputChange = useCallback((newValue) => {
    setSearchInputValue(newValue);
  }, []);

  return (
    <header>
      <div className="flex items-center justify-between lg:hidden">
        <div className="text-primary-50 flex items-center gap-2">
          <button>
            <HambergerMenu className="sm:size-8" />
          </button>
          <button>
            <SearchNormal1 className="sm:size-8" />
          </button>
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
          <button>
            <Notification size={32} />
          </button>
          <button>
            <Setting2 size={32} />
          </button>
          <button>
            <Avatar size="xs" profilePic={profileImg} />
          </button>
        </div>
      </div>
    </header>
  );
});
