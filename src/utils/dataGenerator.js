export const generateMetrics = (prevMetrics) => {
    const time = Date.now() / 2000;

    // Sine wave + noise for smooth fluctuations
    const baseCpu = 30 + Math.sin(time) * 15 + Math.random() * 5;
    const baseRam = 60 + Math.sin(time * 0.5) * 10 + Math.random() * 2;
    const baseDisk = 15 + Math.sin(time * 2) * 5 + Math.random() * 3;

    const cpu = Math.min(100, Math.max(0, baseCpu));
    const ram = Math.min(100, Math.max(0, baseRam));
    const disk = Math.min(100, Math.max(0, baseDisk));

    const healthScore = Math.max(70, 100 - (cpu * 0.2 + (ram - 60) * 0.5));

    return {
        cpu: cpu.toFixed(1),
        ram: ram.toFixed(1),
        disk: disk.toFixed(1),
        activeProcesses: Math.floor(120 + Math.random() * 20),
        healthScore: Math.floor(healthScore),
        timestamp: new Date().toLocaleTimeString(),
    };
};

export const generateBottleneck = (metrics) => {
    if (metrics.cpu > 80) return { status: 'CPU-bound', color: 'text-red-400', bg: 'bg-red-400/20' };
    if (metrics.ram > 85) return { status: 'Memory-bound', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (metrics.disk > 70) return { status: 'Disk I/O-bound', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    return { status: 'Stable', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
};

export const APP_DATA = [
    { name: 'Google Chrome', usage: 62, unit: '% RAM', action: 'Close inactive tabs' },
    { name: 'VS Code', usage: 35, unit: '% CPU', action: 'Suspend background extensions' },
    { name: 'Python.exe', usage: 28, unit: '% CPU', action: 'Reduce batch size' },
    { name: 'Zoom', usage: 18, unit: '% CPU', action: 'Disable background startup' },
    { name: 'Spotify', usage: 12, unit: '% RAM', action: 'Clear browser cache' },
];

export const RISK_APPS = [
    { name: 'Microsoft Defender', status: 'Safe', color: 'text-emerald-400', icon: 'shield-check' },
    { name: 'GameLauncher.exe', status: 'High Startup Usage', color: 'text-yellow-400', icon: 'zap' },
    { name: 'UnknownAppService.exe', status: 'Unknown Publisher', color: 'text-red-400', icon: 'alert-triangle', highRisk: true },
];

export const STARTUP_APPS = [
    { name: 'Discord', enabled: true },
    { name: 'Steam', enabled: true },
    { name: 'OneDrive', enabled: true },
    { name: 'Spotify', enabled: false },
];

const SUGGESTIONS = [
    "System entering high CPU state.",
    "Background processes increased by 15%.",
    "Performance degradation predicted in 2 minutes.",
    "Consider disabling 3 startup apps.",
    "Cooling fan speed optimized for current load.",
    "Memory leak detected in Browser process.",
    "System health remains optimal (92%).",
];

export const getRandomSuggestion = () => {
    return SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
};
