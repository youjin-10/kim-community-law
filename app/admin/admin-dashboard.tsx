// app/admin/admin-dashboard.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Lawyer {
  id: string;
  username: string;
  email: string;
  nickname: string;
  license_file: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const supabase = createClient();
  const [pendingLawyersCount, setPendingLawyersCount] = useState<number>(0);

  useEffect(() => {
    fetchPendingLawyersCount();
  }, []);

  const fetchPendingLawyersCount = async () => {
    const { count, error } = await supabase
      .from('lawyer_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending lawyers count:', error);
    } else {
      setPendingLawyersCount(count || 0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
      <div className="mb-5">
        <p className="text-lg">
          Pending Approvals: <span className="font-semibold">{pendingLawyersCount}</span>
        </p>
        <Link href="/admin/approve-lawyers" className="text-blue-600 hover:text-blue-800 underline">
          Go to Approve Lawyers Page
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;