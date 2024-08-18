// app/admin/admin-dashboard.tsx

'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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
  const [pendingLawyers, setPendingLawyers] = useState<Lawyer[]>([]);

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const fetchPendingLawyers = async () => {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending lawyers:', error);
    } else {
      setPendingLawyers(data || []);
    }
  };

  const approveLawyer = async (id: string) => {
    const { error } = await supabase
      .from('lawyers')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      console.error('Error approving lawyer:', error);
    } else {
      fetchPendingLawyers();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-3">Pending Approvals</h2>
      <ul className="space-y-4">
        {pendingLawyers.map((lawyer) => (
          <li key={lawyer.id} className="border p-4 rounded-md">
            <p><strong>Username:</strong> {lawyer.username}</p>
            <p><strong>Email:</strong> {lawyer.email}</p>
            <p><strong>Nickname:</strong> {lawyer.nickname}</p>
            <p><strong>License File:</strong> {lawyer.license_file}</p>
            <button
              onClick={() => approveLawyer(lawyer.id)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;