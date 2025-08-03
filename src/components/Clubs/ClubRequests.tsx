'use client';

import { useState, useEffect } from 'react';
import { clubsAPI, JoinRequest } from '../../api/clubs';
import { UserCheck, UserX, Clock, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '../../api/API_URL';

interface ClubRequestsProps {
  clubId: number;
}

export default function ClubRequests({ clubId }: ClubRequestsProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRequests();
  }, [clubId]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await clubsAPI.getClubRequests(clubId);
      setRequests(requestsData);
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(requestId));
      await clubsAPI.approveRequest(requestId);
      // Обновляем список заявок
      await fetchRequests();
    } catch (err) {
      console.error('Ошибка одобрения заявки:', err);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(requestId));
      await clubsAPI.rejectRequest(requestId);
      // Обновляем список заявок
      await fetchRequests();
    } catch (err) {
      console.error('Ошибка отклонения заявки:', err);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarUrl = (avatar: string) => {
    if (!avatar || avatar === 'default-avatar.png') {
      return null;
    }
    
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    
    return `${API_URL}/${avatar}`;
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Заявки на вступление
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Заявки на вступление
        </h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'PENDING');

  return (
    <div className="bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#404040]/50 rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <UserCheck className="w-5 h-5" />
        Заявки на вступление
        {pendingRequests.length > 0 && (
          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {pendingRequests.length}
          </span>
        )}
      </h3>
      
      {pendingRequests.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          Нет новых заявок на вступление
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-[#1D1D1D] border border-[#404040]/30 rounded-xl p-4 hover:border-[#404040]/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Аватар пользователя */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                    {request.user.avatar && getAvatarUrl(request.user.avatar) ? (
                      <img
                        src={getAvatarUrl(request.user.avatar)!}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      (request.user.name || request.user.nickname)?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                </div>

                {/* Информация о пользователе */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium text-base">
                        {request.user.name || request.user.nickname || request.user.email}
                      </h4>
                      <p className="text-gray-400 text-sm">{request.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 text-xs font-medium rounded-full border border-yellow-500/30">
                        Ожидает
                      </span>
                    </div>
                  </div>

                  {/* Сообщение */}
                  {request.message && (
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {request.message}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Дата подачи заявки */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="w-3 h-3" />
                    <span>Подана {formatDate(request.createdAt)}</span>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingRequests.has(request.id)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequests.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processingRequests.has(request.id)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingRequests.has(request.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Отклонить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 