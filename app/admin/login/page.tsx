'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminLogin() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const emailEl = document.getElementById('email') as HTMLInputElement;
    const passwordEl = document.getElementById('password') as HTMLInputElement;
    const formEmail = emailEl?.value?.trim();
    const formPassword = passwordEl?.value;

    if (!formEmail || !formPassword) {
      setStatus('Please enter both email and password');
      return;
    }

    setStatus('Signing in...');
    setLoading(true);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formEmail,
        password: formPassword,
      });

      if (error) {
        setStatus('Error: ' + error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setStatus('Error: No session returned');
        setLoading(false);
        return;
      }

      setStatus('Success! Redirecting...');
      window.location.href = '/admin';
    } catch (err) {
      setStatus('Error: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F5F0EB' }}
    >
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex gap-[3px]">
            <div className="w-[3px] h-5 bg-[#7C3AED] rounded-full" />
            <div className="w-[3px] h-3 bg-[#7C3AED] rounded-full mt-auto" />
            <div className="w-[3px] h-5 bg-[#7C3AED] rounded-full" />
          </div>
          <span className="font-mono text-xl font-semibold tracking-wide text-[#7C3AED]">
            Lenava
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E0D8] p-8">
          <h1 className="text-[18px] font-medium text-[#1A1A1A] text-center mb-1">
            Admin Panel
          </h1>
          <p className="text-[13px] text-[#8A8078] text-center mb-6">
            Sign in to access the dashboard
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] text-[#8A8078] mb-1.5 tracking-wide uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-11 px-3 rounded-lg border border-[#E8E0D8] text-[14px] text-[#1A1A1A] outline-none focus:border-[#7C3AED] transition-colors bg-white"
                placeholder="you@example.com"
                autoComplete="username"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] text-[#8A8078] mb-1.5 tracking-wide uppercase"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full h-11 px-3 rounded-lg border border-[#E8E0D8] text-[14px] text-[#1A1A1A] outline-none focus:border-[#7C3AED] transition-colors bg-white"
                placeholder="••••••••"
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
              />
            </div>

            {status && (
              <p
                className={`text-[13px] text-center ${
                  status.startsWith('Error')
                    ? 'text-red-600'
                    : status.startsWith('Success')
                    ? 'text-green-600'
                    : 'text-[#7C3AED]'
                }`}
              >
                {status}
              </p>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="h-11 rounded-lg bg-[#7C3AED] text-white text-[14px] font-medium hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
