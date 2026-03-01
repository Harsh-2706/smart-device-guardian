import React from 'react';
import { Cpu, HardDrive, Layout, Activity, Heart } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, color, pct }) => (
    <div className="glass-card p-5 flex flex-col justify-between glass-card-hover group">
        <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-slate-900 overflow-hidden relative`}>
                <div className={`absolute inset-0 opacity-20 ${color}`}></div>
                <Icon className={`relative z-10 ${color.replace('bg-', 'text-')}`} size={18} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tabular-nums transition-all duration-500 ease-out">{value}</span>
            <span className="text-xs font-semibold text-slate-400">{unit}</span>
        </div>
        <div className="mt-4 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${color}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    </div>
);

const TopSummaryBar = ({ metrics }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatCard
                icon={Cpu}
                label="CPU Usage"
                value={metrics.cpu}
                unit="%"
                color="bg-blue-500"
                pct={metrics.cpu}
            />
            <StatCard
                icon={Activity}
                label="RAM Usage"
                value={metrics.ram}
                unit="%"
                color="bg-indigo-500"
                pct={metrics.ram}
            />
            <StatCard
                icon={HardDrive}
                label="Disk Usage"
                value={metrics.disk}
                unit="%"
                color="bg-cyan-500"
                pct={metrics.disk}
            />
            <StatCard
                icon={Layout}
                label="Active Processes"
                value={metrics.activeProcesses}
                unit="Count"
                color="bg-emerald-500"
                pct={(metrics.activeProcesses / 200) * 100}
            />
            <StatCard
                icon={Heart}
                label="System Health"
                value={metrics.healthScore}
                unit="Score"
                color={metrics.healthScore > 80 ? "bg-emerald-500" : metrics.healthScore > 60 ? "bg-amber-500" : "bg-red-500"}
                pct={metrics.healthScore}
            />
        </div>
    );
};

export default TopSummaryBar;
