'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { AuthUser } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  user: AuthUser;
  pageTitle?: string;
}

export function Navbar({ user, pageTitle }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        {pageTitle && (
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-blue-100 p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-slate-900">{user.name}</div>
            <div className="text-slate-500">{user.role.replace(/_/g, ' ')}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
