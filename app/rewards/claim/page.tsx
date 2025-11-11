'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

type ClaimState = 'input' | 'verified' | 'success' | 'error';

export default function ClaimRewardPage() {
  const [rewardCode, setRewardCode] = useState('');
  const [state, setState] = useState<ClaimState>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rewardData, setRewardData] = useState<Record<string, unknown> | null>(null);

  const handleVerify = async () => {
    if (rewardCode.length !== 8) {
      setError('Reward code must be exactly 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('rewards')
        .select('*')
        .eq('code_part1', rewardCode.toUpperCase())
        .single();

      if (fetchError || !data) {
        setError('Reward code not found. Please verify the code.');
        setState('error');
        return;
      }

      if (data.status === 'CLAIMED') {
        setError('This reward has already been claimed');
        setState('error');
        return;
      }

      if (data.status === 'EXPIRED') {
        setError('This reward has expired');
        setState('error');
        return;
      }

      setRewardData(data);
      setState('verified');
    } catch {
      setError('An error occurred. Please try again.');
      setState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!rewardData) return;

    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('rewards')
        .update({
          status: 'CLAIMED',
          claimed_at: new Date().toISOString(),
        })
        .eq('id', rewardData.id as string);

      if (updateError) throw updateError;

      setState('success');
    } catch {
      setError('Failed to claim reward. Please try again.');
      setState('error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRewardCode('');
    setState('input');
    setError('');
    setRewardData(null);
  };

  return (
    <DashboardLayout pageTitle="Claim Reward">
      <div className="mx-auto max-w-2xl">
        {state === 'input' && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Reward Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Reward Code (8 characters)
                </label>
                <Input
                  value={rewardCode}
                  onChange={(e) => setRewardCode(e.target.value.toUpperCase())}
                  placeholder="ABC12345"
                  maxLength={8}
                  className="mt-2 font-mono text-lg"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter the first part of the reward code shown to the customer
                </p>
              </div>
              <Button
                onClick={handleVerify}
                className="w-full"
                disabled={loading || rewardCode.length !== 8}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </CardContent>
          </Card>
        )}

        {state === 'verified' && rewardData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Valid Reward Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-slate-50 p-6">
                <div className="text-center">
                  <p className="text-sm text-slate-600">Reward Code</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-slate-900">
                    {String(rewardData.code_part1)}
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">Reward Value</p>
                  <p className="mt-2 text-4xl font-bold text-blue-600">
                    {formatCurrency(Number(rewardData.reward_value))}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Preview Only
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleReset} variant="secondary" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleClaim} className="flex-1" disabled={loading}>
                  {loading ? 'Processing...' : 'Claim Reward'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {state === 'success' && rewardData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span>Claim Accepted!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-green-50 p-6">
                <div className="text-center">
                  <Gift className="mx-auto h-16 w-16 text-green-500" />
                  <p className="mt-4 text-sm font-medium text-slate-600">Full Reward Code</p>
                  <p className="mt-2 font-mono text-xl font-bold text-slate-900">
                    {String(rewardData.full_code)}
                  </p>
                  <p className="mt-6 text-sm font-medium text-slate-600">Reward Value</p>
                  <p className="mt-2 text-4xl font-bold text-green-600">
                    {formatCurrency(Number(rewardData.reward_value))}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    Claimed: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
              <Button onClick={handleReset} className="w-full">
                Claim Another Reward
              </Button>
            </CardContent>
          </Card>
        )}

        {state === 'error' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-6 w-6" />
                <span>Claim Failed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <Button onClick={handleReset} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
