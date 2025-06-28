import AuthGuard from '../../components/Auth/AuthGuard';
import ProfilePage from '../../components/Profile/ProfilePage';

export default function Profile() {
    return (
        <AuthGuard requireAuth={true}>
            <ProfilePage />
        </AuthGuard>
    );
} 