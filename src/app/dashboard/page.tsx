import AuthGuard from '../../components/Auth/AuthGuard';
import TournamentDetails from '../../components/TournamentDetails/TournamentDetails';

export default function DashboardPage() {
    return (
        <AuthGuard requireAuth={true} requireAdmin={false}>
            <TournamentDetails />
        </AuthGuard>
    );
} 