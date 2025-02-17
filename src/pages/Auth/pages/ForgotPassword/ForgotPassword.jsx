import useInput from '../../../../hooks/useInput';
import { Sms, Call } from 'iconsax-react';
import TextField from '../../../../components/Inputs/TextField/TextField';
import MainButton from '../../../../components/Buttons/MainButton/MainButton';

export default function ForgotPassword() {
  const emailInput = useInput('');
  const phoneInput = useInput('');

  return (
    <div className="flex w-full flex-col">
      <div className="text-primary-100 mb-10 text-center lg:mb-14">
        <h3 className="mb-4 text-3xl font-semibold lg:mb-6 lg:text-5xl">Forgot Password</h3>
        <p className="text-lg">Enter your email or phone number.</p>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        action="#"
        className="mb-10 flex flex-col gap-8 lg:mx-auto lg:w-[90%]"
      >
        <div className="flex flex-col">
          <TextField type="email" placeholder="Email" icon={<Sms />} {...emailInput} />
          <span className="text-primary-50 my-4 text-center">OR</span>
          <TextField type="number" placeholder="Phone" icon={<Call />} {...phoneInput} />
        </div>
        <MainButton title="SUBMIT" variant="neutral" size="lg" />
      </form>
    </div>
  );
}
