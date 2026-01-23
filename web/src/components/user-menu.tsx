'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/supabase';
import {
  User,
  LogOut,
  Settings,
  UserCircle,
  Mail,
  ChevronDown,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface UserMenuProps {
  collapsed?: boolean;
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const router = useRouter();
  const { user, authenticated, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  if (!authenticated) {
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start text-white hover:bg-white/10 ${
          collapsed ? 'justify-center' : ''
        }`}
        onClick={() => router.push('/auth/login')}
      >
        <UserCircle className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="ml-3">Sign In</span>}
      </Button>
    );
  }

  if (collapsed) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-center text-white hover:bg-white/10"
            title={user?.email || 'User menu'}
          >
            <User className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-black/95 border-purple-500/30">
          <UserMenuContent user={user} onSignOut={handleSignOut} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-white hover:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">
                {user?.user_metadata?.name || 'User'}
              </span>
              <span className="text-xs text-gray-400 truncate max-w-[120px]">
                {user?.email}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black/95 border-purple-500/30">
        <UserMenuContent user={user} onSignOut={handleSignOut} />
      </SheetContent>
    </Sheet>
  );
}

interface UserMenuContentProps {
  user: User | null;
  onSignOut: () => void;
}

function UserMenuContent({ user, onSignOut }: UserMenuContentProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-purple-500/30">
        <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
          <User className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-white">
            {user?.user_metadata?.name || 'User'}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => {
            router.push('/profile');
          }}
        >
          <User className="h-4 w-4 mr-3" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={() => {
            router.push('/settings');
          }}
        >
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
      </div>

      <div className="pt-4 border-t border-purple-500/30">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
