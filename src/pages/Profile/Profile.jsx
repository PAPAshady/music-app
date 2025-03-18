import Avatar from '../../components/Avatar/Avatar';
import profileImg from '../../assets/images/Avatar/profile-pic.jpg';
import useMediaQuery from '../../hooks/useMediaQuery';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import InputField from '../../components/Inputs/InputField/InputField';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  full_name: z.string().min(1, { message: 'Fullname is required' }),
  user_name: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string(),
});

export default function Profile() {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const {
    register,
    handleSubmit,
    watch,
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

  const submitHandler = async (data) => console.log(data);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:pt-8">
        <button>
          <Avatar size={isTablet ? 'lg' : 'md'} profilePic={profileImg} />
        </button>
        <div className="text-center md:text-start">
          <p className="text-primary-50 font-semibold sm:text-lg md:mb-2 md:text-2xl">
            Olivia Rhye
          </p>
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">@olivia</span>
        </div>
      </div>
      <form
        action="#"
        className="container flex !max-w-[720px] flex-col gap-6"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          <InputField
            placeholder="Fullname"
            isInvalid={!!errors.full_name}
            errorMsg={errors.full_name?.message}
            {...register('full_name')}
          />
          <InputField
            placeholder="Username"
            isInvalid={!!errors.user_name}
            errorMsg={errors.user_name?.message}
            {...register('user_name')}
          />
        </div>
        <EmailInput
          placeholder="Email"
          isInvalid={!!errors.email}
          errorMsg={errors.email?.message}
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
          <MainButton title="Cancel" size="lg" type="text" onClick={(e) => e.preventDefault()} />
          <MainButton title={isSubmitting ? 'Saving...' : 'Save'} size="lg" variant="secondary" />
        </div>
      </form>
    </div>
  );
}
