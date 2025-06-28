'use client';

interface MessageDisplayProps {
    message: string;
    messageType: 'success' | 'error';
}

export default function MessageDisplay({ message, messageType }: MessageDisplayProps) {
    if (!message) return null;

    return (
        <div className={`mb-6 p-4 rounded-xl ${
            messageType === 'success' 
                ? 'bg-green-900/30 border border-green-700 text-green-400' 
                : 'bg-red-900/30 border border-red-700 text-red-400'
        }`}>
            {message}
        </div>
    );
} 