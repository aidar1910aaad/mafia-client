'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '../../api/auth';
import { Check, X } from 'lucide-react';
import AdminHeader from './Header/AdminHeader';
import AdminNavigation from './Navigation/AdminNavigation';
import AdminFooter from './Footer/AdminFooter';
import UsersTab from './Users/UsersTab';
import ClubsTab from './Clubs/ClubsTab';
import TournamentsTab from './Tournaments/TournamentsTab';
import StatisticsTab from './Statistics/StatisticsTab';
import SettingsTab from './Settings/SettingsTab';

export default function AdminPanel() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await authAPI.verifyToken();
                if (response.success && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                // Error getting user info
            } finally {
                setLoading(false);
            }
        };

        getUserInfo();
    }, []);

    // Очистка сообщений через 3 секунды
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <div className="text-white text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'users':
                return <UsersTab message={message} />;
            case 'clubs':
                return <ClubsTab message={message} setMessage={setMessage} />;
            case 'tournaments':
                return <TournamentsTab message={message} setMessage={setMessage} />;
            case 'statistics':
                return <StatisticsTab />;
            case 'settings':
                return <SettingsTab message={message} setMessage={setMessage} />;
            default:
                return <UsersTab message={message} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AdminHeader user={user} />
            <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 max-w-[1280px] mx-auto px-4 py-8 w-full">
                {/* Сообщения */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl border ${
                        message.type === 'success' 
                            ? 'bg-green-900/30 border-green-700 text-green-400' 
                            : 'bg-red-900/30 border-red-700 text-red-400'
                    }`}>
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <X className="w-5 h-5" />
                            )}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    </div>
                )}

                {renderActiveTab()}
            </main>

            <AdminFooter />
        </div>
    );
} 