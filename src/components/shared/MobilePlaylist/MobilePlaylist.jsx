import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import { ArrowLeft, Menu, Play, Shuffle, Additem, ArrowCircleDown2 } from 'iconsax-react';
import MainButton from '../../Buttons/MainButton/MainButton';
import PropTypes from 'prop-types';
import IconButton from '../../Buttons/IconButton/IconButton';
import useMobilePlaylist from '../../../hooks/useMobilePlaylist';
import { BASE_URL } from '../../../services/api';
import useMusicPlayer from '../../../hooks/useMusicPlayer';

export default function MobilePlaylist({ isOpen, onClose }) {
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);
  const { selectedPlaylist: playlist } = useMobilePlaylist();
  const { setPlaylist } = useMusicPlayer();

  // remove scrollbar for the body when mobile playlist is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  const handleScroll = (e) => {
    if (e.target.scrollTop <= 30) {
      setIsTopbarVisible(false);
    } else {
      setIsTopbarVisible(true);
    }
  };

  const playButtons = [
    { id: 1, icon: <ArrowCircleDown2 /> },
    { id: 2, icon: <Additem /> },
    { id: 3, icon: <Menu /> },
  ];

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-10 h-full min-h-[100dvh] w-full overflow-hidden transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-15 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 relative container mx-auto h-[100dvh] max-w-[450px] overflow-y-auto py-12"
        onScroll={handleScroll}
      >
        <div
          className={`fixed top-0 left-0 flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <button onClick={onClose}>
              <ArrowLeft size={24} />
            </button>
            <p
              className={`transition-opacity duration-300 ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {playlist.title}
            </p>
          </div>
          <button className="">
            <Menu size={24} />
          </button>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center gap-4 pt-10 text-center">
            <img
              src={`${BASE_URL}/${playlist.albumcover}`}
              className="size-46 rounded-md"
              alt={playlist.title}
            />
            <p className="text-2xl font-semibold text-white">{playlist.title}</p>
            <p className="line-clamp-2 text-sm">
              {playlist.description || 'No Description for this playlist.'}
            </p>
            <div className="mt-3 flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-3.5">
                <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px]">
                  <img src={BgImage} className="size-full rounded-sm" />
                </button>
                {playButtons.map((button) => (
                  <IconButton icon={button.icon} key={button.id} />
                ))}
              </div>
              <div className="flex items-center gap-3.5">
                <IconButton icon={<Shuffle />} />
                <MainButton
                  classNames="size-12 !rounded-full flex justify-center items-center"
                  title={<Play size={24} />}
                  onClick={() => setPlaylist(playlist)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('mobilePlaylist')
  );
}

MobilePlaylist.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
