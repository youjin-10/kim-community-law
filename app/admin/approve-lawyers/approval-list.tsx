// app/admin/approve-lawyers/approval-list.tsx

'use client'

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import LicenseViewer from './license-viewer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-4">
      {pendingLawyers.length === 0 ? (
        <p className="text-center text-gray-500">No pending lawyers to approve.</p>
      ) : (
        pendingLawyers.map((lawyer) => (
          <Card key={lawyer.id}>
            <CardHeader>
              <CardTitle>{lawyer.nickname}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div>
                  <Label>Email</Label>
                  <p>{lawyer.email}</p>
                </div>
                <div>
                  <Label>License</Label>
                  <LicenseViewer filePath={lawyer.license_file} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={() => handleApproval(lawyer.id, true)}
                variant="default"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleApproval(lawyer.id, false)}
                variant="destructive"
              >
                Reject
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}