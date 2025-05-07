import { useRef } from 'react';
import { Image, Trash, Edit2 } from 'iconsax-react';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import defaultImage from '../../assets/images/covers/no-cover.jpg';
import useMediaQuery from '../../hooks/useMediaQuery';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  description: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
});

export default function PlaylistInfosModal({
  isOpen,
  setIsOpen,
  playlistImg = defaultImage,
  playlistName,
  playlistDescription,
  modalTitle,
}) {
  const fileInputRef = useRef(null);
  const isMobileSmall = useMediaQuery('(min-width: 371px)');
  const { register, watch } = useForm({
    defaultValues: {
      description: playlistDescription,
      title: playlistName,
    },
    resolver: zodResolver(schema),
  });

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
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={modalTitle} confirmButton>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="group xs:w-[140px] relative size-[120px] overflow-hidden rounded-xl min-[420px]:size-[150px] sm:size-[190px] sm:min-w-[190px]">
          <img className="size-full object-cover" src={playlistImg} alt={playlistName} />
          <label
            className="absolute inset-0 size-full bg-black/30 sm:bg-transparent"
            htmlFor="choose-playlist-img"
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
              <span className="text-sm sm:text-base">Choose picture</span>
            </div>
            <div className="absolute top-2 right-2">
              <DropDownList
                menuItems={modalDropDownListItems}
                dropDownPlacement={isMobileSmall ? 'bottom start' : 'bottom'}
              />
            </div>
          </label>
        </div>
        <div className="flex w-full grow flex-col gap-2">
          <InputField placeholder="Name" classNames="!text-sm" {...register('title')} />
          <TextArea
            placeholder="Description"
            maxLength={100}
            classNames="!min-w-full !min-h-[90px] !h-[105px] text-sm"
            value={watch('description')}
            {...register('description')}
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
  modalTitle: PropTypes.string.isRequired,
};
