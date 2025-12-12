import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import SocialSignUpButton from '../../../components/SocialSignUpButton/SocialSignUpButton';
import { User, Sms, Lock } from 'iconsax-react';
import { Link } from 'react-router-dom';
import { socialSignUpButtons } from '../../../data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import supabase from '../../../services/supabaseClient';

const formSchema = z.object({
  first_name: z.string().min(1, { message: 'Firstname is required' }),
  last_name: z.string().min(1, { message: 'Lastname is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(12, { message: 'Password must be at most 12 characters' }),
});

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async ({ email, password, username: user_name, first_name, last_name }) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { user_name, full_name: `${first_name} ${last_name}` } },
      });
      if (data.user) {
        dispatch(setUser(data.user));
        dispatch(showNewSnackbar({ message: 'Welcome to VioTune!', type: 'success' }));
        navigate('/');
      } else throw error;
    } catch (err) {
      const error = Object.fromEntries(Object.entries(err));
      if (err.code === 'ERR_NETWORK' || error.status === 0) {
        setError('root', {
          message: 'Network error. Please check your connection and try again.',
        });
      } else if (error.code === 'user_already_exists') {
        setError('email', { message: 'User with this email already exists.' });
      } else if (error.code === 'validation_failed') {
        setError('root', { message: 'Invalid inputs. Please try again.' });
      } else if (error.code === 'weak_password') {
        setError('password', { message: 'Password must be at least 6 characters.' });
      } else {
        // default error
        setError('root', {
          message: 'An unexpected error occurred. Please try again.',
        });
        console.log('error in register user => ', error);
      }
    }
  };

  const formInputs = [
    {
      id: 1,
      type: 'text',
      name: 'first_name',
      placeholder: 'Firstname',
      icon: <User />,
    },
    {
      id: 2,
      type: 'text',
      name: 'last_name',
      placeholder: 'Lastname',
      icon: <User />,
    },
    {
      id: 3,
      type: 'text',
      name: 'username',
      placeholder: 'Username',
      icon: <User />,
    },
    {
      id: 4,
      type: 'email',
      name: 'email',
      placeholder: 'Email',
      icon: <Sms />,
    },
    {
      id: 5,
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      icon: <Lock />,
    },
  ];

  return (
    <>
      <div className="text-primary-100 pt-6 text-center">
        <h3 className="mb-6 text-5xl font-semibold">Sign Up</h3>
        <p className="text-lg">Welcome To VioTune</p>
      </div>
      <form action="#" className="mb-6 flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
        <p className="text-red mt-2 mb-6 text-lg font-semibold">{errors.root?.message}</p>
        <div className="mb-4 flex flex-col gap-9">
          <div className="flex flex-col gap-4 sm:flex-row">
            {formInputs.slice(0, 2).map((input) => (
              <TextField
                key={input.id}
                value={watch(input.name)}
                isInvalid={errors[input.name] && true}
                errorMsg={errors[input.name]?.message}
                {...register(input.name)}
                {...input}
              />
            ))}
          </div>
          {formInputs.slice(2, 5).map((input) => (
            <TextField
              key={input.id}
              value={watch(input.name)}
              isInvalid={errors[input.name] && true}
              errorMsg={errors[input.name]?.message}
              {...register(input.name)}
              {...input}
            />
          ))}
        </div>
        <LoginButton title={isSubmitting ? 'Please wait...' : 'Sign up'} size="md" />
      </form>
      <div className="text-center">
        <p className="text-white-200 mb-4">OR Sign Up With</p>
        <div className="mb-4 flex items-center justify-center gap-6">
          {socialSignUpButtons.map((button) => (
            <SocialSignUpButton
              key={button.id}
              onError={() =>
                setError('root', {
                  message: `Failed to sign up with ${button.provider}. Please try again.`,
                })
              }
              {...button}
            />
          ))}
        </div>
        <p className="text-white-200 pb-4">
          Already have an account ?{' '}
          <Link className="text-primary-200 underline" to="/auth/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
