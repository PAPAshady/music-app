import Avatar from '../../components/Avatar/Avatar';
import useMediaQuery from '../../hooks/useMediaQuery';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import InputField from '../../components/Inputs/InputField/InputField';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuth from '../../hooks/useAuth';
import supabase from '../../services/supabaseClient';
import { updateUser } from '../../services/users';
import useSnackbar from '../../hooks/useSnackbar';

const formSchema = z.object({
  full_name: z.string().min(1, { message: 'Fullname is required' }),
  user_name: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string(),
});

export default function Profile() {
  const { showNewSnackbar } = useSnackbar();
  const { user } = useAuth();
  const isTablet = useMediaQuery('(min-width: 768px)');
  const { avatar_url, user_name, full_name, bio } = user.user_metadata;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      full_name,
      user_name,
      email: user.email,
      bio: bio || '',
    },
    resolver: zodResolver(formSchema),
  });

  const textInputs = [
    { id: 1, placeholder: 'Fullname', name: 'full_name' },
    { id: 2, placeholder: 'Username', name: 'user_name' },
  ];

  const submitHandler = async ({ full_name, user_name, email, bio }) => {
    try {
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

      // update the user in database as well.
      try {
        await updateUser(user.id, {
          full_name,
          user_name,
          email,
          bio,
        });
      } catch (err) {
        console.error('An error occurred while updating user in database => ', err);
        setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
      }

      showNewSnackbar('Your profile has been updated successfully!', 'success');
    } catch (err) {
      switch (err.code) {
        case 'email_address_invalid':
          setError('email', {
            message: 'The email address provided is invalid or inactive. Please use a valid email.',
          });
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
    reset();
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:pt-8">
        <button>
          <Avatar size={isTablet ? 'lg' : 'md'} profilePic={avatar_url} />
        </button>
        <div className="text-center md:text-start">
          <p className="text-primary-50 font-semibold sm:text-lg md:mb-2 md:text-2xl">
            {full_name}
          </p>
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">@{user_name}</span>
        </div>
      </div>
      <form
        action="#"
        className="container flex !max-w-[720px] flex-col gap-6"
        onSubmit={handleSubmit(submitHandler)}
      >
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
      </form>
    </div>
  );
}
