import { useRef, useEffect } from 'react';
import { Image, Trash, Edit2 } from 'iconsax-react';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import usePlaylistInfosModal from '../../hooks/usePlaylistInfosModal';
import useMusicPlayer from '../../hooks/useMusicPlayer';
import { BASE_URL } from '../../services/api';
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';

const schema = z.object({
  description: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
});

export default function PlaylistInfosModal() {
  const fileInputRef = useRef(null);
  const isMobileSmall = useMediaQuery('(min-width: 371px)');
  const {
    selectedPlaylist: { title, description, cover },
  } = useMusicPlayer();
  const { isOpen, setIsOpen, modalTitle } = usePlaylistInfosModal();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description,
      title,
    },
    resolver: zodResolver(schema),
  });

  /*
    since useForm hook only sets defaultValues once on the initial render and wont update them ever again,
    we have to update them manually. (in case user selected another playlist/album)
  */
  useEffect(() => {
    reset({ description: description ?? '', title: title ?? '' });
  }, [reset, description, title]);

  const modalDropDownListItems = [
    {
      id: 1,
      icon: <Image />,
      title: 'Change photo',
      onClick: () => fileInputRef.current.click(), // trigger the file input when the user clicks the “Change photo” dropdown item.
    },
    { id: 2, icon: <Trash />, title: 'Remove photo' },
  ];

  const submitHandler = (data) => {
    console.log('playlist updated => ', data);
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={modalTitle}
      onConfirm={handleSubmit(submitHandler)}
      confirmButton
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="group xs:w-[140px] relative size-[120px] overflow-hidden rounded-xl min-[420px]:size-[150px] sm:size-[190px] sm:min-w-[190px]">
          <img
            className="size-full object-cover"
            src={cover ? BASE_URL + cover : playlistDefaultCover}
            alt={title}
          />
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
          <InputField
            placeholder="Title"
            classNames="!text-sm"
            isInvalid={!!errors.title}
            errorMsg={errors.title?.message}
            {...register('title')}
          />
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
