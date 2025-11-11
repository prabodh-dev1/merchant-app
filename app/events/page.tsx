'use client';

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MarketingEvent } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('marketing_events')
          .select(`
            *,
            tenant:tenants(name),
            merchant:merchants(name, code)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Marketing Events">
        <div className="text-center">Loading events...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Marketing Events">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-slate-600">Manage marketing events and reward campaigns</p>
        </div>
        <Link href="/events/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4">No events found. Create your first event to get started.</p>
              <Link href="/events/new">
                <Button className="mt-4">Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Event Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Merchant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Rewards
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {event.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {event.merchant?.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={event.status}>{event.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {event.total_rewards} rewards
                        <br />
                        <span className="text-xs text-slate-500">
                          {formatCurrency(Number(event.min_reward_value))} - {formatCurrency(Number(event.max_reward_value))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDate(event.start_date)}
                        <br />
                        <span className="text-xs text-slate-500">to {formatDate(event.end_date)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/events/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {event.status === 'DRAFT' && (
                            <Link href={`/events/${event.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
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
