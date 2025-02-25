import { useState, useRef } from 'react';
import useInput from '../../../../hooks/useInput';
import { Sms, Call } from 'iconsax-react';
import TextField from '../../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../../components/Buttons/LoginButton/LoginButton';

export default function ForgotPassword() {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);
  const [isCodeSectionVisible, setIsCodeSectionVisible] = useState(false); // check if the enter otp code section is visible or not.
  const emailInput = useInput();
  const phoneInput = useInput();

  const sendCodeHandler = (e) => {
    e.preventDefault();
    setIsCodeSectionVisible(true);
  };

  const updateOtp = (index, newValue) => {
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d{1}$/.test(value)) return; // only accept numbers.
    updateOtp(index, value);
    if (index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const keyDownHandler = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index) {
        inputRefs.current[index - 1].focus();
      } else {
        updateOtp(index, '');
      }
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      <div className="text-primary-100 mb-10 text-center lg:mb-14">
        <h3 className="mb-4 text-3xl font-semibold md:text-4xl lg:mb-6 lg:text-5xl">
          {isCodeSectionVisible ? 'Enter Code' : 'Forgot Password'}
        </h3>
        <p className="text-lg md:text-xl">
          {isCodeSectionVisible
            ? 'Enter the code sent to the Phone'
            : 'Enter your email or phone number.'}
        </p>
      </div>
      {isCodeSectionVisible ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-10 flex items-center justify-center gap-2 sm:mb-14 sm:gap-4">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => keyDownHandler(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="bg-primary-50/60 size-[40px] rounded-lg text-center text-2xl text-[white] outline-none sm:size-16 sm:text-3xl md:size-[70px] lg:rounded-3xl"
              />
            ))}
          </div>
          <div className="w-full text-center">
            <LoginButton title="SUBMIT" size="md" classNames="w-full" />
          </div>
        </form>
      ) : (
        <form
          onSubmit={sendCodeHandler}
          action="#"
          className="mb-10 flex flex-col gap-8 lg:mx-auto lg:w-[90%]"
        >
          <div className="flex flex-col">
            <TextField type="email" placeholder="Email" icon={<Sms />} {...emailInput} />
            <span className="text-primary-50 my-4 text-center">OR</span>
            <TextField type="number" placeholder="Phone" icon={<Call />} {...phoneInput} />
          </div>
          <LoginButton title="SUBMIT" size="md" />
        </form>
      )}
    </div>
  );
}
