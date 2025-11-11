'use client';

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Store, Calendar, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    tenants: 0,
    merchants: 0,
    activeEvents: 0,
    totalRewards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tenantsRes, merchantsRes, eventsRes, rewardsRes] = await Promise.all([
          supabase.from('tenants').select('id', { count: 'exact', head: true }),
          supabase.from('merchants').select('id', { count: 'exact', head: true }),
          supabase.from('marketing_events').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
          supabase.from('rewards').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          tenants: tenantsRes.count || 0,
          merchants: merchantsRes.count || 0,
          activeEvents: eventsRes.count || 0,
          totalRewards: rewardsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Dashboard">
        <div className="text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.tenants}</div>
            <p className="text-xs text-slate-500">Registered tenant organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Store className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.merchants}</div>
            <p className="text-xs text-slate-500">Active merchant partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-slate-500">Currently running marketing events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Gift className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRewards}</div>
            <p className="text-xs text-slate-500">Generated reward codes</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Merchant App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Manage your marketing events, reward codes, and track customer engagement all in one place.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
