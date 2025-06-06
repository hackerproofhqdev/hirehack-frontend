"use client";
import React from 'react';
import { Mail, Lock, Loader2, AtSign, Brain } from 'lucide-react'; // Icons for input fields
import { register as registerAction } from '@/actions/register'; // Import the register action
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  terms: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const RegisterPage: React.FC = () => {
  const router = useRouter();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();

  // State for backend errors
  const [backendError, setBackendError] = React.useState('');

  // Form submission handler
  const onSubmit : SubmitHandler<RegisterFormInputs> = async (data) => {
    setBackendError('');

    try {
      const response = await registerAction(data.username, data.email, data.password);

      if (response.error) {
        setBackendError(response.error);
      } else {
        // Registration successful, redirect to login page
        router.push('/login');
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      setBackendError('An unexpected error occurred.');
    }
  };

  return (
    // Main container with AI-themed greenish gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center p-4 relative">
      {/* AI-themed background SVG decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circuit board pattern */}
        <svg
          className="absolute top-0 left-0 w-full h-full text-green-500/5"
          viewBox="0 0 100 100"
        >
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 10 10 M 0 10 L 20 10 M 5 10 L 5 20"
              className="stroke-current"
              fill="none"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#circuit-pattern)" />
        </svg>

        {/* Robot head illustration */}
        <svg
          className="absolute bottom-0 right-0 w-96 h-96 text-green-400/10"
          viewBox="0 0 100 100"
        >
          <rect x="35" y="30" width="30" height="35" rx="2" className="fill-current" />
          <circle cx="45" cy="40" r="3" className="fill-green-200" />
          <circle cx="55" cy="40" r="3" className="fill-green-200" />
          <rect x="42" y="50" width="16" height="2" className="fill-green-200" />
        </svg>
      </div>

      {/* Registration card */}
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 relative z-10">
        {/* AI Job Helper Logo and Title */}
        <div className="text-center space-y-4">
          {/* AI Brain Logo */}
          <div className="mx-auto w-20 h-20 relative">
          <Brain size={50} className='text-green-500'/>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
            HireHack
          </h1>
          <p className="text-gray-400">Your AI-powered career assistant</p>
        </div>

        {/* Google Sign-Up Button */}
        <Link
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/google/login`}
          aria-label="Sign up with Google"
          className="w-full bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-lg p-3 flex items-center justify-center space-x-3 transition-colors duration-200 group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* SVG paths for the Google logo */}
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="group-hover:scale-105 transition-transform duration-200">
            Sign up with Google
          </span>
        </Link>

        <div className="relative flex items-center justify-center">
          <div className="absolute border-t border-gray-600 w-full"></div>
          <span className="relative bg-gray-800 px-4 text-sm text-gray-400">
            Or continue with
          </span>
        </div>

        {/* Display backend error message if any */}
        {backendError && (
          <div className="text-red-500 text-center mb-4">{backendError}</div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-400 transition-colors duration-200 w-5 h-5" />
              <input
                id="username"
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
                className={`w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 ${
                  errors.username ? 'focus:ring-red-500' : 'focus:ring-green-500'
                } focus:outline-none transition-all duration-200`}
                placeholder="Enter your username"
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-describedby="username-error"
              />
            </div>
            {/* Display validation error for username */}
            {errors.username && (
              <p
                className="text-red-500 text-sm mt-1"
                id="username-error"
                role="alert"
              >
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="relative group">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-400 transition-colors duration-200 w-5 h-5" />
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 ${
                  errors.email ? 'focus:ring-red-500' : 'focus:ring-green-500'
                } focus:outline-none transition-all duration-200`}
                placeholder="Enter your email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby="email-error"
              />
            </div>
            {/* Display validation error for email */}
            {errors.email && (
              <p
                className="text-red-500 text-sm mt-1"
                id="email-error"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-400 transition-colors duration-200 w-5 h-5" />
              <input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full bg-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500' : 'focus:ring-green-500'
                } focus:outline-none transition-all duration-200`}
                placeholder="Create a password"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby="password-error"
              />
            </div>
            {/* Display validation error for password */}
            {errors.password && (
              <p
                className="text-red-500 text-sm mt-1"
                id="password-error"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center justify-between text-sm">
            <label
              htmlFor="terms"
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                id="terms"
                type="checkbox"
                {...register('terms', {
                  required: 'You must agree to the terms and conditions',
                })}
                className="rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                aria-invalid={errors.terms ? 'true' : 'false'}
              />
              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-200">
                I agree to the{' '}
                <a
                  href="/terms"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Terms and Conditions
                </a>
              </span>
            </label>
          </div>
          {/* Display validation error for terms */}
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.terms.message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium rounded-lg py-3 flex items-center justify-center space-x-2 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Create an account</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-green-400 hover:text-green-300 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;