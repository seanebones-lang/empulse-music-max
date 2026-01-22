'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePlayer } from '@/store/player-store';
import { Button } from '@/components/ui/button';
import {
  Home,
  Search,
  Library,
  Music,
  Heart,
  Play,
  Settings,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  GraduationCap,
  Users,
  Mic,
  UserCog,
  Code,
  User,
  BarChart3,
  ChevronDown,
  Crown,
  Info,
  ExternalLink,
} from 'lucide-react';

export function Sidebar() {
  const router = useRouter();
  const { sidebarWidth, isSidebarCollapsed, setSidebarWidth, toggleSidebarCollapsed } = usePlayer();
  const [isResizing, setIsResizing] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPlaylistsOpen, setIsPlaylistsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const minWidth = 200;
  const maxWidth = 400;
  const collapsedWidth = 64;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setSidebarWidth]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const navItems = [
    { icon: Home, label: 'Home', active: true, path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Crown, label: 'Premium', path: '/premium' },
  ];

  const playlists = [
    { icon: Music, label: 'Liked Songs', count: 125 },
    { icon: Heart, label: 'Favorites', count: 42 },
    { icon: Play, label: 'Recently Played', count: 89 },
  ];

  const onboardingGuides = [
    { icon: Users, label: 'Listeners', path: '/onboarding/listeners' },
    { icon: Heart, label: 'Sponsors', path: '/onboarding/sponsors' },
    { icon: Mic, label: 'Artists', path: '/onboarding/artists' },
    { icon: UserCog, label: 'Artist Management', path: '/onboarding/artist-management' },
    { icon: Code, label: 'Developer', path: '/onboarding/developer' },
  ];

  const currentWidth = isSidebarCollapsed ? collapsedWidth : sidebarWidth;

  return (
    <>
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          width: currentWidth,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 z-40 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 flex flex-col overflow-hidden"
        style={{ width: currentWidth }}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold text-white">EmPulse</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapsed}
            className="text-white hover:bg-white/10 ml-auto"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant={item.active ? 'secondary' : 'ghost'}
                className={`w-full justify-start text-white ${
                  item.active ? 'bg-purple-600/30 hover:bg-purple-600/40' : 'hover:bg-white/10'
                }`}
                onClick={() => {
                  if (item.path) {
                    router.push(item.path);
                  }
                }}
              >
                <Icon className="h-5 w-5 mr-3 shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Button>
            );
          })}

          {/* Artist Dashboard & Signup Links */}
          {!isSidebarCollapsed && (
            <div className="pt-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-purple-600/30 border border-purple-500/30"
                onClick={() => router.push('/artist/dashboard')}
              >
                <BarChart3 className="h-5 w-5 mr-3 shrink-0" />
                <span>Artist Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-purple-600/30 border border-purple-500/30"
                onClick={() => router.push('/artist/signup')}
              >
                <User className="h-5 w-5 mr-3 shrink-0" />
                <span>Artist Signup</span>
              </Button>
            </div>
          )}

          {/* Onboarding Section - Dropdown */}
          <div className="pt-6">
            {isSidebarCollapsed ? (
              <Button
                variant="ghost"
                className="w-full justify-center text-gray-300 hover:text-white hover:bg-white/10"
                title="Onboarding Guides"
              >
                <GraduationCap className="h-5 w-5" />
              </Button>
            ) : (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-gray-300 hover:text-white hover:bg-white/10 px-3"
                  onClick={() => setIsOnboardingOpen(!isOnboardingOpen)}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Onboarding</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isOnboardingOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
                {isOnboardingOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pl-3 pt-1">
                      {onboardingGuides.map((guide) => {
                        const Icon = guide.icon;
                        return (
                          <Button
                            key={guide.label}
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                            onClick={() => {
                              router.push(guide.path);
                            }}
                          >
                            <Icon className="h-4 w-4 mr-3 shrink-0" />
                            <span className="flex-1 text-left truncate">{guide.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Playlists Section - Dropdown */}
          {!isSidebarCollapsed && (
            <div className="pt-6">
              <Button
                variant="ghost"
                className="w-full justify-between text-gray-300 hover:text-white hover:bg-white/10 px-3"
                onClick={() => setIsPlaylistsOpen(!isPlaylistsOpen)}
              >
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Playlists</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isPlaylistsOpen ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              {isPlaylistsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pl-3 pt-1">
                    {playlists.map((playlist) => {
                      const Icon = playlist.icon;
                      return (
                        <Button
                          key={playlist.label}
                          variant="ghost"
                          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                        >
                          <Icon className="h-4 w-4 mr-3 shrink-0" />
                          <span className="flex-1 text-left truncate">{playlist.label}</span>
                          <span className="text-xs text-gray-500 ml-2">{playlist.count}</span>
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/10 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span className="ml-3">Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/10 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            onClick={() => window.open('https://empulse.mothership-ai.com/', '_blank')}
            title={isSidebarCollapsed ? 'About us' : ''}
          >
            <Info className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && (
              <span className="ml-3 flex items-center gap-2">
                About us
                <ExternalLink className="h-3 w-3 opacity-70" />
              </span>
            )}
          </Button>
        </div>
      </motion.aside>

      {/* Resize Handle */}
      {!isSidebarCollapsed && (
        <div
          ref={resizeRef}
          onMouseDown={handleResizeStart}
          className="fixed left-0 top-0 bottom-0 z-50 w-1 cursor-col-resize hover:bg-purple-500/50 transition-colors"
          style={{
            left: `${sidebarWidth}px`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-purple-500/30 rounded-full" />
        </div>
      )}
    </>
  );
}
