import { useState } from 'react';
import TextField from '../../../../components/Inputs/TextField/TextField';
import MainButton from '../../../../components/Buttons/MainButton/MainButton';
import useInput from '../../../../hooks/useInput';
import { Sms, Lock, ArrowLeft2, Call } from 'iconsax-react';
import { Link } from 'react-router-dom';
import facebookLogo from '../../../../assets/images/socials/facebook.png';
import googleLogo from '../../../../assets/images/socials/google.png';

export default function SignIn() {
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
  const emailInput = useInput('');
  const passwordInput = useInput('');
  const forgotPasswordEmailInput = useInput('');
  const forgotPasswordPhoneInput = useInput('');

  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="mx-auto w-[85%] max-w-[620px] lg:max-w-[530px] xl:max-w-[600px]">
        <div
          className={`relative flex w-full flex-col transition-all duration-300 ${isForgotPasswordVisible ? 'invisible opacity-0' : 'visible opacity-100'}`}
        >
          <div className="text-primary-100 mb-14 text-center">
            <h3 className="mb-6 text-5xl font-semibold">Log In</h3>
            <p className="text-lg">Welcome Back To VioTune</p>
          </div>
          <form
            action="#"
            className="mb-10 flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-10">
              <TextField type="email" placeholder="Email" icon={<Sms />} {...emailInput} />
              <TextField
                type="password"
                placeholder="Password"
                icon={<Lock />}
                {...passwordInput}
              />
            </div>
            <div className="text-white-200 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input className="size-4" type="checkbox" id="rememberMe" />
                <label className="text-white-200" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <button onClick={() => setIsForgotPasswordVisible(true)}>Fogot Password ?</button>
            </div>
            <MainButton title="LOGIN" variant="neutral" size="lg" />
          </form>
          <div className="text-center">
            <p className="text-white-200 mb-4">OR Log In With</p>
            <div className="mb-6 flex items-center justify-center gap-6">
              <a href="#">
                <img className="size-10" src={facebookLogo} alt="Login with Facebook" />
              </a>

              <a href="#">
                <img className="size-10" src={googleLogo} alt="Login with Google" />
              </a>
            </div>
            <p className="text-white-200 text-sm lg:hidden">
              You do not have an account ?{' '}
              <Link className="text-primary-200 underline" to="/auth/sign-up">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div
          className={`absolute top-1/2 left-1/2 mx-auto w-[85%] max-w-[620px] -translate-1/2 divide-gray-300 transition-all lg:max-w-[530px] xl:max-w-[600px] ${isForgotPasswordVisible ? 'visible opacity-100' : 'invisible opacity-0'}`}
        >
          <div className="text-primary-100 mb-10 text-center lg:mb-14">
            <h3 className="mb-4 text-3xl font-semibold lg:mb-6 lg:text-5xl">Forgot Password</h3>
            <p className="text-lg">Enter your email or phone number.</p>
          </div>
          <form action="#" className="mb-10 flex flex-col gap-8 lg:mx-auto lg:w-[90%]">
            <div className="flex flex-col">
              <TextField
                type="email"
                placeholder="Email"
                icon={<Sms />}
                {...forgotPasswordEmailInput}
              />
              <span className="text-primary-50 my-4 text-center">OR</span>
              <TextField
                type="number"
                placeholder="Phone"
                icon={<Call />}
                {...forgotPasswordPhoneInput}
              />
            </div>
            <MainButton title="SUBMIT" variant="neutral" size="lg" />
          </form>
        </div>
      </div>
      <button
        className={`text-primary-50 absolute top-0 left-6 size-8 transition-all duration-300 md:top-4 md:left-10 md:size-10 lg:top-[unset] lg:bottom-full ${isForgotPasswordVisible ? 'visible opacity-100' : 'invisible opacity-0'}`}
        onClick={() => setIsForgotPasswordVisible(false)}
      >
        <ArrowLeft2 size="100%" />
      </button>
    </div>
  );
}
