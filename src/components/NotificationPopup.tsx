import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPopupProps {
    notification: Notification;
    onClose: () => void;
    onClick: (notification: Notification) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, onClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slight delay for animation
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleClick = () => {
        setIsVisible(false);
        setTimeout(() => onClick(notification), 300);
    };

    return (
        <div
            className={`fixed top-6 left-6 right-6 z-[150] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
        >
            <div
                onClick={handleClick}
                className="bg-[#1E1E1E]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
                {/* Icon */}
                <div className={`p-3 rounded-xl shrink-0 ${notification.type === 'alert' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                    {notification.type === 'alert' ? <AlertTriangle size={24} /> : <TrendingUp size={24} />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white truncate pr-2">{notification.title}</h3>
                        <span className="text-[10px] text-zinc-500 whitespace-nowrap">{notification.timestamp}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{notification.desc}</p>

                    <div className="flex items-center mt-2 text-xs font-bold text-app-accent">
                        <span>대응하기</span>
                        <ChevronRight size={14} className="ml-0.5" />
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white border border-white/10 shadow-lg"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default NotificationPopup;
