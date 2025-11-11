'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Package, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsData {
  totalRewards: number;
  claimedRewards: number;
  distributedRewards: number;
  availableRewards: number;
  totalValue: number;
  claimedValue: number;
  claimRate: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRewards: 0,
    claimedRewards: 0,
    distributedRewards: 0,
    availableRewards: 0,
    totalValue: 0,
    claimedValue: 0,
    claimRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: rewards, error } = await supabase
          .from('rewards')
          .select('status, reward_value');

        if (error) throw error;

        const allRewards = rewards || [];
        const claimed = allRewards.filter((r) => r.status === 'CLAIMED');
        const distributed = allRewards.filter((r) => r.status === 'DISTRIBUTED');
        const available = allRewards.filter((r) => r.status === 'AVAILABLE');

        const totalValue = allRewards.reduce(
          (sum, r) => sum + Number(r.reward_value),
          0
        );
        const claimedValue = claimed.reduce(
          (sum, r) => sum + Number(r.reward_value),
          0
        );

        const claimRate =
          allRewards.length > 0
            ? (claimed.length / allRewards.length) * 100
            : 0;

        setAnalytics({
          totalRewards: allRewards.length,
          claimedRewards: claimed.length,
          distributedRewards: distributed.length,
          availableRewards: available.length,
          totalValue,
          claimedValue,
          claimRate,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Analytics">
        <div className="text-center">Loading analytics...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Analytics">
      <div className="mb-6">
        <p className="text-slate-600">Track reward performance and metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <Package className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalRewards}</div>
            <p className="text-xs text-slate-500">All generated rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.claimedRewards}</div>
            <p className="text-xs text-slate-500">Successfully redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distributed</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.distributedRewards}</div>
            <p className="text-xs text-slate-500">Given to customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.availableRewards}</div>
            <p className="text-xs text-slate-500">Ready to distribute</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reward Value</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(analytics.totalValue)}
            </div>
            <p className="text-xs text-slate-500">Aggregate value of all rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(analytics.claimedValue)}
            </div>
            <p className="text-xs text-slate-500">Total value redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.claimRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-500">Percentage of rewards claimed</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Reward Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-700">Claimed</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-900">
                  {analytics.claimedRewards}
                </span>
                <span className="text-sm text-slate-500">
                  {formatCurrency(analytics.claimedValue)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-700">Distributed</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {analytics.distributedRewards}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-700">Available</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {analytics.availableRewards}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
