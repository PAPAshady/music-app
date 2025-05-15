import { useRef, useEffect, useState } from 'react';
import { Image, Trash, Edit2, AddCircle, Play, Music } from 'iconsax-react';
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
  const [selectedTab, setSelectedTab] = useState('view'); // could be on of the following:  [add, view]
  const [sugestedSongs, setSugestedSongs] = useState([
    { id: 1, title: 'When I Grow Up' },
    { id: 2, title: 'Hate My Self' },
    { id: 3, title: 'Like This' },
    { id: 4, title: 'Options' },
    { id: 6, title: 'Thinking' },
    { id: 7, title: 'WHY' },
    { id: 8, title: 'When I Grow Up' },
    { id: 9, title: 'Hate My Self' },
    { id: 10, title: 'Like This' },
    { id: 11, title: 'Options' },
    { id: 12, title: 'Thinking' },
    { id: 13, title: 'WHY' },
  ]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
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
  const songsToRender = (selectedTab === 'add' ? sugestedSongs : playlistSongs).filter((song) =>
    song.title.toLowerCase().includes(searchInput.value.toLowerCase().trim())
  );

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

  const tabButtons = [
    { id: 1, title: 'View Songs', tabName: 'view' },
    { id: 2, title: 'Add Songs', tabName: 'add' },
  ];

  const changeTabHandler = (tabName) => {
    searchInput.reset();
    setSelectedTab(tabName);
  };

  const submitHandler = (data) => {
    console.log('playlist updated => ', data);
  };

  const addSongHandler = (songId) => {
    const isAlreadyAdded = playlistSongs.some((song) => song.id === songId);
    if (isAlreadyAdded) return;
    const selectedSong = sugestedSongs.find((song) => song.id === songId);
    setPlaylistSongs((prev) => [...prev, selectedSong]);
  };

  const removeSongHandler = (songId) => {
    const newPlaylistSongs = playlistSongs.filter((song) => song.id !== songId);
    setPlaylistSongs(newPlaylistSongs);
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
          <div className="border-secondary-500 container flex items-center justify-center gap-2 border-b">
            {tabButtons.map((button) => (
              <TabButton
                key={button.id}
                isActive={button.title.toLowerCase().includes(selectedTab)}
                onClick={changeTabHandler}
                {...button}
              />
            ))}
          </div>
          <SearchInput {...searchInput} />
          <div className="text-secondary-50">
            {!!songsToRender.length && (
              <p className="mb-4 font-semibold">
                {selectedTab === 'add'
                  ? 'Recommended songs to add.'
                  : `You have ${playlistSongs.length} song${songsToRender.length > 1 ? 's' : ''} in this playlist`}
              </p>
            )}

            <div className="dir-rtl max-h-[260px] min-h-[100px] overflow-y-auto pe-2">
              {songsToRender.length ? (
                <div className="dir-ltr grid grid-cols-1 gap-3 min-[580px]:grid-cols-2">
                  {songsToRender.map((song) => (
                    <PlaylistSong
                      key={song.id}
                      buttonState={selectedTab}
                      onClick={selectedTab === 'add' ? addSongHandler : removeSongHandler}
                      {...song}
                    />
                  ))}
                </div>
              ) : (
                <div className="dir-ltr flex h-[200px] flex-col items-center justify-center gap-3 rounded-md border border-dashed px-8 text-center">
                  <Music size={62} />
                  <p className="text-xl font-semibold">
                    {searchInput.value.trim().length
                      ? 'No songs found'
                      : 'This playlist is empty :('}
                  </p>
                  <p className="text-sm">
                    {searchInput.value.trim().length
                      ? "Oops! Couldn't find any songs with that keyword. Try searching for something else."
                      : 'Switch to "Add Songs" tab and start searching for your tunes!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PlaylistSong({
  title,
  cover,
  artist = [{ name: 'Unknown artist' }],
  buttonState,
  onClick,
  id,
}) {
  return (
    <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm border py-1 ps-1">
      <div className="flex grow items-center gap-2 overflow-hidden">
        <div className="relative h-[45px] w-[45px] min-w-[45px] overflow-hidden rounded-sm">
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
          <p className="text-secondary-200 truncate text-sm">{artist[0].name}</p>
        </div>
      </div>
      <IconButton
        icon={buttonState === 'add' ? <AddCircle /> : <Trash />}
        onClick={() => onClick(id)}
        classNames="min-w-8 min-h-8 me-1"
      />
    </div>
  );
}

function TabButton({ title, isActive, tabName, onClick }) {
  return (
    <button
      onClick={() => onClick(tabName)}
      className={`grow border-b-2 py-2.5 text-sm transition-colors hover:text-white ${isActive ? 'border-secondary-100 text-white' : 'text-secondary-200 border-transparent'}`}
    >
      {title}
    </button>
  );
}

PlaylistSong.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.array,
  buttonState: PropTypes.oneOf(['add', 'view']),
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  tabName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
