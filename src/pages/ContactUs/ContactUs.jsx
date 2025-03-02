import { useState } from 'react';
import useInput from '../../hooks/useInput';
import InputField from '../../components/Inputs/InputField/InputField';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';

export default function ContactUs() {
  const [isAgreedToConditions, setIsAgreedToConditions] = useState(false);
  const firstnameInput = useInput();
  const lastnameInput = useInput();
  const emailInput = useInput();
  const phoneInput = useInput();
  const messageInput = useInput();

  return (
    <div className="flex flex-col gap-8 pt-8 lg:gap-12">
      <div className="mb-4 text-center">
        <p className="mb-4 text-2xl font-bold md:text-4xl">Contact Us</p>
        <p className="text-primary-200 md:text-xl">
          We’d love to hear from you. Please fill out this form.
        </p>
      </div>
      <form
        action="#"
        className="container flex !max-w-[720px] flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          <InputField placeholder="Firstname" {...firstnameInput} />
          <InputField placeholder="Lastname" {...lastnameInput} />
        </div>
        <EmailInput placeholder="Email" {...emailInput} />
        <InputField placeholder="Phone" {...phoneInput} />
        <TextArea placeholder="Message" {...messageInput} />
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="privacy-and-policy"
            className="size-5"
            checked={isAgreedToConditions}
            onChange={() => setIsAgreedToConditions((prev) => !prev)}
          />
          <label className="text-primary-100" htmlFor="privacy-and-policy">
            You agree to our friendly privacy policy.
          </label>
        </div>
        <MainButton title="Send" variant="neutral" size="lg" />
      </form>
    </div>
  );
}
