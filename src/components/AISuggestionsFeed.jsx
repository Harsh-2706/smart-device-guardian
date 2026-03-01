import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ChevronRight } from 'lucide-react';

const AISuggestionsFeed = ({ metrics, isDisconnected }) => {
    const [suggestions, setSuggestions] = useState([
        { id: 'init', text: "System monitoring initialized. Connection secure.", time: "Just now" },
    ]);

    useEffect(() => {
        if (metrics?.suggestion) {
            setSuggestions(prev => {
                // Only add if the suggestion is new to avoid duplicates on every poll
                if (prev[0]?.text === metrics.suggestion) return prev;

                return [
                    {
                        id: Date.now(),
                        text: metrics.suggestion,
                        time: "Just now"
                    },
                    ...prev.slice(0, 4)
                ].map((s, i) => i === 0 ? s : { ...s, time: s.time === "Just now" ? "Recently" : s.time });
            });
        }
    }, [metrics?.suggestion]);

    return (
        <div className="glass-card p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Intelligence Feed</h3>
                <div className="flex items-center gap-2">
                    {!isDisconnected ? (
                        <>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Live AI</span>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Offline</span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {suggestions.map((item, idx) => (
                    <div
                        key={item.id}
                        className={`p-4 rounded-xl border border-white/5 transition-all animate-in slide-in-from-right duration-500 ${idx === 0 && !isDisconnected ? 'bg-blue-600/10 border-blue-500/20' : 'bg-slate-400/5'}`}
                    >
                        <div className="flex gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-lg ${idx === 0 && !isDisconnected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                {idx === 0 ? <Sparkles size={14} /> : <MessageSquare size={14} />}
                            </div>
                            <div className="flex-1">
                                <p className={`text-sm leading-relaxed ${idx === 0 && !isDisconnected ? 'text-white font-bold' : 'text-slate-300'}`}>
                                    {item.text}
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{item.time}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isDisconnected && (
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                        <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Waiting for backend...</p>
                    </div>
                )}
            </div>

            <button className="w-full mt-6 py-3 px-4 rounded-xl glass-card bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-400 hover:text-white transition-all group flex items-center justify-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest">View History</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};

export default AISuggestionsFeed;
