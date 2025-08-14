import { GamePlayer } from '../../../api/games';

export interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clubId: number;
  seasonId?: number;
  tournamentId?: number;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  avatar: string | null;
  role?: string;
}

export interface UnregisteredUser {
  id: number; // Числовой ID для совместимости с поиском
  nickname: string;
  email: string;
  name?: string;
  avatar: string | null;
  isUnregistered: true;
}

export type PlayerUser = User | UnregisteredUser;

// Тип для создания игрока (упрощенный)
export interface CreateGamePlayer {
  playerId: number;
}

export interface GameFormData {
  name: string;
  description: string;
  scheduledDate: string;
  result: 'MAFIA_WIN' | 'CITIZEN_WIN' | 'DRAW';
  resultTable: Record<string, string>;
}

export interface PlayerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: PlayerUser[];
  playersCount: number;
  maxPlayers: number;
  onAddPlayer: (user: PlayerUser) => void;
  onAddUnregisteredPlayer: (nickname: string) => void;
}

export interface PlayerListProps {
  players: CreateGamePlayer[];
  availableUsers: PlayerUser[];
  playersCount: number;
  maxPlayers: number;
  onRemovePlayer: (playerId: number) => void;
  onUpdatePlayer: (playerId: number, field: keyof CreateGamePlayer, value: any) => void;
}

export interface ResultTableProps {
  resultTable: Record<string, string>;
  onAddRound: () => void;
  onUpdateRound: (roundKey: string, value: string) => void;
  onRemoveRound: (roundKey: string) => void;
}

export interface GameFormProps {
  formData: GameFormData;
  setFormData: (data: GameFormData | ((prev: GameFormData) => GameFormData)) => void;
  players: CreateGamePlayer[];
  availableUsers: PlayerUser[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: PlayerUser[];
  playersCount: number;
  maxPlayers: number;
  onAddPlayer: (user: PlayerUser) => void;
  onAddUnregisteredPlayer: (nickname: string) => void;
  onRemovePlayer: (playerId: number) => void;
  onUpdatePlayer: (playerId: number, field: keyof CreateGamePlayer, value: any) => void;
  onAddResultRound: () => void;
  onUpdateResultRound: (roundKey: string, value: string) => void;
  onRemoveResultRound: (roundKey: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
} 