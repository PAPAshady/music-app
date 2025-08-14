import { useRef, useEffect, useState, memo } from 'react';
import { Image, Trash, Edit2, AddCircle, Play, Music } from 'iconsax-react';
import Modal from '../../components/Modal/Modal';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BASE_URL } from '../../services/api';
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import IconButton from '../Buttons/IconButton/IconButton';
import { useQuery } from '@tanstack/react-query';
import { getAllMusicsQueryOptions } from '../../queries/musics';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/playlistInfosModalSlice';
import PropTypes from 'prop-types';

const schema = z.object({
  description: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  cover: z.any().optional(),
});

export default function PlaylistInfosModal() {
  const {
    isOpen,
    title: modalTitle,
    actionType,
  } = useSelector((state) => state.playlistInfosModal);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const isMobileSmall = useMediaQuery('(min-width: 371px)');
  const isSmallDesktop = useMediaQuery('(max-width: 1280px)');
  const searchInput = useInput();
  const [selectedTab, setSelectedTab] = useState('view'); // could be on of the following:  [add, view]
  const { data: suggestedSongs } = useQuery(getAllMusicsQueryOptions());
  const {
    title,
    description = '',
    cover,
    musics,
  } = useSelector((state) => state.musicPlayer.selectedPlaylist);
  const [playlistCover, setPlaylistCover] = useState(playlistDefaultCover);
  const [pendingSongId, setPendingSongId] = useState(null); // tracks which song is in loading state (while adding or removing song from playlist)
  const {
    register,
    watch,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description,
      title,
    },
    resolver: zodResolver(schema),
  });
  const songsToRender = (
    selectedTab === 'add' ? suggestedSongs?.songs || [] : (musics ?? [])
  ).filter((song) => song.title.toLowerCase().includes(searchInput.value.toLowerCase().trim()));

  /*
    since useForm hook only sets defaultValues once on the initial render and wont update them ever again,
    we have to update them manually. (in case user selected another playlist/album or they closed and re-opened the modal).
    we also have to update playlist cover if user selcted another playlist or closed and re-opened the modal
  */
  useEffect(() => {
    reset({ description: description || '', title: title || '' });
    setPlaylistCover(cover ? BASE_URL + cover : playlistDefaultCover);
  }, [reset, description, title, cover, isOpen]);

  const changeTabHandler = (tabName) => {
    searchInput.reset();
    setSelectedTab(tabName);
  };

  const submitHandler = (data) => {
    // dont send any image to backend if user removed the cover of their playlist
    if (!data.cover) delete data.cover;

    switch (actionType) {
      case 'create_playlist':
        break;

      case 'edit_playlist':
        break;
    }
  };

  const addSongHandler = (musicId) => {
    setPendingSongId(musicId);
    console.log('addSongHandler is running');
  };

  const removeSongHandler = (musicId) => {
    setPendingSongId(musicId);
    console.log('removeSongHandler is running');
  };

  const validateFileInput = (e) => {
    const selectedImage = e.target.files[0];
    clearErrors('cover');
    if (selectedImage) {
      if (!selectedImage.type.includes('image/')) {
        setError('cover', { message: 'Playlist cover must be an image.' });
        return;
      }

      if (selectedImage.size / 1024 ** 2 > 2) {
        setError('cover', { message: 'Playlist cover must be less than 2MB' });
        return;
      }

      setValue('cover', selectedImage);
      setPlaylistCover(URL.createObjectURL(selectedImage));
    }
  };

  const removePlaylistCover = () => {
    fileInputRef.current.value = null;
    setPlaylistCover(playlistDefaultCover);
    setValue('cover', null);
  };

  const onClose = () => {
    dispatch(closeModal());
    // To avoid an unpolished visual effect where the playlist title, description, and cover appear empty
    // during the modal's closing transition, we delay the reset until the transition completes.
    setTimeout(() => {
      reset({ title: '', description: '', cover: null });
      setPlaylistCover(playlistDefaultCover);
      fileInputRef.current.value = null;
    }, 150);
  };

  const modalDropDownListItems = [
    {
      id: 1,
      icon: <Image />,
      title: 'Change photo',
      onClick: () => fileInputRef.current.click(), // trigger the file input when the user clicks the “Change photo” dropdown item.
    },
    {
      id: 2,
      icon: <Trash />,
      title: 'Remove photo',
      onClick: removePlaylistCover,
    },
  ];

  const tabButtons = [
    { id: 1, title: 'View Songs', tabName: 'view' },
    { id: 2, title: 'Add Songs', tabName: 'add' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      onConfirm={handleSubmit(submitHandler)}
      confirmButton
    >
      <div>
        <div className="items-cente flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col gap-1">
            <div
              className={`group relative mx-auto mt-6 size-[150px] overflow-hidden rounded-xl border transition-colors duration-200 min-[480px]:size-[180px] sm:size-[190px] sm:min-w-[190px] ${errors.cover ? 'border-red' : 'border-transparent'}`}
            >
              <img className="size-full object-cover" src={playlistCover} alt={title} />
              <label
                className="absolute inset-0 size-full bg-black/30 sm:bg-transparent"
                htmlFor="choose-playlist-img"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="invisible absolute"
                  id="choose-playlist-img"
                  accept="image/*"
                  onChange={validateFileInput}
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
            <span
              className={`text-red mb-1 text-sm transition-opacity duration-200 ${errors.cover ? 'opacity-100' : 'opacity-0'}`}
            >
              {errors.cover?.message}
            </span>
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

        {/* 
          This condtion is wrong because this section will not appear to users with mobile devices.
          so currently we must have to wait for the backend to include a flag in albums resoponse to determine if user selected an album or playlist.
        */}
        {!isSmallDesktop && (
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
                    : `You have ${musics.length} song${songsToRender.length > 1 ? 's' : ''} in this playlist`}
                </p>
              )}

              <div className="dir-rtl max-h-[260px] min-h-[100px] overflow-y-auto pe-2">
                {songsToRender.length ? (
                  <div className="dir-ltr grid grid-cols-1 gap-3 min-[580px]:grid-cols-2">
                    {songsToRender.map((song) => (
                      <PlaylistSong
                        key={song.id}
                        buttonState={song.id === pendingSongId ? 'pending' : selectedTab}
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
        )}
      </div>
    </Modal>
  );
}

const PlaylistSong = memo(
  ({ title, cover, artist = 'Unknown artist', buttonState, onClick, id }) => {
    return (
      <div className="border-secondary-200 flex items-center justify-between gap-2 rounded-sm border py-1 ps-1">
        <div className="flex grow items-center gap-2 overflow-hidden">
          <div className="relative h-[45px] w-[45px] min-w-[45px] overflow-hidden rounded-sm">
            <img src={cover ? cover : playlistDefaultCover} className="size-full object-cover" />
            <button className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play size={18} className="fill-white" />
            </button>
          </div>
          <div className="flex grow flex-col gap-1 overflow-hidden">
            <p className="truncate text-sm">{title}</p>
            <p className="text-secondary-200 truncate text-sm">{artist}</p>
          </div>
        </div>
        {buttonState === 'pending' ? (
          <LoadingSpinner size="xs" classNames="me-2.5" />
        ) : (
          <IconButton
            icon={buttonState === 'add' ? <AddCircle /> : <Trash />}
            onClick={() => onClick(id)}
            classNames="min-w-8 min-h-8 me-1"
          />
        )}
      </div>
    );
  }
);

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

PlaylistSong.displayName = 'PlaylistSong';
PlaylistSong.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.string,
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
