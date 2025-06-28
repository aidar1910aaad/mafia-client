'use client';

interface ProfileActionsProps {
    editing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function ProfileActions({ 
    editing, 
    onEdit, 
    onSave, 
    onCancel 
}: ProfileActionsProps) {
    return (
        <div>
            {!editing ? (
                <button
                    onClick={onEdit}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Редактировать
                </button>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={onSave}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Сохранить
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-[#404040] hover:bg-[#505050] text-white px-4 py-2 rounded-xl transition-all duration-200"
                    >
                        Отмена
                    </button>
                </div>
            )}
        </div>
    );
} 