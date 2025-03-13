import { useState } from 'react';
import { Sms } from 'iconsax-react';
import TextField from '../../../components/Inputs/TextField/TextField';
import LoginButton from '../../../components/Buttons/LoginButton/LoginButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../../../services/supabaseClient';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function ForgotPassword() {
  const {
    handleSubmit,
    watch,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // check if the success message is visible or not.

  const sendCodeHandler = async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/auth/reset-pass',
      });
      if (error) throw error;
      setShowSuccessMessage(true);
    } catch (err) {
      if (err.code === 'over_request_rate_limit') {
        setError('root', { message: 'Too many attempts. Please wait and try again later.' });
      } else {
        setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
        console.error('An error occured while sending password reset link => ', err);
      }
    }
  };

  return (
    <div className="relative flex w-full flex-col">
      {showSuccessMessage ? (
        <div className="text-primary-100 mb-8 text-center">
          <h3 className="mb-4 text-3xl font-semibold md:text-4xl lg:mb-6 lg:text-5xl">
            Check your email
          </h3>
          <p className="text-primary-50 text-lg">
            We’ve sent a password reset link to the email address you provided. Please check your
            inbox (and your spam folder, just in case) and follow the instructions to reset your
            password.
          </p>
        </div>
      ) : (
        <>
          <div className="text-primary-100 mb-8 text-center">
            <h3 className="mb-4 text-3xl font-semibold md:text-4xl lg:mb-6 lg:text-5xl">
              Forgot Password
            </h3>
            <p className="text-lg md:text-xl">Enter the email associated with your account</p>
          </div>
          <form
            onSubmit={handleSubmit(sendCodeHandler)}
            action="#"
            className="mb-10 flex flex-col gap-8 lg:mx-auto lg:w-[90%]"
          >
            <p className="text-red text-lg font-semibold">{errors.root?.message}</p>
            <div>
              <TextField
                type="email"
                placeholder="Email"
                icon={<Sms />}
                value={watch('email')}
                isInvalid={errors.email && true}
                errorMsg={errors.email?.message}
                {...register('email')}
              />
            </div>
            <LoginButton title={isSubmitting ? 'Please wait...' : 'SUBMIT'} size="md" />
          </form>
        </>
      )}
    </div>
  );
}
