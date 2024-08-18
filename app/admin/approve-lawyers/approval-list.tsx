
// app/admin/approve-lawyers/approval-list.tsx


'use client'

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import LicenseViewer from './license-viewer';

type Lawyer = {
  id: string;
  nickname: string;
  license_file: string;
  status: string;
  email: string;
};

const supabase = createClient();

export default function ApprovalList({ lawyers }: { lawyers: Lawyer[] }) {
  const [pendingLawyers, setPendingLawyers] = useState(lawyers);

  const handleApproval = async (lawyerId: string, approve: boolean) => {
    const newStatus = approve ? 'approved' : 'rejected';
    const { error } = await supabase
      .from('lawyer_profiles')
      .update({ status: newStatus })
      .eq('id', lawyerId);

    if (error) {
      console.error('Error updating lawyer status:', error);
      return;
    }

    setPendingLawyers(pendingLawyers.filter(lawyer => lawyer.id !== lawyerId));
  };

  return (
    <div>
      {pendingLawyers.length === 0 ? (
        <p>No pending lawyers to approve.</p>
      ) : (
        <ul className="space-y-4">
          {pendingLawyers.map((lawyer) => {
            console.log('lawyer? ', lawyer)

            return (
                <li key={lawyer.id} className="border p-4 rounded-md">
                    <p><strong>Nickname:</strong> {lawyer.nickname}</p>
                    <p><strong>Email:</strong> {lawyer.email}</p>
                    <LicenseViewer filePath={lawyer.license_file} />
                    <div className="mt-2">
                        <button
                            onClick={() => handleApproval(lawyer.id, true)}
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleApproval(lawyer.id, false)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Reject
                        </button>
                    </div>
                </li>

            )
          })}
        </ul>
      )}
    </div>
  );
}