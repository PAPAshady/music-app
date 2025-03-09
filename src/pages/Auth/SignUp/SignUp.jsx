import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import { User, Sms, Lock } from 'iconsax-react';
import { Link } from 'react-router-dom';
import facebookLogo from '../../../assets/images/socials/facebook.png';
import googleLogo from '../../../assets/images/socials/google.png';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'password must be at least 6 characters' })
    .max(12, { message: 'password must be at most 12 characters' }),
});

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = (data) => console.log(data);

  console.log(errors);

  return (
    <div className="mx-auto flex w-[85%] max-w-[620px] flex-col lg:max-w-[530px] xl:max-w-[600px]">
      <div className="text-primary-100 mb-14 text-center">
        <h3 className="mb-6 text-5xl font-semibold">Sign Up</h3>
        <p className="text-lg">Welcome To VioTune</p>
      </div>
      <form action="#" className="mb-10 flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-4 flex flex-col gap-10">
          <div className="flex flex-col">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField placeholder="Username" icon={<User />} {...field} />
              )}
            />
            {errors.username && <p className="text-red font-semibold">{errors.username.message}</p>}
          </div>
          <div className="flex flex-col">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField type="email" placeholder="Email" icon={<Sms />} {...field} />
              )}
            />
            {errors.email && <p className="text-red font-semibold">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField type="password" placeholder="Password" icon={<Lock />} {...field} />
              )}
            />
            {errors.password && <p className="text-red font-semibold">{errors.password.message}</p>}
          </div>
        </div>
        <LoginButton title="Sign up" size="md" />
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
        <p className="text-white-200 text-sm lg:hidden">
          Already have an account ?{' '}
          <Link className="text-primary-200 underline" to="/auth/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
