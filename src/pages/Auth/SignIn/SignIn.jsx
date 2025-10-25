import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import { Sms, Lock } from 'iconsax-react';
import { Link } from 'react-router-dom';
import SocialSignUpButton from '../../../components/SocialSignUpButton/SocialSignUpButton';
import { socialSignUpButtons } from '../../../data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signIn } from '../../../redux/slices/authSlice';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(12, { message: 'Password must be at most 12 characters' }),
});

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const formInputs = [
    { id: 1, type: 'email', name: 'email', placeholder: 'Email', icon: <Sms /> },
    { id: 2, type: 'password', name: 'password', placeholder: 'Password', icon: <Lock /> },
  ];

  const submitHandler = async (userInfo) => {
    try {
      await dispatch(signIn(userInfo));
      dispatch(showNewSnackbar({ message: 'Welcome back to VioTune!', type: 'success' }));
      navigate('/');
    } catch (err) {
      const { status } = err.response;
      let errorMsg = '';

      if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (status === 404 || status === 400) {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else {
        errorMsg = 'An unexpected error occurred. Please try again.';
        console.log('error in login user => ', err);
      }

      setError('root', { message: errorMsg });
    }
  };

  return (
    <>
      <div className="text-primary-100 text-center">
        <h3 className="mb-6 text-5xl font-semibold">Sign In</h3>
        <p className="text-lg">Welcome Back To VioTune</p>
      </div>
      <form action="#" className="mb-10 flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
        <p className="text-red mb-2 text-lg font-semibold">{errors.root?.message}</p>
        <div className="flex flex-col gap-10">
          {formInputs.map((input) => (
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
        <div className="text-white-200 text-sm underline">
          <Link to="/auth/forgot-pass">Forgot Password ?</Link>
        </div>
        <LoginButton title={isSubmitting ? 'Please wait...' : 'Sign in'} size="md" />
      </form>
      <div className="text-center">
        <p className="text-white-200 mb-4">OR Log In With</p>
        <div className="mb-6 flex items-center justify-center gap-6">
          {socialSignUpButtons.map((button) => (
            <SocialSignUpButton key={button.id} {...button} />
          ))}
        </div>
        <p className="text-white-200">
          You do not have an account ?{' '}
          <Link className="text-primary-200 underline" to="/auth/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
