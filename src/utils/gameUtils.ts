export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getResultColor = (result: string) => {
  switch (result) {
    case 'MAFIA_WIN':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'CITIZEN_WIN':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'DRAW':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

export const getResultText = (result: string) => {
  switch (result) {
    case 'MAFIA_WIN':
      return 'Победа мафии';
    case 'CITIZEN_WIN':
      return 'Победа горожан';
    case 'DRAW':
      return 'Ничья';
    default:
      return 'Неизвестно';
  }
};

export const getStatusColor = (status?: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'ACTIVE':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'UPCOMING':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'CANCELLED':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

export const getStatusText = (status?: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Завершена';
    case 'ACTIVE':
      return 'Активна';
    case 'UPCOMING':
      return 'Предстоящая';
    case 'CANCELLED':
      return 'Отменена';
    default:
      return 'Неизвестно';
  }
};

export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'MAFIA':
      return '💀';
    case 'CITIZEN':
      return '❤️';
    default:
      return '👤';
  }
};

export const getRoleText = (role: string) => {
  switch (role) {
    case 'MAFIA':
      return 'Мафия';
    case 'CITIZEN':
      return 'Горожанин';
    default:
      return role;
  }
};

export const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'ALIVE':
      return '❤️';
    case 'DEAD':
      return '💀';
    case 'KICKED':
      return '⚡';
    default:
      return '👤';
  }
};

export const getStatusTextPlayer = (status?: string) => {
  switch (status) {
    case 'ALIVE':
      return 'Жив';
    case 'DEAD':
      return 'Мертв';
    case 'KICKED':
      return 'Исключен';
    default:
      return 'Неизвестно';
  }
}; 