import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import BgImage from '../../../assets/images/backgrounds/login-signup-page.jpg';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import {
  ArrowLeft,
  Menu,
  Play,
  Shuffle,
  Additem,
  Edit,
  RepeateOne,
  RepeateMusic,
} from 'iconsax-react';
import MainButton from '../../Buttons/MainButton/MainButton';
import IconButton from '../../Buttons/IconButton/IconButton';
import useMobilePlaylist from '../../../hooks/useMobilePlaylist';
import { BASE_URL } from '../../../services/api';
import useMusicPlayer from '../../../hooks/useMusicPlayer';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import useMediaQuery from '../../../hooks/useMediaQuery';
import Player from '../Player/Player';
import usePlaylistInfosModal from '../../../hooks/usePlaylistInfosModal';

export default function MobilePlaylist() {
  const [isTopbarVisible, setIsTopbarVisible] = useState(false);
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const { isMobilePlaylistOpen, closeMobilePlaylist } = useMobilePlaylist();
  const { setPlaylist, playState, togglePlayStates, selectedPlaylist } = useMusicPlayer();
  const { openPlaylistModal } = usePlaylistInfosModal();
  const playlistCover = selectedPlaylist.albumcover
    ? `${BASE_URL}/${selectedPlaylist.albumcover}`
    : playlistDefaultCover;

  // remove scrollbar for the body when mobile playlist is open
  useEffect(() => {
    if (isMobilePlaylistOpen) {
      document.body.classList.add('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMobilePlaylistOpen]);

  const handleScroll = (e) => {
    if (e.target.scrollTop <= 30) {
      setIsTopbarVisible(false);
    } else {
      setIsTopbarVisible(true);
    }
  };

  const playButtons = [
    { id: 1, icon: <Edit />, onClick: () => openPlaylistModal(`Edit ${selectedPlaylist.title}`) },
    { id: 2, icon: <Additem /> },
    { id: 3, icon: <Menu /> },
  ];

  return createPortal(
    <div
      className={`bg-primary-800 fixed inset-0 z-10 h-full min-h-[100dvh] w-full overflow-hidden transition-all duration-300 ${isMobilePlaylistOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div
        className="absolute size-full bg-cover bg-center bg-no-repeat opacity-15 blur-md"
        style={{ backgroundImage: `url(${BgImage})` }}
      ></div>

      <div
        className="text-secondary-50 relative container mx-auto h-[100dvh] overflow-y-auto py-12 min-[360px]:px-3 md:pb-4"
        onScroll={handleScroll}
      >
        <div
          className={`fixed top-0 left-0 z-[1] flex w-full items-center justify-between border-b-2 px-2 py-3 transition-all duration-300 ${isTopbarVisible ? 'border-neutral-700 bg-neutral-800' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3 sm:gap-6 sm:px-2 sm:py-1">
            <button className="size-6 sm:size-8" onClick={closeMobilePlaylist}>
              <ArrowLeft size="100%" />
            </button>
            <p
              className={`transition-opacity duration-300 lg:text-xl ${isTopbarVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {selectedPlaylist.title}
            </p>
          </div>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center min-[360px]:pb-12 min-[400px]:pb-16 sm:gap-5 sm:pb-22 md:pb-0 lg:gap-7">
          <img
            src={playlistCover}
            className="size-46 rounded-md sm:size-56 md:size-64 lg:size-80"
            alt={selectedPlaylist.title}
          />
          <p className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {selectedPlaylist.title}
          </p>
          <p className="line-clamp-2 min-h-[45px] w-[90%] text-sm sm:text-base lg:text-lg">
            {selectedPlaylist.description || 'No Description for this playlist.'}
          </p>
          <div className="mt-3 flex w-full items-center justify-between gap-2 lg:px-8">
            <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
              <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px] sm:h-12 sm:w-9">
                <img src={BgImage} className="size-full rounded-sm" />
              </button>
              {playButtons.map((button) => (
                <IconButton key={button.id} classNames="sm:size-9 md:size-10" {...button} />
              ))}
            </div>
            <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
              <IconButton
                icon={
                  playState === 'shuffle' ? (
                    <Shuffle />
                  ) : playState === 'repeat_one' ? (
                    <RepeateOne />
                  ) : (
                    <RepeateMusic />
                  )
                }
                classNames="sm:size-9 md:size-10"
                onClick={togglePlayStates}
              />
              <MainButton
                classNames="size-12 sm:size-14 md:size-20 !rounded-full flex justify-center items-center"
                title={<Play size={isTablet ? 32 : 24} />}
                onClick={() => setPlaylist(selectedPlaylist)}
              />
            </div>
          </div>
          <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
            {selectedPlaylist.musics?.map((music) => (
              <PlayBar
                key={music.id}
                size={isLargeMobile ? 'lg' : 'md'}
                classNames="!w-full text-start !max-w-none"
                {...music}
              />
            ))}
          </div>
          {/*
              conditionally rendering the <Player> component based on `isMobilePlaylistOpen` improves performance by preventing unnecessary re-renders when MobilePlaylist is closed and is not visible by user.
            */}
          {isMobilePlaylistOpen && <Player classNames="text-start !w-full" />}
        </div>
      </div>
    </div>,
    document.getElementById('mobilePlaylist')
  );
}
