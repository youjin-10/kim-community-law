'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const supabase = createClient();

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        if (data.user.email_confirmed_at) {
          router.push('/dashboard');
        } else {
          setError('Please confirm your email before logging in.');
          setMessage('Need a new confirmation email?');
        }
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setMessage('Confirmation email resent. Please check your inbox.');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            {message}
            {message.includes('confirmation email') && (
              <Button
                variant="link"
                onClick={handleResendConfirmation}
                className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700"
              >
                Resend confirmation email
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;