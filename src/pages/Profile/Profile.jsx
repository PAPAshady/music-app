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

const formSchema = z.object({
  avatar: z.any().optional(),
  full_name: z.string().min(1, { message: 'Fullname is required' }),
  user_name: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string(),
});

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const isTablet = useMediaQuery('(min-width: 640px)');
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
      full_name: '',
      user_name: '',
      email: '',
      bio: '',
    },
    resolver: zodResolver(formSchema),
  });

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

  const submitHandler = async (formData) => {
    console.log('update success : ', formData);
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
            Nima Zamani
          </p>
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">@papapshady</span>
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
