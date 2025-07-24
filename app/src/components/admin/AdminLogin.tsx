'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminLoginProps {
  onLogin: (code: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'Renovation123') {
      onLogin(code);
      setError('');
    } else {
      setError('Invalid access code');
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-slate-800 rounded-xl border border-brand-yellow/30 shadow-xl p-12 w-[500px]">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-brand-yellow mb-4">
              Admin Access
            </h1>
            <p className="text-slate-300 text-base">
              Enter your access code to continue
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label 
                htmlFor="access-code" 
                className="block text-base font-medium text-slate-200"
              >
                Access Code
              </label>
              <Input
                id="access-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your access code"
                className="w-full h-14 text-lg bg-slate-900 border-brand-yellow/30 text-white placeholder:text-slate-400 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 px-4"
                required
              />
              {error && (
                <div className="flex items-center gap-3 text-base text-red-400 mt-3">
                  <span className="inline-block w-5 h-5 bg-red-400/20 rounded-full text-center text-sm leading-5">!</span>
                  {error}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-brand-yellow hover:bg-brand-yellow-light text-brand-charcoal font-semibold transition-colors duration-200"
            >
              Access Admin Panel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 