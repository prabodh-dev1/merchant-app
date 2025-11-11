'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tenant } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTenants(data || []);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Tenants">
        <div className="text-center">Loading tenants...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Tenants">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-slate-600">Manage tenant organizations</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Tenant</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          {tenants.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Building2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4">No tenants found. Add your first tenant to get started.</p>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Tenant Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Code
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
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {tenant.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-600">
                        {tenant.code}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={tenant.status}>{tenant.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(tenant.created_at)}
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
