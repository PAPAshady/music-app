import TextField from '../../components/Inputs/TextField/TextField';
import { useForm } from 'react-hook-form';
import LoginButton from '../../components/Buttons/LoginButton/LoginButton';
import { zodResolver } from '@hookform/resolvers/zod';
import supabase from '../../services/supabaseClient';
import { z } from 'zod';
import { Lock } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';

const passwordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' })
  .max(12, { message: 'Password must be at most 12 characters' });

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(formSchema),
  });

  const submitHandler = async ({ password }) => {
    try {
      const { error } = supabase.auth.updateUser({ password });
      if (error) throw error;
      navigate('/', { replace: true });
    } catch (err) {
      if (err.code === 'over_request_rate_limit') {
        setError('root', { message: 'Too many attempts. Please wait and try again later.' });
      } else {
        setError('root', { message: 'Sorry, an unexpected error occurred. Please try again.' });
        console.error('An error occured while sending password reset link => ', err);
      }
    }
  };

  const inputFields = [
    { id: 1, name: 'password', placeholder: 'Password' },
    { id: 2, name: 'confirmPassword', placeholder: 'Confirm Password' },
  ];

  return (
    <div>
      <div className="text-primary-100 mb-8 text-center">
        <h3 className="mb-4 text-3xl font-semibold md:text-4xl lg:mb-6 lg:text-5xl">
          Reset password
        </h3>
        <p className="text-lg md:text-xl">Please enter you new password in the inputs below</p>
      </div>
      <form
        action="#"
        className="mb-10 flex flex-col gap-6 lg:mx-auto lg:w-[90%]"
        onSubmit={handleSubmit(submitHandler)}
      >
        <p className="text-red mb-2 text-lg font-semibold">{errors.root?.message}</p>
        <div className="mb-6 flex flex-col items-center justify-center gap-9">
          {inputFields.map((input) => (
            <TextField
              key={input.id}
              type="password"
              icon={<Lock />}
              value={watch(input.name)}
              isInvalid={errors[input.name] && true}
              errorMsg={errors[input.name]?.message}
              {...register(input.name)}
              {...input}
            />
          ))}
        </div>
        <LoginButton title={isSubmitting ? 'Please wait...' : 'Confirm'} size="md" />
      </form>
    </div>
  );
}
