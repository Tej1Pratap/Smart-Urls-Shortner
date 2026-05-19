import React, { useState, useEffect } from 'react';
import { urlService } from '../services/api';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { BarChart2, TrendingUp, MousePointer2, Link2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await urlService.getAnalytics();
        setUrls(response.data);
      } catch (error) {
        toast.error('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalClicks = urls.reduce((acc, curr) => acc + curr.clickCount, 0);
  const topUrls = [...urls].sort((a, b) => b.clickCount - a.clickCount).slice(0, 5);

  const barData = {
    labels: topUrls.map(u => u.shortCode),
    datasets: [
      {
        label: 'Clicks',
        data: topUrls.map(u => u.clickCount),
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: topUrls.map(u => u.shortCode),
    datasets: [
      {
        data: topUrls.map(u => u.clickCount),
        backgroundColor: [
          'rgba(14, 165, 233, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(20, 184, 166, 0.6)',
          'rgba(245, 158, 11, 0.6)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
          <BarChart2 className="w-8 h-8 text-primary-500" />
          <span>Performance Analytics</span>
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-primary-500/20 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Clicks</p>
            <h3 className="text-3xl font-bold text-white">{totalClicks}</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-purple-500/20 rounded-2xl">
            <Link2 className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Links</p>
            <h3 className="text-3xl font-bold text-white">{urls.length}</h3>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-teal-500/20 rounded-2xl">
            <MousePointer2 className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Avg. Clicks/Link</p>
            <h3 className="text-3xl font-bold text-white">
              {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-white mb-8">Top Performing Links</h3>
          <Bar data={barData} options={chartOptions} />
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-white mb-8">Click Distribution</h3>
          <div className="max-w-[300px] mx-auto">
            <Pie data={pieData} />
          </div>
          <div className="mt-8 space-y-3">
            {topUrls.map((u, i) => (
              <div key={u.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieData.datasets[0].backgroundColor[i] }} />
                  <span className="text-slate-300 font-medium">/{u.shortCode}</span>
                </div>
                <span className="text-slate-500">{((u.clickCount / (totalClicks || 1)) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table of performance */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-bold text-white">Detailed Link Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-4">Short Code</th>
                <th className="px-6 py-4">Original Destination</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {urls.map(url => (
                <tr key={url.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-primary-400 font-bold">/{url.shortCode}</td>
                  <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{url.originalUrl}</td>
                  <td className="px-6 py-4 text-center text-white font-semibold">{url.clickCount}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full" 
                        style={{ width: `${(url.clickCount / (totalClicks || 1)) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
