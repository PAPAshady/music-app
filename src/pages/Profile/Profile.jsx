import { useState, useEffect, useRef } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import InputField from '../../components/Inputs/InputField/InputField';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../../services/supabaseClient';
import { deleteFolderContents, uploadFile, getFileUrl, listFiles } from '../../services/storage';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { useSelector } from 'react-redux';
import { Trash, Edit } from 'iconsax-reactjs';
import { openModal } from '../../redux/slices/confirmModalSlice';
import { updateUserAvatar } from '../../redux/slices/authSlice';

const formSchema = z.object({
  avatar: z.any().optional(),
  full_name: z.string().min(1, { message: 'Fullname is required' }),
  user_name: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string(),
});

export default function Profile() {
  const userAvatar = useSelector((state) => state.auth.avatar);
  const user = useSelector((state) => state.auth.user);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      full_name: user?.user_metadata.full_name ?? '',
      user_name: user?.user_metadata.user_name ?? '',
      email: user?.email ?? '',
      bio: user?.user_metadata.bio ?? '',
    },
    resolver: zodResolver(formSchema),
  });
  const dispatch = useDispatch();

  // update avatar after it is fetched in authProvider
  useEffect(() => setAvatar(userAvatar), [userAvatar]);

  const textInputs = [
    { id: 1, placeholder: 'Fullname', name: 'full_name' },
    { id: 2, placeholder: 'Username', name: 'user_name' },
  ];

  // handle validation and preview for the selected avatar
  const avatarChangeHandler = (e) => {
    const image = e.target.files?.[0];
    clearErrors('avatar');
    if (image) {
      if (!image.type.includes('image/')) {
        setError('avatar', { message: 'The avatar must be an Image.' });
        return;
      }

      if (image.size / 1024 ** 2 > 2) {
        setError('avatar', { message: 'Your avatar must be less than 2MB' });
        return;
      }

      setValue('avatar', image);
      setAvatar(URL.createObjectURL(image));
    }
  };

  const submitHandler = async ({ full_name, user_name, bio, avatar }) => {
    try {
      let newUserData = { full_name, user_name, bio }; // this will be sent to supabase

      if (avatar) {
        //  delete prev avatars from storage if any
        const { error: deleteError } = await deleteFolderContents('avatars', user.id);

        // if deleting avatars folder fails then return
        if (deleteError) {
          console.error('Error deleting avatars folder: ', deleteError);
          dispatch(
            showNewSnackbar({
              message: 'Unexpected error occurred while updating avatar.',
              type: 'error',
            })
          );
          return;
        }

        // upload new avatar to storage
        const { error: uploadError } = await uploadFile(
          'avatars',
          `${user.id}/avatar-${Date.now()}`, // // Backend always returns the same avatar URL, so the browser caches it. We append a timestamp to force a fresh download after updates.
          avatar
        );

        // if uploading avatar fails then return
        if (uploadError) {
          console.error('Error uploading avatar: ', uploadError);
          dispatch(
            showNewSnackbar({
              message: 'Unexpected error occurred while updating avatar.',
              type: 'error',
            })
          );
          return;
        }

        // get uploaded avatar url.
        const { data: listingData, error: listingError } = await listFiles(
          'avatars',
          user.id,
          undefined,
          undefined,
          'avatar'
        );

        if (listingError) {
          console.error('An error occurred while updating user in database => ', listingError);
          setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
          return;
        }
        const fileName = listingData[0].name;
        const newUserAvatar = getFileUrl('avatars', `${user.id}/${fileName}`);

        // add the new avatar url to newUserData to be sent to supabase
        newUserData = { ...newUserData, user_avatar: newUserAvatar, avatar_overridden: true };
      }

      // update user info in supabase
      const { error } = await supabase.auth.updateUser({
        data: newUserData,
      });

      if (error) throw error;

      dispatch(updateUserAvatar()); // updates user avatar in redux
      dispatch(
        showNewSnackbar({ message: 'Your profile has been updated successfully!', type: 'success' })
      );
    } catch (err) {
      if (err.message === 'NetworkError when attempting to fetch resource.') {
        setError('root', { message: 'Network error, please check your connection.' });
        return;
      }
      switch (err.code) {
        case 'email_address_invalid':
          setError('email', {
            message: 'The email address provided is invalid or inactive. Please use a valid email.',
          });
          break;
        case 'email_exists':
          setError('email', { message: 'This email already taken.' });
          break;
        default:
          setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
          console.error(
            'An error occurred while updating user in supabase authentication => ',
            err
          );
          break;
      }
    }
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setAvatar(userAvatar);
    reset();
  };

  const openFileInput = (e) => {
    e.preventDefault();
    fileInputRef?.current.click();
  };

  const openConfirmModal = (e) => {
    e.preventDefault();
    dispatch(
      openModal({
        title: 'Remove avatar',
        message: 'Are you sure you want to remove your avatar ?',
        actionType: 'remove_user_avatar',
        buttons: { cancel: true, confirm: true },
        buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:pt-8">
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-input"
            className={`relative cursor-pointer rounded-full border-2 transition-colors ${errors.avatar ? 'border-red' : 'border-transparent'}`}
          >
            <input
              type="file"
              id="file-input"
              accept="image/*"
              className="absolute w-0 opacity-0"
              onChange={avatarChangeHandler}
              ref={fileInputRef}
            />

            <Avatar size="lg" profilePic={avatar} />

            <span className="text-red absolute top-[110%] hidden text-center text-sm md:block">
              {errors.avatar?.message}
            </span>
          </label>

          <div className={`flex gap-2 ${errors.avatar?.message ? 'mt-14' : 'mt-2'}`}>
            <button
              onClick={openConfirmModal}
              className="bg-red flex size-10 items-center justify-center rounded-full text-white"
            >
              <Trash size={24} />
            </button>
            <button
              onClick={openFileInput}
              className="bg-secondary-400 flex size-10 items-center justify-center rounded-full text-white"
            >
              <Edit size={24} />
            </button>
          </div>
        </div>
        <div className="text-center md:text-start">
          <p className="text-red mb-3 text-center text-sm md:hidden">{errors.avatar?.message}</p>
          <p className="text-primary-50 font-semibold sm:text-lg md:mb-2 md:text-2xl">
            {user?.user_metadata.full_name}
          </p>
          {/* if user signs up with google for the first time, he won't have a username */}
          {user?.user_metadata.user_name && (
            <span className="text-primary-100 text-sm sm:text-base md:text-xl">
              @{user?.user_metadata.user_name}
            </span>
          )}
        </div>
      </div>
      <div className="container flex max-w-180! flex-col gap-6">
        <p className="text-red mt-6 mb-2 text-lg font-semibold">{errors.root?.message}</p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          {textInputs.map((input) => (
            <InputField
              key={input.id}
              isInvalid={!!errors[input.name]}
              errorMsg={errors[input.name]?.message}
              {...register(input.name)}
              {...input}
            />
          ))}
        </div>
        <EmailInput
          placeholder="Email"
          isInvalid={!!errors.email}
          errorMsg={errors.email?.message}
          disabled
          {...register('email')}
        />
        <TextArea
          placeholder="Bio (optional)"
          maxLength={150}
          value={watch('bio')}
          isInvalid={!!errors.bio}
          errorMsg={errors.bio?.message}
          {...register('bio')}
        />
        <div className="flex items-center justify-end gap-3">
          <MainButton title="Cancel" size="lg" type="text" onClick={cancelHandler} />
          <MainButton
            title={isSubmitting ? 'Saving...' : 'Save'}
            size="lg"
            variant="secondary"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
