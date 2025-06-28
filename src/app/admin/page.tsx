import AuthGuard from '../../components/Auth/AuthGuard';
import AdminPanel from '../../components/Admin/AdminPanel';
import AdminWrapper from '../../components/Admin/AdminWrapper';

export default function AdminPage() {
    return (
        <AdminWrapper>
            <AuthGuard requireAuth={true} requireAdmin={true}>
                <AdminPanel />
            </AuthGuard>
        </AdminWrapper>
    );
} 