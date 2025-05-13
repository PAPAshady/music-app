import { useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import useMediaQuery from '../../hooks/useMediaQuery';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import InputField from '../../components/Inputs/InputField/InputField';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useSafeContext from '../../hooks/useSafeContext';
import AuthContext from '../../contexts/AuthContext';
import SnackbarContext from '../../contexts/SnackbarContext';

const formSchema = z.object({
  avatar: z.any().optional(),
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string(),
});

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const isTablet = useMediaQuery('(min-width: 640px)');
  const { showNewSnackbar } = useSafeContext(SnackbarContext);
  const {
    user: { first_name, last_name, username, email },
    updateUser,
  } = useSafeContext(AuthContext);
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
      first_name,
      last_name,
      username,
      email,
      bio: '',
    },
    resolver: zodResolver(formSchema),
  });

  const inputFields = [
    { id: 1, name: 'first_name', placeholder: 'Firstname' },
    { id: 2, name: 'last_name', placeholder: 'Lastname' },
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

  const submitHandler = async ({ avatar, first_name, last_name }) => {
    const newUserInfo = { first_name, last_name };
    avatar && (newUserInfo.profile = avatar);
    const res = await updateUser(newUserInfo);

    switch (res.status) {
      case 200:
        showNewSnackbar('Your profile updated successfully', 'success');
        break;
      case 400:
        setError('avatar', { message: 'The avatar must be an Image' });
        break;
      default:
        setError('root', {
          message: 'An unexpected error occured while updating your data. Please try again.',
        });
        break;
    }
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setAvatar(null);
    reset();
  };

  return (
    <form className="flex flex-col gap-8 lg:gap-10" onSubmit={handleSubmit(submitHandler)}>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:pt-8">
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
          />
          <Avatar size={isTablet ? 'lg' : 'md'} profilePic={avatar} />
          <span className="text-red absolute top-[110%] hidden text-center text-sm md:block">
            {errors.avatar?.message}
          </span>
        </label>
        <div className="text-center md:text-start">
          <p className="text-red mb-3 text-center text-sm md:hidden">{errors.avatar?.message}</p>
          <p className="text-primary-50 font-semibold sm:text-lg md:mb-2 md:text-2xl">
            {first_name} {last_name}
          </p>
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">@{username}</span>
        </div>
      </div>
      <div className="container flex !max-w-[720px] flex-col gap-6">
        <p className="text-red mb-2 text-lg font-semibold">{errors.root?.message}</p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          {inputFields.map(({ name, placeholder, id }) => (
            <InputField
              key={id}
              placeholder={placeholder}
              isInvalid={!!errors[name]}
              errorMsg={errors[name]?.message}
              {...register(name)}
            />
          ))}
        </div>
        <InputField
          placeholder="Username"
          isInvalid={!!errors['username']}
          errorMsg={errors['username']?.message}
          {...register('username')}
          disabled
        />
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
