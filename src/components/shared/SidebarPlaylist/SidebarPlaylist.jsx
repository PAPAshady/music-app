import { cloneElement } from 'react';
import { Music, Timer, User, Edit2, Trash, Share } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import DropDownList from '../../DropDownList/DropDownList';
import { BASE_URL } from '../../../services/api';
import defaultCover from '../../../assets/images/covers/no-cover.jpg';
import useMusicPlayer from '../../../hooks/useMusicPlayer';
import usePlaylistInfosModal from '../../../hooks/usePlaylistInfosModal';

export default function SidebarPlaylist() {
  const { selectedPlaylist: playlist } = useMusicPlayer();
  const { setIsOpen, setModalTitle } = usePlaylistInfosModal();
  const playlistCover = playlist.albumcover ? `${BASE_URL}/${playlist.albumcover}` : defaultCover;

  const playlistInfosArray = [
    {
      id: 1,
      title: `${playlist.musics?.length ?? 'No'} Track${playlist.musics?.length > 1 ? 's' : ''}`,
      icon: <Music />,
    },
    { id: 2, title: '01:11:58', icon: <Timer /> },
    { id: 3, title: playlist.artists?.[0].name ?? 'No Artist', icon: <User /> },
  ];

  const openEditPlaylistModal = () => {
    setModalTitle(`Edit ${playlist.title} infos.`);
    setIsOpen(true);
  };

  const playlistDropDownListItems = [
    {
      id: 1,
      icon: <Edit2 />,
      title: 'Edit playlist',
      onClick: openEditPlaylistModal,
    },
    { id: 2, icon: <Trash />, title: 'Delete playlist' },
    { id: 3, icon: <Share />, title: 'Share' },
  ];

  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
        <div className="flex items-center justify-between gap-1">
          <p
            className="text-white-50 subheading-3 truncate"
            title={playlist.title || 'Select a playlist'}
          >
            {playlist.title || 'Select a playlist'}
          </p>
          <DropDownList menuItems={playlistDropDownListItems} dropDownPlacement="bottom end" />
        </div>

        <div className="my-6 flex gap-2">
          <div className="group relative overflow-hidden rounded-[10px]">
            <img
              src={playlistCover}
              alt={playlist.title || 'Select a playlist'}
              className="size-32 object-cover xl:size-[140px]"
            />
            <button
              onClick={openEditPlaylistModal}
              className="absolute top-0 flex size-full flex-col items-center justify-center gap-3 bg-[black]/40 p-3 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="size-9">
                <Edit2 size="100%" />
              </span>
              <p className="font-semibold">Edit Playlist</p>
            </button>
          </div>
          <div className="flex flex-col">
            {playlistInfosArray.map((info) => (
              <PlaylistInfo key={info.id} {...info} />
            ))}
          </div>
        </div>

        <div id="playlist-songs-wrapper" className="flex grow flex-col gap-2 overflow-y-auto pe-2">
          {playlist.musics?.map((song) => (
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
