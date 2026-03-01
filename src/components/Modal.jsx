import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md glass-card bg-slate-900/90 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
                    <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="p-4 bg-slate-800/30 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
