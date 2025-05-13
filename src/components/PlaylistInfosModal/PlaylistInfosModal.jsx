import { useRef, useEffect } from 'react';
import { Image, Trash, Edit2, AddCircle, Play } from 'iconsax-react';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaylistInfosModalContext from '../../contexts/PlaylistInfosModalContext';
import MusicPlayerContext from '../../contexts/MusicPlayerContext';
import useSafeContext from '../../hooks/useSafeContext';
import { BASE_URL } from '../../services/api';
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import IconButton from '../Buttons/IconButton/IconButton';
import PropTypes from 'prop-types';

const schema = z.object({
  description: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
});

export default function PlaylistInfosModal() {
  const fileInputRef = useRef(null);
  const isMobileSmall = useMediaQuery('(min-width: 371px)');
  const searchInput = useInput();
  const {
    selectedPlaylist: { title, description = '', cover },
  } = useSafeContext(MusicPlayerContext);
  const { isOpen, setIsOpen, modalTitle } = useSafeContext(PlaylistInfosModalContext);
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

  const playlistSongs = [
    { id: 1, title: 'When I Grow Up', artist: 'NF' },
    { id: 2, title: 'Hate My Self', artist: 'NF' },
    { id: 3, title: 'Like This', artist: 'NF' },
    { id: 4, title: 'Options', artist: 'NF' },
    { id: 6, title: 'Thinking', artist: 'NF' },
    { id: 7, title: 'WHY', artist: 'NF' },
    { id: 8, title: 'When I Grow Up', artist: 'NF' },
    { id: 9, title: 'Hate My Self', artist: 'NF' },
    { id: 10, title: 'Like This', artist: 'NF' },
    { id: 11, title: 'Options', artist: 'NF' },
    { id: 12, title: 'Thinking', artist: 'NF' },
    { id: 13, title: 'WHY', artist: 'NF' },
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
      <div>
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
              classNames="!min-w-full !min-h-[90px] !h-[100px] text-sm"
              value={watch('description')}
              {...register('description')}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="border-secondary-500 text-secondary-200 flex items-center gap-2 border-b">
            <button className="border-secondary-100 border-b-2 px-8 py-2.5 text-white">
              Add Songs
            </button>
            <button className="border-b-2 border-transparent px-8 py-2.5">View Songs</button>
          </div>
          <SearchInput {...searchInput} />
          <div className="text-secondary-50">
            <p className="mb-4 font-semibold">Recommended</p>
            <div className="max-h-[200px] overflow-y-auto px-2" style={{ direction: 'rtl' }}>
              <div className="grid grid-cols-2 gap-3" style={{ direction: 'ltr' }}>
                {playlistSongs.map((song) => (
                  <PlaylistSong key={song.id} {...song} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PlaylistSong({ title, cover, artist }) {
  return (
    <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm border">
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="relative h-[55px] w-[55px] min-w-[55px] overflow-hidden rounded-sm">
          <img
            src={cover ? `${BASE_URL}/${cover}` : playlistDefaultCover}
            className="size-full object-cover"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Play size={18} className="fill-white" />
          </button>
        </div>
        <div className="flex grow flex-col gap-1 overflow-hidden">
          <p className="truncate text-sm">{title}</p>
          <p className="text-secondary-200 truncate text-sm">{artist}</p>
        </div>
      </div>
      <IconButton icon={<AddCircle />} classNames="min-w-8 min-h-8 me-1" />
    </div>
  );
}

PlaylistSong.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.string.isRequired,
};
