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
import { updateUser } from '../../services/users';
import { deleteFolderContents, uploadFile, getFileUrl } from '../../services/storage';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';
import { useSelector } from 'react-redux';
import { Trash, Edit } from 'iconsax-react';
import { openModal } from '../../redux/slices/confirmModalSlice';

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

  const submitHandler = async ({ full_name, user_name, email, bio, avatar }) => {
    try {
      // update user info in supabase authentication
      const {
        error,
        data: { user },
      } = await supabase.auth.updateUser({
        email,
        data: {
          full_name,
          user_name,
          bio,
        },
      });
      if (error) throw error;

      // update user avatar
      if (avatar) {
        const { success, error } = await deleteFolderContents('avatars', user.id);

        if (success) {
          const { error } = await uploadFile('avatars', `${user.id}/avatar`, avatar);
          if (error) {
            console.error('Error uploading avatar: ', error);
            dispatch(
              showNewSnackbar({
                message: 'Unexpected error occurred while updating avatar.',
                type: 'error',
              })
            );
          }
        } else {
          console.error('Error deleting avatars folder: ', error);
          dispatch(
            showNewSnackbar({
              message: 'Unexpected error occurred while updating avatar.',
              type: 'error',
            })
          );
        }
      }

      // update the user in database.
      try {
        const newUserInfos = { full_name, user_name, email, bio };

        if (avatar) {
          const newUserAvatar = getFileUrl(
            'avatars',
            `${user.id}/avatar.${avatar.name.split('.').pop()}`
          );
          newUserInfos.avatar_url = newUserAvatar;
        }

        await updateUser(user.id, newUserInfos);
      } catch (err) {
        console.error('An error occurred while updating user in database => ', err);
        setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
      }
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
              className="absolute opacity-0"
              onChange={avatarChangeHandler}
              ref={fileInputRef}
            />

            <Avatar size="lg" profilePic={avatar} />

            <span className="text-red absolute top-[110%] hidden text-center text-sm md:block">
              {errors.avatar?.message}
            </span>
          </label>
          <div className="mt-2 flex gap-2">
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
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">
            @{user?.user_metadata.user_name}
          </span>
        </div>
      </div>
      <div className="container flex !max-w-[720px] flex-col gap-6">
        <p className="text-red mb-2 text-lg font-semibold">{errors.root?.message}</p>
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
