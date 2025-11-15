"use client"

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import DiscussionTree from '@/components/tree/DiscussionTree';
import { apiClient } from '@/lib/api';

export default function Home() {
  const { user, logout, initializeAuth, initialized } = useStore();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!initialized) {
    return (
      <p>
        Loading...
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Numerical Discussion Tree
            </h1>
            <p className="text-slate-600">
              Communicate through numbers and mathematical operations
            </p>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-700">
                  Welcome, <strong>{user.username}</strong>
                </span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setAuthMode('login')}>Login</Button>
                <Button variant="outline" onClick={() => setAuthMode('register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </header>

        {!user && authMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative">
              <Button
                variant="ghost"
                className="absolute -top-2 -right-2 z-10"
                onClick={() => setAuthMode(null)}
              >
                ✕
              </Button>
              {authMode === 'login' ? (
                <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        )}

        <DiscussionTree />
      </div>
    </main>
  );
}