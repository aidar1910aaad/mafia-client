'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clubsAPI, Club, ClubOwner } from '../../../../api/clubs';
import { seasonsAPI, Season, CreateSeasonRequest } from '../../../../api/seasons';
import { usersAPI, User } from '../../../../api/users';
import { authAPI } from '../../../../api/auth';
import { Calendar, Plus, Users, Clock, MapPin, User as UserIcon } from 'lucide-react';
import Toast from '../../../../components/Toast/Toast';
import DatePicker from '../../../../components/UI/DatePicker';

export default function ClubSeasonsPage() {
    const params = useParams();
    const router = useRouter();
    const clubId = params.id;
    const [club, setClub] = useState<Club | null>(null);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingSeason, setCreatingSeason] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });
    
    const [formData, setFormData] = useState<CreateSeasonRequest>({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        clubId: 0,
        refereeId: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Получаем информацию о текущем пользователе
                const userResponse = await authAPI.verifyToken();
                if (userResponse.success && userResponse.user) {
                    setCurrentUser(userResponse.user);
                }

                // Получаем информацию о клубе
                if (typeof clubId === 'string') {
                    const clubData = await clubsAPI.getClubById(clubId);
                    setClub(clubData);
                    
                    // Проверяем права доступа
                    if (clubData.owner.id !== userResponse.user?.id && 
                        !clubData.administrators.some((admin: ClubOwner) => admin.id === userResponse.user?.id) &&
                        userResponse.user?.role !== 'admin') {
                        router.push('/clubs');
                        return;
                    }

                    // Получаем сезоны клуба
                    const seasonsData = await seasonsAPI.getClubSeasons(clubData.id);
                    setSeasons(seasonsData);

                    // Получаем список всех пользователей для выбора судьи
                    try {
                        const usersData = await usersAPI.getAllUsers();
                        setAllUsers(usersData);
                    } catch (err) {
                        console.warn('Не удалось загрузить список пользователей:', err);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        if (clubId) {
            fetchData();
        }
    }, [clubId, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateSeason = async () => {
        if (!formData.name.trim() || !formData.description.trim() || !formData.startDate || !formData.endDate || !formData.refereeId) {
            setToast({ 
                message: 'Пожалуйста, заполните все обязательные поля', 
                type: 'error', 
                isVisible: true 
            });
            return;
        }

        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            setToast({ 
                message: 'Дата окончания должна быть позже даты начала', 
                type: 'error', 
                isVisible: true 
            });
            return;
        }

        try {
            setCreatingSeason(true);
            const newSeason = await seasonsAPI.createSeason({
                ...formData,
                clubId: club!.id,
                refereeId: parseInt(formData.refereeId.toString())
            });
            
            setSeasons([...seasons, newSeason]);
            setShowCreateModal(false);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                clubId: 0,
                refereeId: 0
            });
            
            setToast({ 
                message: 'Сезон успешно создан!', 
                type: 'success', 
                isVisible: true 
            });
        } catch (err) {
            setToast({ 
                message: err instanceof Error ? err.message : 'Ошибка создания сезона', 
                type: 'error', 
                isVisible: true 
            });
        } finally {
            setCreatingSeason(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#161616] flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <div className="text-white text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#161616] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-xl mb-4">Ошибка загрузки</div>
                    <div className="text-gray-400 mb-6">{error}</div>
                    <button 
                        onClick={() => router.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Назад
                    </button>
                </div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-[#161616] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-xl mb-4">Клуб не найден</div>
                    <button 
                        onClick={() => router.push('/clubs')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        К списку клубов
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#161616]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-[#404040]/50">
                <div className="max-w-[1280px] mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-2xl font-bold mb-2">Управление сезонами</h1>
                            <div className="flex items-center gap-4 text-gray-400">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {club.name}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {club.members.length + club.administrators.length + 1} участников
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Создать сезон
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1280px] mx-auto px-4 py-8">
                {seasons.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-white text-xl font-semibold mb-2">Сезоны не найдены</h3>
                        <p className="text-gray-400 mb-6">Создайте первый сезон для вашего клуба</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            Создать сезон
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seasons.map((season) => (
                            <div key={season.id} className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6 hover:border-[#505050]/50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white text-lg font-semibold">{season.name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        season.status === 'ACTIVE' ? 'bg-green-900/30 text-green-400' :
                                        season.status === 'INACTIVE' ? 'bg-gray-900/30 text-gray-400' :
                                        'bg-blue-900/30 text-blue-400'
                                    }`}>
                                        {season.status === 'ACTIVE' ? 'Активный' :
                                         season.status === 'INACTIVE' ? 'Неактивный' : 'Завершен'}
                                    </span>
                                </div>
                                
                                <p className="text-gray-400 text-sm mb-4">{season.description}</p>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>Начало: {new Date(season.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>Окончание: {new Date(season.endDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Season Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1D1D1D] rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-white text-xl font-bold mb-4">Создать новый сезон</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Название сезона *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Введите название сезона"
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Описание *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Опишите сезон..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <DatePicker
                                    value={formData.startDate}
                                    onChange={(date) => setFormData({ ...formData, startDate: date })}
                                    label="Дата начала *"
                                    placeholder="Выберите дату начала"
                                    minDate={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <DatePicker
                                    value={formData.endDate}
                                    onChange={(date) => setFormData({ ...formData, endDate: date })}
                                    label="Дата окончания *"
                                    placeholder="Выберите дату окончания"
                                    minDate={formData.startDate || new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Судья *
                                </label>
                                <select
                                    name="refereeId"
                                    value={formData.refereeId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Выберите судью</option>
                                    {allUsers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.nickname} ({user.email}) - {user.role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData({
                                        name: '',
                                        description: '',
                                        startDate: '',
                                        endDate: '',
                                        clubId: 0,
                                        refereeId: 0
                                    });
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                disabled={creatingSeason}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleCreateSeason}
                                disabled={creatingSeason}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                                {creatingSeason ? 'Создание...' : 'Создать сезон'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast уведомления */}
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })} 
            />
        </div>
    );
} 