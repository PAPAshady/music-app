import { useRef, useEffect, useState, memo, useCallback } from 'react';
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
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import IconButton from '../Buttons/IconButton/IconButton';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/playlistInfosModalSlice';
import { uploadFile, getFileUrl, deleteFiles, listFiles } from '../../services/storage';
import { setSelectedCollection } from '../../redux/slices/playContextSlice';
import {
  createNewPrivatePlaylistMutationOptions,
  updatePrivatePlaylistMutationOptions,
  addSongToPrivatePlaylistMutationOptions,
  removeSongFromPrivatePlaylistMutationOptions,
} from '../../queries/playlists';
import {
  getSongsByPlaylistIdQueryOptions,
  getTrendingSongsQueryOptions,
  getSongsByKeywordQueryOptions,
} from '../../queries/musics';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import PropTypes from 'prop-types';
import { getPlaylistByIdQueryOptions } from '../../queries/playlists';

const schema = z.object({
  description: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  cover: z.any().optional(),
});

export default function PlaylistInfosModal() {
  const isOpen = useSelector((state) => state.playlistInfosModal.isOpen);
  const modalTitle = useSelector((state) => state.playlistInfosModal.title);
  const actionType = useSelector((state) => state.playlistInfosModal.actionType);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const isMobileSmall = useMediaQuery('(min-width: 371px)');
  const searchInput = useInput();
  const [selectedTab, setSelectedTab] = useState('view'); // could be one of the following:  [add, view]
  const playlistId = useSelector((state) => state.queryState.id);
  const { data: selectedTracklist } = useQuery(getPlaylistByIdQueryOptions(playlistId));
  const isDesktop = useMediaQuery('(max-width: 1280px)');
  const searchValue = searchInput.value.toLowerCase().trim();
  const { mutateAsync: addSongToPlaylist } = useMutation(
    addSongToPrivatePlaylistMutationOptions(selectedTracklist?.id)
  );
  const { mutateAsync: removeSongFromPlaylist } = useMutation(
    removeSongFromPrivatePlaylistMutationOptions(selectedTracklist?.id)
  );
  const createNewPlaylistMutation = useMutation(createNewPrivatePlaylistMutationOptions());
  const updatePlaylistMutation = useMutation(
    updatePrivatePlaylistMutationOptions(selectedTracklist?.id)
  );
  const { data: selectedPlaylistSongs } = useQuery(
    getSongsByPlaylistIdQueryOptions(selectedTracklist?.id)
  );
  const { data: trendingSongs, isLoading: isTrendingSongsLoading } = useQuery(
    getTrendingSongsQueryOptions()
  );
  const { data: searchedSongs, isLoading: isSearchedSongsLoading } = useQuery(
    getSongsByKeywordQueryOptions(searchValue)
  );
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
    formState: { isSubmitting, errors, dirtyFields, isDirty },
  } = useForm({
    defaultValues: {
      description: selectedTracklist?.description || '',
      title: selectedTracklist?.title,
    },
    resolver: zodResolver(schema),
  });

  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const playlistSongIds = new Set((selectedPlaylistSongs ?? []).map((song) => song.id));
  const suggestedSongs = trendingSongs?.filter((song) => !playlistSongIds.has(song.id));
  const addTabContent = (searchValue ? searchedSongs : suggestedSongs) || []; // songs to render in the add tab
  const viewTabContent =
    selectedPlaylistSongs?.filter((song) => song.title.toLowerCase().includes(searchValue)) || []; // songs to render in the view tab
  const addTabContentPending = isTrendingSongsLoading || isSearchedSongsLoading;
  const numberOfSongsToRender = (selectedTab === 'add' ? addTabContent : viewTabContent).length;

  /*
    since useForm hook only sets defaultValues once on the initial render and wont update them ever again,
    we have to update them manually. (in case user selected another playlist/album or they closed and re-opened the modal).
    we also have to update playlist cover if user selcted another playlist or closed and re-opened the modal
  */
  useEffect(() => {
    reset({
      description: actionType === 'edit_playlist' ? selectedTracklist?.description : '',
      title: actionType === 'edit_playlist' ? selectedTracklist?.title : '',
    });
    setPlaylistCover(
      actionType === 'edit_playlist' && selectedTracklist?.cover
        ? selectedTracklist?.cover
        : playlistDefaultCover
    );
  }, [reset, selectedTracklist, isOpen, actionType]);

  const changeTabHandler = (tabName) => {
    searchInput.reset();
    setSelectedTab(tabName);
  };

  const submitHandler = async (formData) => {
    // fields which user changed
    const modifiedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      acc[key] = formData[key];
      return acc;
    }, {});

    if (modifiedFields.cover) {
      clearErrors('cover');
      // handle cover uploading/removing logic
      if (formData.cover) {
        // if user selected a cover, upload it to server
        const { playlistCoverError } = await uploadFile(
          'playlist-covers',
          `${user.id}/${formData.title}`,
          formData.cover
        );
        if (playlistCoverError) {
          setError('cover', {
            message: 'Unexpected error occured wihle uploading image. Try again.',
          });
          console.error('Error uploading playlist cover : ', playlistCoverError);
          return;
        }
        const playlistCoverUrl = getFileUrl(
          'playlist-covers',
          `${user.id}/${formData.title}.${formData.cover.name.split('.').pop()}`
        );
        modifiedFields.cover = playlistCoverUrl;
      } else {
        // if data.cover is null, user might want to remove the current cover from their playlist.
        // so we check if this playlist has any cover in storage
        // if no cover found, it means playlist had no cover in first place

        const { data: listingData, error: listingError } = await listFiles(
          'playlist-covers',
          user.id,
          undefined,
          undefined,
          formData.title
        );

        if (listingError) {
          setError('cover', {
            message: 'Unexpected error occured wihle deleting image. Try again.',
          });
          console.error('Error listing files : ', listingError);
        } else if (listingData.length) {
          // remove the cover of the playlist
          const { error: deleteError } = await deleteFiles('playlist-covers', [
            `${user.id}/${formData.title}.${listingData[0].name.split('.').pop()}`,
          ]);
          if (deleteError) {
            setError('cover', {
              message: 'Unexpected error occured wihle deleting image. Try again.',
            });
            console.error('Error deleting file : ', deleteError);
          } else {
            modifiedFields.cover = null;
          }
        }
      }
    }

    // handle creating a playlist logic in database
    if (actionType === 'create_playlist') {
      try {
        await createNewPlaylistMutation.mutateAsync(modifiedFields);
        dispatch(
          showNewSnackbar({
            message: 'Playlist created successfully.',
            type: 'success',
            hideDuration: 4000,
          })
        );
        onClose();
      } catch (err) {
        dispatch(
          showNewSnackbar({
            message: 'Unexpected error occured while creating playlist. Try again.',
            type: 'error',
            hideDuration: 4000,
          })
        );
        console.error('Error creating playlist in database : ', err);
      }
    } else {
      // handle updating playlist logic in database
      try {
        const newPlaylistData = await updatePlaylistMutation.mutateAsync(modifiedFields);
        dispatch(setSelectedCollection({ ...newPlaylistData, musics: selectedPlaylistSongs })); // update redux store as well be synced with new changes
        dispatch(showNewSnackbar({ message: 'Playlist updated successfully.', type: 'success' }));
        onClose();
      } catch (err) {
        dispatch(
          showNewSnackbar({
            message: 'Unexpected error occured while updating the playlist. Try again.',
            type: 'error',
          })
        );
        console.error('Error updating playlist in database : ', err);
      }
    }
  };

  const addSongHandler = useCallback(
    async (songId) => {
      const isAlreadyAdded = selectedPlaylistSongs.some((song) => song.id === songId);

      if (isAlreadyAdded) {
        dispatch(
          showNewSnackbar({
            message: 'This song already exists in your playlist.',
            type: 'warning',
          })
        );
        return;
      }

      try {
        setPendingSongId(songId);
        await addSongToPlaylist(songId);
        dispatch(showNewSnackbar({ message: 'Song added succefully. Enjoy!', type: 'success' }));
      } catch (err) {
        dispatch(
          showNewSnackbar({ message: 'Error while adding new song to playlist. Try again.' })
        );
        console.error('Error adding new song to playlist : ', err);
      } finally {
        setPendingSongId(null);
      }
    },
    [addSongToPlaylist, dispatch, selectedPlaylistSongs]
  );

  const removeSongHandler = useCallback(
    async (songId) => {
      try {
        setPendingSongId(songId);
        await removeSongFromPlaylist(songId);
        dispatch(showNewSnackbar({ message: 'Song removed succefully.', type: 'success' }));
      } catch (err) {
        dispatch(
          showNewSnackbar({
            message: 'Error while removing song from playlist. Try again.',
            type: 'error',
          })
        );
        console.error('Error removing song from playlist : ', err);
      } finally {
        setPendingSongId(null);
      }
    },
    [dispatch, removeSongFromPlaylist]
  );

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

      setValue('cover', selectedImage, { shouldDirty: true });
      setPlaylistCover(URL.createObjectURL(selectedImage));
    }
  };

  const removePlaylistCover = () => {
    fileInputRef.current.value = null;
    setPlaylistCover(playlistDefaultCover);
    setValue('cover', null, { shouldDirty: true });
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
      confirmButtonTitle={isSubmitting ? 'Please wait...' : 'Confirm'}
      confirmButtonDisabled={isSubmitting || !isDirty}
    >
      <div>
        <div className="items-cente flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-col gap-1">
            <div
              className={`group relative mx-auto mt-6 size-[150px] overflow-hidden rounded-xl border transition-colors duration-200 min-[480px]:size-[180px] sm:size-[190px] sm:min-w-[190px] ${errors.cover ? 'border-red' : 'border-transparent'}`}
            >
              <img
                className="size-full object-cover"
                src={playlistCover}
                alt={selectedTracklist?.title}
              />
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
              className={`text-red mb-1 text-center text-sm transition-opacity duration-200 ${errors.cover ? 'opacity-100' : 'opacity-0'}`}
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

        {selectedTracklist?.tracklistType === 'playlist' &&
          !selectedTracklist?.is_public &&
          actionType === 'edit_playlist' &&
          !isDesktop && (
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
                {!!numberOfSongsToRender && (
                  <p className="mb-4 font-semibold">
                    {selectedTab === 'add'
                      ? 'Recommended songs to add.'
                      : `You have ${selectedPlaylistSongs.length} song${numberOfSongsToRender > 1 ? 's' : ''} in this playlist`}
                  </p>
                )}

                <div className="dir-rtl max-h-[260px] min-h-[100px] overflow-y-auto pe-2">
                  {addTabContentPending || numberOfSongsToRender ? (
                    <div className="dir-ltr grid grid-cols-1 gap-3 min-[580px]:grid-cols-2">
                      {/* if user is on add tab, show trending/searched songs or their loading state.  */}
                      {selectedTab === 'add' &&
                        (addTabContentPending
                          ? 'Loading...'
                          : addTabContent.map((song) => (
                              // if search value exists, we know that user is trying to search for a song, so we must show the search result instead of the trending songs
                              <PlaylistSong
                                key={song.id}
                                buttonState={song.id === pendingSongId ? 'pending' : selectedTab}
                                onClick={selectedTab === 'add' ? addSongHandler : removeSongHandler}
                                {...song}
                              />
                            )))}

                      {selectedTab === 'view' &&
                        viewTabContent.map((song) => (
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
                        {searchValue.length ? 'No songs found' : 'This playlist is empty :('}
                      </p>
                      <p className="text-sm">
                        {searchValue.length
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
    console.log('re-rendered');
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
  buttonState: PropTypes.oneOf(['add', 'view', 'pending']),
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  tabName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
