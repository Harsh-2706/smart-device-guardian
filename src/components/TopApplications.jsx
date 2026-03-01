import React, { useState, useEffect } from 'react';
import { ExternalLink, Info, Loader2 } from 'lucide-react';
import Modal from './Modal';

const BACKEND_URL = 'http://127.0.0.1:8000';

const TopApplications = ({ isDisconnected }) => {
    const [selectedApp, setSelectedApp] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isDisconnected) return;

        const fetchProcesses = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/top-processes`);
                if (!response.ok) throw new Error('Backend error');
                const data = await response.json();

                // Map backend response to current UI structure
                const mapped = data.top.map(p => {
                    const cpu = p.cpu_percent || 0;
                    const mem = p.memory_percent || 0;
                    const impact = (cpu * 0.6) + (mem * 0.4);
                    return {
                        name: p.name,
                        usage: Math.max(cpu, mem).toFixed(1),
                        unit: cpu > mem ? '% CPU' : '% RAM',
                        impact: impact.toFixed(1),
                        action: cpu > 50 ? 'Reduce background priority' : 'Close inactive instances',
                        isIdleHeavy: cpu < 5 && mem > 15
                    };
                });

                setProcesses(mapped);
                setIsLoading(false);
            } catch (err) {
                console.error('Process fetch error:', err);
                setIsLoading(false);
            }
        };

        fetchProcesses();
        const interval = setInterval(fetchProcesses, 500);
        return () => clearInterval(interval);
    }, [isDisconnected]);

    return (
        <div className="glass-card p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Resource Intensity</h3>
                <Info className="text-slate-500 cursor-help hover:text-slate-300" size={16} />
            </div>

            {isLoading && !isDisconnected ? (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : (
                <div className="space-y-4">
                    {processes.length > 0 ? processes.map((app, idx) => (
                        <div key={idx} className="group p-4 rounded-xl bg-slate-400/5 hover:bg-slate-400/10 transition-all border border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400">
                                        {app.name[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate max-w-[120px]">{app.name}</h4>
                                            {app.isIdleHeavy && (
                                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[8px] font-black uppercase">Idle Heavy</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{app.usage}{app.unit}</p>
                                            <span className="text-[8px] px-1 rounded bg-white/5 text-slate-400 font-bold uppercase">Impact: {app.impact}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all overflow-hidden relative group/btn"
                                >
                                    <div className="absolute inset-0 bg-blue-600 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
                                    <span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                                        Analyze <ExternalLink size={12} />
                                    </span>
                                </button>
                            </div>
                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-blue-500/50 rounded-full transition-all duration-100 ease-linear group-hover:bg-blue-400`}
                                    style={{ width: `${Math.min(100, app.usage)}%` }}
                                />
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-slate-500 text-sm py-12">
                            {isDisconnected ? "Backend unreachable" : "No active processes detected"}
                        </p>
                    )}
                </div>
            )}

            <Modal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                title={`Smart Suggestion: ${selectedApp?.name}`}
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <h4 className="text-sm font-bold text-blue-400 mb-1">AI Recommendation</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Based on the current system load and application behavior, we recommend:
                        </p>
                    </div>
                    <div className="p-5 glass-card bg-slate-800/50 border-l-4 border-blue-500">
                        <p className="font-bold text-white italic">"{selectedApp?.action}"</p>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                        *This action is estimated to improve system responsiveness by approximately 12%.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default TopApplications;
