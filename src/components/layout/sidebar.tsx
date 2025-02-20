'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MainNav } from './main-nav';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/lib/stores/sidebar-store';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function Sidebar() {
  const { isOpen, toggle, close } = useSidebarStore();

  // Close sidebar on narrow screens
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 1024) {
        close();
      }
    };

    // Initial check
    checkWidth();

    // Add event listener
    window.addEventListener('resize', checkWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkWidth);
  }, [close]);

  return (
    <>
      {/* Hamburger menu - always visible */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggle}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex h-full flex-col gap-4">
          <div className="flex h-[60px] items-center px-6">
            <h1 className="text-lg font-semibold">Idle Merge Battle</h1>
          </div>
          <Separator />
          <ScrollArea className="flex-1 px-4">
            <MainNav />
          </ScrollArea>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
} 