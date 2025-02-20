'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Coins, Swords, Grid2X2, Shield, Settings } from 'lucide-react';

const routes = [
  {
    href: '/resources',
    label: 'Resources',
    description: 'Gather and manage your resources',
    icon: Coins
  },
  {
    href: '/battle',
    label: 'Battle',
    description: 'Fight enemies and level up',
    icon: Swords
  },
  {
    href: '/merge',
    label: 'Merge',
    description: 'Combine items to create powerful equipment',
    icon: Grid2X2
  },
  {
    href: '/equipment',
    label: 'Equipment',
    description: 'Manage and upgrade your equipment',
    icon: Shield
  },
  {
    href: '/settings',
    label: 'Settings',
    description: 'Configure game options and developer tools',
    icon: Settings
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Button
            key={route.href}
            variant={pathname === route.href ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start text-primary',
              pathname === route.href && 'bg-accent'
            )}
            asChild
          >
            <Link href={route.href}>
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">{route.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{route.description}</span>
                </div>
              </div>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
} 