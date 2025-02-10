import { cloneElement } from 'react';
import { Menu, Music, Timer, User } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlaylistImg from '../../assets/images/backgrounds/login-signup page.jpg';
import PlayBar from '../MusicCards/PlayBar/PlayBar';

export default function SidebarPlaylist({ playList }) {
  const PlaylistInfosArray = [
    { id: 1, title: `${playList.length} Tracks`, icon: <Music /> },
    { id: 2, title: '01:11:58', icon: <Timer /> },
    { id: 3, title: 'Rayan', icon: <User /> },
  ];

  return (
    <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border px-3 pt-5 pb-4 xl:w-[310px]">
      <div className="flex items-center justify-between gap-1">
        <p className="text-white-50 subheading-3 truncate">Sad playlist</p>
        <button className="text-secondary-50">
          <Menu />
        </button>
      </div>

      <div className="my-6 flex gap-2">
        <div>
          <img
            src={PlaylistImg}
            alt=""
            className="size-32 rounded-[10px] object-cover xl:size-[140px]"
          />
        </div>
        <div className="flex flex-col">
          {PlaylistInfosArray.map((info) => (
            <PlaylistInfo key={info.id} {...info} />
          ))}
        </div>
      </div>

      <div id="playlist-songs-wrapper" className="flex grow flex-col gap-2 overflow-y-auto pe-2">
        {playList.map((song) => (
          <PlayBar key={song.id} size="sm" {...song} />
        ))}
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

SidebarPlaylist.propTypes = {
  playList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      album: PropTypes.string,
      artist: PropTypes.string,
      cover: PropTypes.string,
      isLiked: PropTypes.bool,
      classNames: PropTypes.string,
      clickHandler: PropTypes.func,
    })
  ),
};

PlaylistInfo.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};
