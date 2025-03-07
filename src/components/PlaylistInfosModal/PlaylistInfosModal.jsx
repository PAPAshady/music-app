import { useRef } from 'react';
import { Image, Trash, Edit2 } from 'iconsax-react';
import useInput from '../../hooks/useInput';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import defaultImage from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

export default function PlaylistInfosModal({
  isOpen,
  setIsOpen,
  playlistImg = defaultImage,
  playlistName,
  playlistDescription,
}) {
  const playlistNameInput = useInput(playlistName);
  const playlistDescriptionInput = useInput(playlistDescription);
  const fileInputRef = useRef(null);

  const modalDropDownListItems = [
    {
      id: 1,
      icon: <Image />,
      title: 'Change photo',
      onClick: () => fileInputRef.current.click(), // trigger the file input when the user clicks the “Change photo” dropdown item.
    },
    { id: 2, icon: <Trash />, title: 'Remove photo' },
  ];

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Edit Details" confirmButton>
      <div className="flex items-center gap-3">
        <label
          className="group relative size-[190px] min-w-[190px] rounded-xl bg-cover bg-center bg-no-repeat"
          htmlFor="choose-playlist-img"
          style={{ backgroundImage: `url(${playlistImg})` }}
        >
          <input
            ref={fileInputRef}
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
          <DropDownList menuItems={modalDropDownListItems} />
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
  );
}

PlaylistInfosModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  playlistImg: PropTypes.string,
  playlistName: PropTypes.string,
  playlistDescription: PropTypes.string,
};
