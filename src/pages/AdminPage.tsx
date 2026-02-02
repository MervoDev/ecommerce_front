import { AdminLayout } from '../admin/AdminLayout';
import '../admin/admin.css';

interface AdminPageProps {
  onBackToShop: () => void;
}

export function AdminPage({ onBackToShop }: AdminPageProps) {
  return (
    <div className="admin-page">
      <AdminLayout onBackToShop={onBackToShop} />
    </div>
  );
}