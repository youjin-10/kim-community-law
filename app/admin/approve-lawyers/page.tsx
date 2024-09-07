// app/admin/approve-lawyers/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ApprovalList from './approval-list';


type PendingLawyer = {
  id: string;
  nickname: string;
  license_file: string;
  status: string;
  users: {
    email: string;
  };
};

export default async function AdminApproveLawyersPage() {
  const supabase = createClient();
  
  // Check if the user is authenticated and is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  
  // Fetch admin status (you'll need to implement this based on your schema)
  const { data: adminData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('auth_id', user.id)
    .single();

  if (!adminData?.is_admin) {
    redirect('/'); // Redirect non-admin users
  }

  // Fetch pending lawyer profiles with associated email
  const { data: pendingLawyers, error } = await supabase
    .from('lawyer_profiles')
    .select(`
      id,
      nickname,
      license_file,
      status,
      users!inner (
        email
      )
    `)
    .eq('status', 'pending')
    .returns<PendingLawyer[]>();;


  if (error) {
    console.error('Error fetching pending lawyers:', error);
    return <div>Error loading pending lawyers. Please try again later.</div>;
  }

  // Process the data to include email directly in the lawyer object
  const processedLawyers = pendingLawyers?.map(lawyer => {
    console.log('lawyer: ',lawyer)
    const { id, nickname, license_file, status, users } = lawyer;
    return {
      id,
      nickname,
      license_file,
      status,
      email: users.email || 'Email not available'
    }
  }) || [];


  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Approve Pending Lawyers</h1>
      <ApprovalList lawyers={processedLawyers} />
    </div>
  );
}