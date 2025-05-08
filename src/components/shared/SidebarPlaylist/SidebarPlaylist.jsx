import { cloneElement } from 'react';
import { Music, Timer, User, Edit2, Trash, Share, Play, Pause } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import DropDownList from '../../DropDownList/DropDownList';
import { BASE_URL } from '../../../services/api';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import useMusicPlayer from '../../../hooks/useMusicPlayer';
import usePlaylistInfosModal from '../../../hooks/usePlaylistInfosModal';

export default function SidebarPlaylist() {
  const { selectedPlaylist, setPlaylist, playlist, isPlaying, play, pause } = useMusicPlayer();
  const { openPlaylistModal } = usePlaylistInfosModal();
  const playlistCover = selectedPlaylist.albumcover
    ? `${BASE_URL}/${selectedPlaylist.albumcover}`
    : defaultCover;
  const isPlayingPlaylistSelected =
    playlist.id === selectedPlaylist.id && playlist.title === selectedPlaylist.title;

  const playlistInfosArray = [
    {
      id: 1,
      title: `${selectedPlaylist.musics?.length ?? 'No'} Track${selectedPlaylist.musics?.length > 1 ? 's' : ''}`,
      icon: <Music />,
    },
    { id: 2, title: '01:11:58', icon: <Timer /> },
    { id: 3, title: selectedPlaylist.artists?.[0].name ?? 'No Artist', icon: <User /> },
  ];

  const playlistDropDownListItems = [
    {
      id: 1,
      icon: <Edit2 />,
      title: 'Edit playlist',
      onClick: () => openPlaylistModal(`Edit ${selectedPlaylist.title}`),
    },
    { id: 2, icon: <Trash />, title: 'Delete playlist' },
    { id: 3, icon: <Share />, title: 'Share' },
  ];

  const playPauseButtonHandler = () => {
    if (!isPlayingPlaylistSelected) {
      setPlaylist(selectedPlaylist);
      return;
    }
    isPlaying ? pause() : play();
  };

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <div className="flex items-center justify-between gap-1">
          <p
            className="text-white-50 subheading-3 truncate"
            title={selectedPlaylist.title || 'Select a playlist'}
          >
            {selectedPlaylist.title || 'Select a playlist'}
          </p>
          <DropDownList menuItems={playlistDropDownListItems} dropDownPlacement="bottom end" />
        </div>

        <div className="my-6 flex gap-2">
          <div className="group relative overflow-hidden rounded-[10px]">
            <img
              src={playlistCover}
              alt={selectedPlaylist.title || 'Select a playlist'}
              className="size-32 object-cover xl:size-[140px]"
            />
            <div
              className={`absolute inset-0 flex size-full items-center justify-center p-3 transition-opacity duration-300 ${!isPlayingPlaylistSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
            >
              <button
                className="bg-primary-500/80 flex size-15 items-center justify-center rounded-full border"
                onClick={playPauseButtonHandler}
              >
                <span className="text-secondary-50 block size-7">
                  {isPlaying && isPlayingPlaylistSelected ? (
                    <Pause size="100%" />
                  ) : (
                    <Play size="100%" />
                  )}
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            {playlistInfosArray.map((info) => (
              <PlaylistInfo key={info.id} {...info} />
            ))}
          </div>
        </div>

        <div id="playlist-songs-wrapper" className="flex grow flex-col gap-2 overflow-y-auto pe-2">
          {selectedPlaylist.musics?.map((song) => (
            <PlayBar key={song.id} size="sm" {...song} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistInfo({ title, icon }) {
  const styledIcon = cloneElement(icon, { size: 18 });
  return (
    <div className="flex grow items-center gap-1">
      {styledIcon}
      <span className="max-w-[90px] truncate text-sm xl:text-base">{title}</span>
    </div>
  );
}

PlaylistInfo.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};
