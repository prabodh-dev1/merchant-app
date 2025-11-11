'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, TrendingUp, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reward } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState<'outstanding' | 'claimed'>('outstanding');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    outstanding: 0,
    claimed: 0,
    totalValue: 0,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const { data, error } = await supabase
          .from('rewards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const allRewards = data || [];
        setRewards(allRewards);

        const outstanding = allRewards.filter(
          (r) => r.status === 'AVAILABLE' || r.status === 'DISTRIBUTED'
        );
        const claimed = allRewards.filter((r) => r.status === 'CLAIMED');
        const totalValue = claimed.reduce((sum, r) => sum + Number(r.reward_value), 0);

        setStats({
          outstanding: outstanding.length,
          claimed: claimed.length,
          totalValue,
        });
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const filteredRewards =
    activeTab === 'outstanding'
      ? rewards.filter((r) => r.status === 'AVAILABLE' || r.status === 'DISTRIBUTED')
      : rewards.filter((r) => r.status === 'CLAIMED');

  if (loading) {
    return (
      <DashboardLayout pageTitle="Rewards Dashboard">
        <div className="text-center">Loading rewards...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Rewards Dashboard">
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.outstanding}</div>
            <p className="text-xs text-slate-500">Available and distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Rewards</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.claimed}</div>
            <p className="text-xs text-slate-500">Successfully redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Claimed</CardTitle>
            <Gift className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-slate-500">Cumulative reward value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('outstanding')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'outstanding'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outstanding ({stats.outstanding})
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'claimed'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Claimed ({stats.claimed})
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Reward Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Value
                  </th>
                  {activeTab === 'claimed' && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                        Customer ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                        Claimed At
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRewards.map((reward) => (
                  <tr key={reward.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-sm text-slate-900">
                      {activeTab === 'claimed' ? reward.full_code : reward.code_part1}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={reward.status}>{reward.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {formatCurrency(Number(reward.reward_value))}
                    </td>
                    {activeTab === 'claimed' && (
                      <>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {reward.customer_id || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {reward.claimed_at ? formatDateTime(reward.claimed_at) : 'N/A'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
