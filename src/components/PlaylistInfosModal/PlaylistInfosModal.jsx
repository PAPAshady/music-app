import { useRef, useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/slices/playlistInfosModalSlice';
import { uploadFile, getFileUrl, deleteFiles, listFiles } from '../../services/storage';
import {
  createNewPrivatePlaylistMutationOptions,
  updatePrivatePlaylistMutationOptions,
} from '../../queries/playlists';
import { getSongsByPlaylistIdQueryOptions } from '../../queries/songs';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { getPlaylistByIdQueryOptions } from '../../queries/playlists';
import PlaylistInfosModalSongsList from './PlaylistInfosModalSongsList';
import PlaylistInfosModalForm from './PlaylistInfosModalForm';

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
  const playlistId = useSelector((state) => state.queryState.id);
  const { data: selectedTracklist } = useQuery(getPlaylistByIdQueryOptions(playlistId));
  const isDesktop = useMediaQuery('(max-width: 1280px)');
  const createNewPlaylistMutation = useMutation(createNewPrivatePlaylistMutationOptions());
  const updatePlaylistMutation = useMutation(
    updatePrivatePlaylistMutationOptions(selectedTracklist?.id)
  );
  const { data: selectedPlaylistSongs } = useQuery(
    getSongsByPlaylistIdQueryOptions(selectedTracklist?.id)
  );
  const [playlistCover, setPlaylistCover] = useState(playlistDefaultCover);
  const showSongsList =
    selectedTracklist?.tracklistType === 'playlist' &&
    !selectedTracklist?.is_public &&
    actionType === 'edit_playlist' &&
    !isDesktop;

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
      createNewPlaylistMutation.mutate(modifiedFields, {
        onSuccess: onClose,
        onError: (err) => {
          if (err.code === '23505') {
            setError('title', {
              message: 'Playlist with this title already exists.',
            });
          } else {
            dispatch(
              showNewSnackbar({
                message: 'Unexpected error occured while creating playlist. Try again.',
                type: 'error',
                hideDuration: 4000,
              })
            );
            console.error('Error creating playlist in database : ', err);
          }
        },
      });
    } else {
      // handle updating playlist logic in database
      updatePlaylistMutation.mutate(modifiedFields, { onSuccess: onClose });
    }
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
        <PlaylistInfosModalForm
          cover={playlistCover}
          setCover={setPlaylistCover}
          errors={errors}
          tracklistTitle={selectedTracklist?.title}
          setFormValue={setValue}
          register={register}
          watch={watch}
          setFormError={setError}
          clearFormErrors={clearErrors}
          ref={fileInputRef}
        />

        {showSongsList && (
          <PlaylistInfosModalSongsList
            tracklist={selectedTracklist}
            tracklistSongs={selectedPlaylistSongs}
          />
        )}
      </div>
    </Modal>
  );
}
