import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info, AlertTriangle, Loader2 } from 'lucide-react';
import Modal from './Modal';

const BACKEND_URL = 'http://127.0.0.1:8000';

const RiskAuditor = () => {
    const [risks, setRisks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRisk, setSelectedRisk] = useState(null);

    useEffect(() => {
        const fetchRisks = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/risk-assessment`);
                const data = await response.json();
                setRisks(data.risks);
            } catch (err) {
                console.error('Failed to fetch risk assessment:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRisks();
        const interval = setInterval(fetchRisks, 500); // 0.5s refresh
        return () => clearInterval(interval);
    }, []);

    const getIcon = (level) => {
        switch (level?.toLowerCase()) {
            case 'critical': return <ShieldAlert className="text-red-500" size={18} />;
            case 'warning': return <ShieldQuestion className="text-amber-500" size={18} />;
            default: return <ShieldCheck className="text-emerald-500" size={18} />;
        }
    };

    return (
        <div className="glass-card p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Risk Assessment</h3>
                <ShieldCheck className="text-emerald-500" size={20} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
            ) : (
                <div className="space-y-4">
                    {risks.length > 0 ? risks.map((risk, idx) => (
                        <div
                            key={idx}
                            onClick={() => risk.threat === 'High' && setSelectedRisk(risk)}
                            className={`p-4 rounded-xl glass-card bg-slate-400/5 border border-white/5 transition-all ${risk.threat === 'High' ? 'cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 group/risk' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                                        {getIcon(risk.level)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover/risk:text-red-400 transition-colors uppercase tracking-tight">{risk.name}</h4>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${risk.level === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${risk.level === 'Critical' ? 'text-red-400' : 'text-amber-400'}`}>
                                                {risk.reason}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {risk.threat === 'High' && (
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover/risk:bg-red-500 group-hover/risk:text-white transition-all">
                                        <AlertTriangle size={14} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12">
                            <ShieldCheck className="text-emerald-500 mx-auto mb-2" size={32} />
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No immediate threats detected</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                    <Info className="text-emerald-500 mt-0.5" size={16} />
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        AI-powered scanning is active. <span className="text-emerald-400">Deep System Analysis</span> is currently monitoring all active processes.
                    </p>
                </div>
            </div>

            <Modal
                isOpen={!!selectedRisk}
                onClose={() => setSelectedRisk(null)}
                title="Security Warning: Deep Analysis Required"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="text-red-500" size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white mb-1">{selectedRisk?.name}</h4>
                            <p className="text-red-400 text-xs font-black uppercase tracking-widest">{selectedRisk?.reason}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Technical Analysis</h5>
                            <ul className="text-sm text-slate-300 space-y-2">
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    Process running from abnormal location (Temp)
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    High system privilege requested
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                        <p className="text-sm font-bold text-amber-400 italic">
                            "Recommended: Review process origin and terminate if suspicious."
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RiskAuditor;

