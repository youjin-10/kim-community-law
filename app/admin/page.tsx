import AdminDashboard from "./admin-dashboard";

export default function AdminPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Admin</h1>
      <AdminDashboard />
    </div>
  );
}