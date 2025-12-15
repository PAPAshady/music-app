import { useState } from 'react';
import InputField from '../../components/Inputs/InputField/InputField';
import EmailInput from '../../components/Inputs/EmailInput/EmailInput';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import TeamMemberCard from '../../components/TeamMemberCard/TeamMemberCard';
import SettingsPagesSectionHeader from '../../components/SettingsPagesSectionHeader/SettingsPagesSectionHeader';
import { teamMembers } from '../../data';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { showNewSnackbar } from '../../redux/slices/snackbarSlice';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Firstname is required' }),
  lastName: z.string().min(1, { message: 'Lastname is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

export default function ContactUs() {
  const dispatch = useDispatch();
  const [isAgreedToConditions, setIsAgreedToConditions] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const submitHandler = () => {
    dispatch(
      showNewSnackbar({
        message: 'Thank you for reaching out! We will get back to you.',
        type: 'success',
      })
    );
    reset();
  };

  return (
    <div className="flex flex-col gap-16">
      <div>
        <SettingsPagesSectionHeader
          title="Contact Us"
          description="We’d love to hear from you. Please fill out this form."
        />
        <form
          className="container flex max-w-180! flex-col gap-6"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
            <InputField
              placeholder="Firstname"
              errorMsg={errors.firstName?.message}
              isInvalid={!!errors.firstName}
              {...register('firstName')}
            />
            <InputField
              placeholder="Lastname"
              errorMsg={errors.lastName?.message}
              isInvalid={!!errors.lastName}
              {...register('lastName')}
            />
          </div>
          <EmailInput
            placeholder="Email"
            errorMsg={errors.email?.message}
            isInvalid={!!errors.email}
            {...register('email')}
          />
          <InputField
            placeholder="Phone"
            errorMsg={errors.phone?.message}
            isInvalid={!!errors.phone}
            type="tel"
            {...register('phone')}
          />
          <TextArea
            placeholder="Message"
            errorMsg={errors.message?.message}
            isInvalid={!!errors.message}
            {...register('message')}
          />
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
          <MainButton title="Send" variant="neutral" size="lg" disabled={!isAgreedToConditions} />
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
