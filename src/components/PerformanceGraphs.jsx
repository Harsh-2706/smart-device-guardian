import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PerformanceGraphs = ({ history }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            x: { display: false },
            y: {
                display: false,
                min: 0,
                max: 100,
            },
        },
        elements: {
            point: { radius: 0 },
            line: { tension: 0.4 },
        },
    };

    const cpuData = {
        labels: history.map(h => h.timestamp),
        datasets: [
            {
                label: 'CPU Usage',
                data: history.map(h => h.cpu),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                borderWidth: 2,
            },
        ],
    };

    const ramData = {
        labels: history.map(h => h.timestamp),
        datasets: [
            {
                label: 'RAM Usage',
                data: history.map(h => h.ram),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 h-48">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-wide">CPU Utilization</h3>
                    <span className="text-xs font-medium text-blue-400">Live Stream</span>
                </div>
                <div className="h-28">
                    <Line data={cpuData} options={chartOptions} />
                </div>
            </div>

            <div className="glass-card p-6 h-48">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-wide">Memory Usage</h3>
                    <span className="text-xs font-medium text-indigo-400">Stable Analysis</span>
                </div>
                <div className="h-28">
                    <Line data={ramData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default PerformanceGraphs;
