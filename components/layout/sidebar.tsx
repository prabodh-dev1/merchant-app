'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Gift, Users, BarChart3, Building2, Store } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: UserRole;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'TENANT_MARKETING_ADMIN', 'MERCHANT_ADMIN'],
  },
  {
    href: '/tenants',
    label: 'Tenants',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['SUPER_ADMIN'],
  },
  {
    href: '/merchants',
    label: 'Merchants',
    icon: <Store className="h-5 w-5" />,
    roles: ['SUPER_ADMIN'],
  },
  {
    href: '/events',
    label: 'Events',
    icon: <Calendar className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'TENANT_MARKETING_ADMIN'],
  },
  {
    href: '/rewards',
    label: 'Rewards',
    icon: <Gift className="h-5 w-5" />,
    roles: ['MERCHANT_ADMIN'],
  },
  {
    href: '/rewards/claim',
    label: 'Claim Reward',
    icon: <Gift className="h-5 w-5" />,
    roles: ['MERCHANT_ADMIN'],
  },
  {
    href: '/users',
    label: 'Users',
    icon: <Users className="h-5 w-5" />,
    roles: ['SUPER_ADMIN'],
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['SUPER_ADMIN', 'TENANT_MARKETING_ADMIN', 'MERCHANT_ADMIN'],
  },
];

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-slate-800 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-700 px-6">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-blue-600 p-2">
            <Gift className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">Merchant App</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
