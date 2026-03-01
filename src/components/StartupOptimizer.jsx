import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Rocket, Loader2 } from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000';

const StartupOptimizer = () => {
    const [apps, setApps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStartup = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/startup-items`);
                const data = await response.json();
                setApps(data.items);
            } catch (err) {
                console.error('Failed to fetch startup items:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStartup();
    }, []);

    const toggleApp = (index) => {
        setApps(prev => prev.map((app, i) =>
            i === index ? { ...app, enabled: !app.enabled } : app
        ));
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight leading-none">Startup Protocol</h3>
                <Rocket className="text-blue-500" size={18} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : (
                <div className="space-y-4">
                    {apps.length > 0 ? apps.map((app, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-400/5 hover:bg-slate-400/10 transition-colors border border-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${app.enabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${app.enabled ? 'text-white' : 'text-slate-500'}`}>{app.name}</span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{app.path}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleApp(idx)}
                                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                {app.enabled ? (
                                    <ToggleRight className="text-blue-500 animate-in zoom-in-50 duration-200" size={32} />
                                ) : (
                                    <ToggleLeft className="text-slate-600 animate-in zoom-in-50 duration-200" size={32} />
                                )}
                            </button>
                        </div>
                    )) : (
                        <p className="text-center text-slate-500 text-xs py-8">No startup items found in Registry.</p>
                    )}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800/50">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Impact Analysis</p>
                        <p className="text-xs font-bold text-blue-400">Moderate Boot Time Impact</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-white leading-none">4.2s</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Ready state</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartupOptimizer;

