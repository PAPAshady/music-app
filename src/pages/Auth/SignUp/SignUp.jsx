import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import useInput from '../../../hooks/useInput';
import { User, Sms, Lock } from 'iconsax-react';
import { Link } from 'react-router-dom';
import facebookLogo from '../../../assets/images/socials/facebook.png';
import googleLogo from '../../../assets/images/socials/google.png';

export default function SignUp() {
  const userNameInput = useInput('');
  const emailInput = useInput('');
  const passwordInput = useInput('');

  return (
    <div className="mx-auto flex w-[85%] max-w-[620px] flex-col lg:max-w-[530px] xl:max-w-[600px]">
      <div className="text-primary-100 mb-14 text-center">
        <h3 className="mb-6 text-5xl font-semibold">Sign Up</h3>
        <p className="text-lg">Welcome To VioTune</p>
      </div>
      <form action="#" className="mb-10 flex flex-col gap-6">
        <div className="mb-4 flex flex-col gap-10">
          <TextField placeholder="User Name" icon={<User />} {...userNameInput} />
          <TextField type="email" placeholder="Email" icon={<Sms />} {...emailInput} />
          <TextField type="password" placeholder="Password" icon={<Lock />} {...passwordInput} />
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
