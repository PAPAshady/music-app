import TextField from '../../../../components/Inputs/TextField/TextField';
import MainButton from '../../../../components/Buttons/MainButton/MainButton';
import useInput from '../../../../hooks/useInput';
import { Sms, Lock } from 'iconsax-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import facebookLogo from '../../../../assets/images/socials/facebook.png';
import googleLogo from '../../../../assets/images/socials/google.png';

export default function SignIn() {
  const emailInput = useInput();
  const passwordInput = useInput();
  const isForgotPasswordPage = useLocation().pathname.includes('forgot-pass');

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-auto w-[85%] max-w-[620px] lg:max-w-[530px] xl:max-w-[600px]">
        {isForgotPasswordPage ? (
          <Outlet />
        ) : (
          <div className="flex w-full flex-col">
            <div className="text-primary-100 mb-14 text-center">
              <h3 className="mb-6 text-5xl font-semibold">Sign In</h3>
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
                <Link to="forgot-pass">Fogot Password ?</Link>
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
        )}
      </div>
    </div>
  );
}
