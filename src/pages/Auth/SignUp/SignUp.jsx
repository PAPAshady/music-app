import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import { User, Sms, Lock } from 'iconsax-react';
import { Link } from 'react-router-dom';
import facebookLogo from '../../../assets/images/socials/facebook.png';
import googleLogo from '../../../assets/images/socials/google.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../../../services/supabaseClient';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(12, { message: 'Password must be at most 12 characters' }),
});

export default function SignUp() {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async ({ email, password, username }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.log(err.code);
    }
  };

  const formInputs = [
    {
      id: 1,
      type: 'text',
      name: 'username',
      placeholder: 'Username',
      icon: <User />,
    },
    {
      id: 2,
      type: 'email',
      name: 'email',
      placeholder: 'Email',
      icon: <Sms />,
    },
    {
      id: 3,
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      icon: <Lock />,
    },
  ];

  return (
    <div className="mx-auto flex w-[85%] max-w-[620px] flex-col lg:max-w-[530px] xl:max-w-[600px]">
      <div className="text-primary-100 mb-8 text-center">
        <h3 className="mb-6 text-5xl font-semibold">Sign Up</h3>
        <p className="text-lg">Welcome To VioTune</p>
      </div>
      <form action="#" className="mb-10 flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-4 flex flex-col gap-9">
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
        <LoginButton title={isSubmitting ? 'Please wait...' : 'Sign up'} size="md" />
      </form>
      <div className="text-center">
        <p className="text-white-200 mb-4">OR Sign Up With</p>
        <div className="mb-6 flex items-center justify-center gap-6">
          <a href="#">
            <img className="size-10" src={facebookLogo} alt="Login with Facebook" />
          </a>

          <a href="#">
            <img className="size-10" src={googleLogo} alt="Login with Google" />
          </a>
        </div>
        <p className="text-white-200 pb-2">
          Already have an account ?{' '}
          <Link className="text-primary-200 underline" to="/auth/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
