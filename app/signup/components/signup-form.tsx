'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [license, setLicense] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !nickname || !license) {
      setError('All fields are required');
      return;
    }

    try {
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // 2. Insert into users table
        const { data: userData, error: usersError } = await supabase
          .from('users')
          .insert({
            auth_id: authData.user.id,
            username: nickname, // Use nickname as username
            email,
          })
          .select()
          .single();

        if (usersError) throw usersError;

        if (!userData) throw new Error('Failed to create user');

        // 3. Upload the license file
        const fileExt = license.name.split('.').pop();
        const fileName = `${authData.user.id}-license.${fileExt}`;
        const { error: uploadError, data: fileData } = await supabase.storage
          .from('lawyer-licenses')
          .upload(fileName, license, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // 4. Insert into lawyer_profiles table
        const { error: profileError } = await supabase
          .from('lawyer_profiles')
          .insert({
            user_id: userData.id,
            nickname,
            license_file: fileData?.path,
            status: 'pending'
          });

        if (profileError) throw profileError;

        setIsSignUpComplete(true);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError((error as Error).message);
    }
  };

  if (isSignUpComplete) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up Successful!</h2>
        <p className="mb-4">Thank you for signing up. We've sent a confirmation email to <strong>{email}</strong>.</p>
        <p className="mb-4">Please check your email and click on the confirmation link to activate your account.</p>
        <p className="mb-4">If you don't see the email in your inbox, please check your spam folder.</p>
        <p className="mb-4">Once you've confirmed your email, you can proceed to log in.</p>
        <button
          onClick={() => router.push('/login')}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          Nickname
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="license" className="block text-sm font-medium text-gray-700">
          Lawyer's License (PDF or Image)
        </label>
        <input
          type="file"
          id="license"
          accept=".pdf,image/*"
          onChange={(e) => setLicense(e.target.files?.[0] || null)}
          className="mt-1 block w-full"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;