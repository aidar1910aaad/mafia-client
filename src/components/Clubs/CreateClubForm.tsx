'use client';

import { useState } from 'react';
import { clubsAPI, CreateClubRequest } from '../../api/clubs';

interface CreateClubFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CreateClubForm({ onSuccess, onCancel }: CreateClubFormProps) {
    const [formData, setFormData] = useState<CreateClubRequest>({
        name: '',
        description: '',
        city: '',
        socialMediaLink: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.description.trim() || !formData.city.trim()) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await clubsAPI.createClubRequest(formData);
            onSuccess?.();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Ошибка создания заявки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1D1D1D] rounded-2xl border border-[#404040]/50 shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="p-6 border-b border-[#404040]/50">
                    <h2 className="text-white text-xl font-bold">Создать заявку на клуб</h2>
                    <p className="text-[#A1A1A1] text-sm mt-1">
                        Заполните форму для создания нового клуба
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Название клуба *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Введите название клуба"
                            required
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
                            rows={3}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="Опишите ваш клуб"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Город *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Введите город"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ссылка на соц. сети
                        </label>
                        <input
                            type="url"
                            name="socialMediaLink"
                            value={formData.socialMediaLink}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="https://facebook.com/mafiaclub"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Дополнительное сообщение
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="Дополнительная информация о клубе"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-[#404040] hover:bg-[#505050] text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Отправка...
                                </div>
                            ) : (
                                'Отправить заявку'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 