import React from 'react';
import { AlertCircle, CheckCircle2, Zap, WifiOff } from 'lucide-react';

const BottleneckDetection = ({ metrics, isDisconnected }) => {
    const getStatusConfig = (status) => {
        if (isDisconnected) return { label: 'Disconnected', color: 'text-slate-500', bg: 'bg-slate-500/10' };

        switch (status?.toLowerCase()) {
            case 'stable':
                return { label: 'Stable', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
            case 'cpu-bound':
                return { label: 'CPU-bound', color: 'text-red-400', bg: 'bg-red-400/20' };
            case 'memory-bound':
                return { label: 'Memory-bound', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
            case 'disk i/o-bound':
                return { label: 'Disk I/O-bound', color: 'text-orange-400', bg: 'bg-orange-400/20' };
            default:
                return { label: status || 'Analyzing...', color: 'text-blue-400', bg: 'bg-blue-400/20' };
        }
    };

    const { label, color, bg } = getStatusConfig(metrics?.state);

    return (
        <div className="glass-card p-6 h-48 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-wide uppercase">System Analysis</h3>
                {!isDisconnected ? <Zap className="text-yellow-400 animate-pulse" size={16} /> : <WifiOff className="text-slate-500" size={16} />}
            </div>

            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${bg} backdrop-blur-xl border border-white/5`}>
                    {label === 'Stable' ? (
                        <CheckCircle2 className="text-emerald-400" size={32} />
                    ) : (
                        <AlertCircle className={color} size={32} />
                    )}
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current State</p>
                    <h4 className={`text-2xl font-black tracking-tight ${color}`}>{label}</h4>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} ${!isDisconnected ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {!isDisconnected ? "AI Monitoring Active" : "Backend unreachable"}
                </span>
            </div>
        </div>
    );
};

export default BottleneckDetection;
