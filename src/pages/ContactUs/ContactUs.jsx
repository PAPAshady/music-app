import { useState } from 'react';
import useInput from '../../hooks/useInput';
import InputField from '../../components/Inputs/InputField/InputField';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import TeamMemberCard from '../../components/TeamMemberCard/TeamMemberCard';
import SettingsPagesSectionHeader from '../../components/SettingsPagesSectionHeader/SettingsPagesSectionHeader';
import { teamMembers } from '../../data';

export default function ContactUs() {
  const [isAgreedToConditions, setIsAgreedToConditions] = useState(false);
  const firstnameInput = useInput();
  const lastnameInput = useInput();
  const emailInput = useInput();
  const phoneInput = useInput();
  const messageInput = useInput();

  return (
    <div>
      <div>
        <SettingsPagesSectionHeader
          title="Contact Us"
          description="We’d love to hear from you. Please fill out this form."
        />
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
      <div>
        <SettingsPagesSectionHeader
          title="Our Team"
          description="We’re lucky to be supported by some of the best investors in the world."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
