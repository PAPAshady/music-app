import { useState } from 'react';
import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import { Sms, Lock } from 'iconsax-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import SocialSignUpButton from '../../../components/SocialSignUpButton/SocialSignUpButton';
import { socialSignUpButtons } from '../../../data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(12, { message: 'Password must be at most 12 characters' }),
});

export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const isForgotPasswordPage = useLocation().pathname.includes('forgot-pass');

  const formInputs = [
    { id: 1, type: 'email', name: 'email', placeholder: 'Email', icon: <Sms /> },
    { id: 2, type: 'password', name: 'password', placeholder: 'Password', icon: <Lock /> },
  ];

  const submitHandler = async (data) => console.log(data);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-auto w-[85%] max-w-[620px] lg:max-w-[530px] xl:max-w-[600px]">
        {isForgotPasswordPage ? (
          <Outlet />
        ) : (
          <div className="flex w-full flex-col">
            <div className="text-primary-100 mb-8 text-center">
              <h3 className="mb-6 text-5xl font-semibold">Sign In</h3>
              <p className="text-lg">Welcome Back To VioTune</p>
            </div>
            <form
              action="#"
              className="mb-10 flex flex-col gap-6"
              onSubmit={handleSubmit(submitHandler)}
            >
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
              <div className="text-white-200 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    className="size-4"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  <label className="text-white-200" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link to="forgot-pass">Fogot Password ?</Link>
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
          </div>
        )}
      </div>
    </div>
  );
}
