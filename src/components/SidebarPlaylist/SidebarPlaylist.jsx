import { cloneElement, useState, useRef } from 'react';
import { Menu as MenuIcon, Music, Timer, User, Edit2, Image, Trash } from 'iconsax-react';
import PropTypes from 'prop-types';
import PlaylistImg from '../../assets/images/backgrounds/login-signup-page.jpg';
import PlayBar from '../MusicCards/PlayBar/PlayBar';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import useInput from '../../hooks/useInput';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export default function SidebarPlaylist({ playList }) {
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const modalFileInputRef = useRef(null);
  const playlistNameInput = useInput('Sad playlist');
  const playlistDescriptionInput = useInput();

  const PlaylistInfosArray = [
    { id: 1, title: `${playList.length} Tracks`, icon: <Music /> },
    { id: 2, title: '01:11:58', icon: <Timer /> },
    { id: 3, title: 'Rayan', icon: <User /> },
  ];

  return (
    <>
      <div className="sticky top-10 hidden xl:block">
        <div className="bg-secondary-400/40 border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col rounded-xl border px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
          <div className="flex items-center justify-between gap-1">
            <p className="text-white-50 subheading-3 truncate">Sad playlist</p>
            <button className="text-secondary-50">
              <MenuIcon />
            </button>
          </div>

          <div className="my-6 flex gap-2">
            <div className="group relative overflow-hidden rounded-[10px]">
              <img src={PlaylistImg} alt="" className="size-32 object-cover xl:size-[140px]" />
              <button
                onClick={() => setShowEditPlaylistModal(true)}
                className="absolute top-0 flex size-full flex-col items-center justify-center gap-3 bg-[black]/40 p-3 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="size-9">
                  <Edit2 size="100%" />
                </span>
                <p className="font-semibold">Edit Playlist</p>
              </button>
            </div>
            <div className="flex flex-col">
              {PlaylistInfosArray.map((info) => (
                <PlaylistInfo key={info.id} {...info} />
              ))}
            </div>
          </div>

          <div
            id="playlist-songs-wrapper"
            className="flex grow flex-col gap-2 overflow-y-auto pe-2"
          >
            {playList.map((song) => (
              <PlayBar key={song.id} size="sm" {...song} />
            ))}
          </div>
        </div>
      </div>

      {/* edit Playlist infos modal */}
      <Modal
        isOpen={showEditPlaylistModal}
        setIsOpen={setShowEditPlaylistModal}
        title="Edit Details"
        confirmButton
      >
        <div className="flex items-center gap-3">
          <label
            className="group relative size-[190px] min-w-[190px] rounded-xl bg-cover bg-center bg-no-repeat"
            htmlFor="choose-playlist-img"
            style={{ backgroundImage: `url(${PlaylistImg})` }}
          >
            <input
              ref={modalFileInputRef}
              type="file"
              className="absolute hidden"
              id="choose-playlist-img"
            />
            <div className="text-primary-50 flex size-full flex-col items-center justify-center gap-3 rounded-xl bg-black/50 opacity-0 backdrop-blur-xs transition-all duration-200 group-hover:opacity-100">
              <span className="size-9 text-center">
                <Edit2 size="100%" />
              </span>
              <span>Choose picture</span>
            </div>
            <Menu>
              <div className="absolute top-3 right-2 transition-opacity duration-200">
                <MenuButton className="hover:bg-primary-700 text-secondary-100 data-[open]:bg-primary-700 hover:text-secondary-50 rounded-md p-1 transition-colors duration-300">
                  <MenuIcon />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom start"
                  className="text-primary-50 bg-primary-600/60 mt-1 flex flex-col gap-1 rounded-md p-1 backdrop-blur-sm transition duration-200 data-[closed]:translate-y-2 data-[closed]:opacity-0"
                >
                  <ModalDropDownListItem
                    icon={<Image />}
                    title="Change photo"
                    onClick={() => modalFileInputRef.current.click()} // trigger the file input when the user clicks the “Change photo” dropdown item.
                  />
                  <ModalDropDownListItem icon={<Trash />} title="Remove photo" />
                </MenuItems>
              </div>
            </Menu>
          </label>
          <div className="flex grow flex-col gap-2">
            <InputField placeholder="Name" {...playlistNameInput} classNames="!text-sm" />
            <TextArea
              placeholder="Description"
              maxLength={100}
              classNames="!min-w-full !min-h-[90px] !h-[95px] text-sm"
              {...playlistDescriptionInput}
            />
          </div>
        </div>
      </Modal>
    </>
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

function ModalDropDownListItem({ icon, title, onClick }) {
  const styledIcon = cloneElement(icon, { size: '100%' });

  const clickHandler = async (e, closeHandler) => {
    e.preventDefault();
    await onClick?.();
    closeHandler();
  };

  return (
    <MenuItem>
      {({ close }) => (
        <button
          className="hover:bg-primary-500/60 cursor-default"
          onClick={(e) => clickHandler(e, close)}
        >
          <div className="flex items-center gap-2 p-2 text-sm">
            <span className="size-5">{styledIcon}</span>
            <span>{title}</span>
          </div>
        </button>
      )}
    </MenuItem>
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

ModalDropDownListItem.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
