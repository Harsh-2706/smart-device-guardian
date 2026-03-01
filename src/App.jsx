import React, { useState, useEffect, useCallback } from 'react';
import { Shield, LayoutDashboard, Settings, Bell, Search, User, WifiOff, Loader2, Activity } from 'lucide-react';
import TopSummaryBar from './components/TopSummaryBar';
import PerformanceGraphs from './components/PerformanceGraphs';
import BottleneckDetection from './components/BottleneckDetection';
import TopApplications from './components/TopApplications';
import RiskAuditor from './components/RiskAuditor';
import StartupOptimizer from './components/StartupOptimizer';
import AISuggestionsFeed from './components/AISuggestionsFeed';

const BACKEND_URL = 'http://127.0.0.1:8000';

const ActionButton = ({ onClick, label, icon: Icon, color, loading }) => (
    <button
        onClick={onClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all active:scale-95 disabled:opacity-50 ${color}`}
    >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
);

function App() {
    const [metrics, setMetrics] = useState(null);
    const [history, setHistory] = useState([]);
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMetrics = useCallback(async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/metrics`);
            if (!response.ok) throw new Error('Backend error');

            const data = await response.json();

            const formattedMetrics = {
                cpu: data.cpu.toFixed(1),
                ram: data.ram.toFixed(1),
                disk: data.disk.toFixed(1),
                activeProcesses: data.processes,
                healthScore: data.health_score,
                contextMode: data.context_mode,
                systemBehavior: data.system_behavior,
                state: data.system_behavior, // Map for BottleneckDetection
                strategy: data.optimization_strategy,
                confidence: data.optimization_confidence,
                impact: data.optimization_impact_score,
                spike: data.spike_detected,
                timestamp: new Date().toLocaleTimeString(),
            };

            setMetrics(formattedMetrics);
            setHistory(h => [...h.slice(-19), formattedMetrics]);
            setIsDisconnected(false);
            setIsLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setIsDisconnected(true);
            setIsLoading(false);
        }
    }, []);

    const runAction = async (endpoint, label) => {
        if (!window.confirm(`Are you sure you want to trigger: ${label}?`)) return;
        try {
            const res = await fetch(`${BACKEND_URL}${endpoint}`, { method: 'POST' });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("Action failed: " + err.message);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 500);
        return () => clearInterval(interval);
    }, [fetchMetrics]);

    return (
        <div className="min-h-screen font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between glass-card border-x-0 border-t-0 rounded-none bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] animate-glow">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Smart Device Guardian</h1>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">AI-Powered Performance Intelligence</p>
                    </div>
                </div>

                {isDisconnected && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 animate-pulse text-xs font-bold uppercase tracking-widest">
                        <WifiOff size={14} />
                        Backend Disconnected
                    </div>
                )}

                {metrics?.contextMode && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <Activity size={14} className="animate-pulse" />
                        {metrics.contextMode}
                    </div>
                )}

                <div className="hidden md:flex items-center gap-6 px-6 py-2 glass-card rounded-full bg-slate-400/5">
                    <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <Bell size={18} />
                        <span className="text-sm font-medium">Alerts</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <Settings size={18} />
                        <span className="text-sm font-medium">Settings</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2 glass-card-hover rounded-lg cursor-pointer text-slate-400">
                        <Search size={20} />
                    </div>
                    <div className="w-10 h-10 glass-card flex items-center justify-center rounded-full overflow-hidden border-blue-500/30">
                        <User size={24} className="text-blue-400" />
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 space-y-6">
                {isLoading ? (
                    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <p className="text-slate-400 font-medium">Initializing Secure Connection...</p>
                    </div>
                ) : (
                    <>
                        {/* Top Summary Stats */}
                        <TopSummaryBar metrics={metrics || { cpu: 0, ram: 0, disk: 0, activeProcesses: 0, healthScore: 0 }} />

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Main Content Area */}
                            <div className="lg:col-span-8 space-y-6">
                                {metrics?.spike && (
                                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <Bell className="text-red-500 animate-bounce" size={20} />
                                        <p className="text-red-400 text-sm font-bold uppercase tracking-tight">⚠ Sudden CPU spike detected. System load is shifting.</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <PerformanceGraphs history={history} />

                                        {/* Behavior and Strategy Panel */}
                                        <div className="glass-card p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">System Intelligence</h3>
                                                <Settings size={14} className="text-slate-500" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Behavior Profile</p>
                                                    <p className="text-sm font-bold text-white">{metrics?.systemBehavior}</p>
                                                </div>
                                                <div className="p-3 rounded-lg bg-slate-900/50 border border-white/5">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Optim. Confidence</p>
                                                    <p className="text-sm font-bold text-blue-400">{metrics?.confidence}%</p>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                                <p className="text-[10px] text-blue-400 font-black uppercase tracking-tight mb-2">Recommended Strategy</p>
                                                <h4 className="text-lg font-bold text-white leading-tight mb-1">{metrics?.strategy}</h4>
                                                <p className="text-xs text-slate-400">AI-optimized based on {metrics?.contextMode}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BottleneckDetection metrics={metrics} isDisconnected={isDisconnected} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TopApplications isDisconnected={isDisconnected} />
                                    <RiskAuditor />
                                </div>
                            </div>

                            {/* Sidebar Area */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Action Engine */}
                                <div className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-white tracking-tight">Real Action Engine</h3>
                                        <div className="px-2 py-1 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded uppercase">Prototype Safe</div>
                                    </div>
                                    <div className="space-y-3">
                                        <ActionButton
                                            label="Suspend Background"
                                            icon={Settings}
                                            color="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white"
                                            onClick={() => runAction('/action/suspend-background', 'Suspend Background')}
                                        />
                                        <ActionButton
                                            label="Reduce Process Priority"
                                            icon={Activity}
                                            color="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white"
                                            onClick={() => runAction('/action/reduce-priority', 'Reduce CPU Priority')}
                                        />
                                        <ActionButton
                                            label="Clean Temporary Files"
                                            icon={Search}
                                            color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                            onClick={() => runAction('/action/clear-temp', 'Cleanup Temporary Files')}
                                        />
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-800/50">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Impact Score</p>
                                            <p className="text-xs font-bold text-emerald-400">+{metrics?.impact}% IMPROVEMENT</p>
                                        </div>
                                        <div className="mt-2 w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(100, metrics?.impact * 5)}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <StartupOptimizer />
                                <AISuggestionsFeed metrics={metrics} isDisconnected={isDisconnected} />
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="p-12 text-center text-slate-500 text-sm border-t border-slate-800/30 mt-12 bg-slate-950/50 backdrop-blur-sm">
                <p>© 2026 Smart Device Guardian • Student laptop monitoring system</p>
                <p className="mt-2 text-xs">Connected to Local System Backend at {BACKEND_URL}</p>
            </footer>
        </div>
    );
}

export default App;
