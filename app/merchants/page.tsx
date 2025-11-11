'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Merchant } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const { data, error } = await supabase
          .from('merchants')
          .select(`
            *,
            tenant:tenants(name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMerchants(data || []);
      } catch (error) {
        console.error('Error fetching merchants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Merchants">
        <div className="text-center">Loading merchants...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Merchants">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-slate-600">Manage merchant partners</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Merchant</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          {merchants.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Store className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4">No merchants found. Add your first merchant to get started.</p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Merchant
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Merchant Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Tenant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {merchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {merchant.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-600">
                        {merchant.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {merchant.tenant?.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={merchant.status}>{merchant.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(merchant.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
