import AuthGuard from '../../components/Auth/AuthGuard';
import Dashboard from '../../components/Dashboard/Dashboard';

export default function DashboardPage() {
    return (
        <AuthGuard requireAuth={true} requireAdmin={false}>
            <Dashboard />
        </AuthGuard>
    );
} 