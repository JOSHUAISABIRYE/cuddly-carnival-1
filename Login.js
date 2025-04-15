'use client'
import { Fugaz_One } from "next/font/google";
import React, { useState } from 'react';
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const fugaz = Fugaz_One({ subsets: ['latin'], weight: ['400'] });

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { signup, login } = useAuth();
  const [authenticating, setAuthenticating] = useState(false);

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      alert('Please enter a valid email and password (6 characters or more)');
      return;
    }

    setAuthenticating(true);
    try {
      if (isRegister) {
        console.log('Registering...');
        await signup(email, password);
      } else {
        console.log('Logging in...');
        await login(email, password);
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    } finally {
      setAuthenticating(false);
    }
  }

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
      <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>
        {isRegister ? 'Register' : 'Log In'}
      </h3>
      <p>You&#39;re one step away!</p>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none'
        placeholder='Email'
        type='email'
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none'
        placeholder='Password'
        type='password'
      />

      <div className='max-w-[400px] w-full mx-auto'>
        <Button
          clickHandler={handleSubmit}
          text={authenticating ? 'Submitting...' : 'Submit'}
          full
        />
      </div>

      <p className='text-sm sm:text-base'>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className='text-indigo-600 font-semibold'
        >
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

export default Login;
