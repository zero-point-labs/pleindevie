'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 py-6">
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RenovatePro Admin</h1>
                <p className="text-sm text-gray-500">Admin Access Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        style={{ 
          display: 'grid', 
          placeItems: 'center', 
          padding: '48px 24px',
          width: '100%'
        }}
      >
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '500px',
            minWidth: '400px'
          }}
        >
          {/* Login Card */}
          <div 
            className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/30"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              width: '100%',
              minWidth: '400px'
            }}
          >
            {/* Header Section */}
            <div style={{ padding: '48px 32px 32px', textAlign: 'center' }}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>
                Admin Login
              </h2>
              <p className="text-gray-600 text-lg">Sign in to access the admin dashboard</p>
            </div>

            {/* Form Section */}
            <div style={{ padding: '0 32px 48px' }}>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                
                {/* Email Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-gray-700"
                    style={{ marginBottom: '12px' }}
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    style={{
                      width: '100%',
                      height: '56px',
                      fontSize: '18px',
                      borderRadius: '12px',
                      padding: '0 16px'
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-semibold text-gray-700"
                    style={{ marginBottom: '12px' }}
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    style={{
                      width: '100%',
                      height: '56px',
                      fontSize: '18px',
                      borderRadius: '12px',
                      padding: '0 16px'
                    }}
                    required
                    disabled={isLoading}
                  />
                  
                  {/* Error Message */}
                  {error && (
                    <div 
                      className="bg-red-50 border border-red-200"
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '8px' }}>
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    width: '100%',
                    height: '56px',
                    fontSize: '18px',
                    borderRadius: '12px'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Security Notice */}
              <div 
                className="bg-blue-50 border border-blue-100"
                style={{
                  marginTop: '32px',
                  padding: '16px',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <svg 
                    className="w-6 h-6 text-blue-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    style={{ marginRight: '12px', marginTop: '2px' }}
                  >
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-blue-900 font-semibold" style={{ marginBottom: '4px' }}>
                      Secure Access
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Authentication is managed through Appwrite. Only authorized accounts can access the admin dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p className="text-gray-500">© 2024 RenovatePro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 