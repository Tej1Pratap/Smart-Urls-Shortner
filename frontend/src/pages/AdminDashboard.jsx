import React, { useState, useEffect } from 'react';
import { urlService } from '../services/api';
import { Shield, Trash2, Search, ExternalLink, MousePointer2, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlService.getAllUrls();
      setUrls(response.data);
    } catch (error) {
      toast.error('Failed to fetch URLs (Admin)');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ADMIN ACTION: Delete this URL?')) return;
    try {
      await urlService.deleteUrl(id);
      toast.success('URL deleted by Admin');
      setUrls(urls.filter(u => u.id !== id));
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const filteredUrls = urls.filter(u => 
    u.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-500" />
            <span>Admin Management</span>
          </h1>
          <p className="text-slate-500 mt-2">Oversee all URLs created in the system</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card px-6 py-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total System URLs</p>
            <p className="text-2xl font-bold text-white">{urls.length}</p>
          </div>
          <div className="glass-card px-6 py-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total System Clicks</p>
            <p className="text-2xl font-bold text-white">
              {urls.reduce((acc, curr) => acc + curr.clickCount, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-8 flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search all system links..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
          ) : (
            filteredUrls.map((url) => (
              <motion.div
                key={url.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-5 border-l-4 border-red-500/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary-400 font-bold">{url.shortUrl}</span>
                    </div>
                    <p className="text-slate-500 text-sm truncate max-w-xl">{url.originalUrl}</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center text-slate-300 font-semibold justify-end space-x-1">
                        <MousePointer2 className="w-4 h-4" />
                        <span>{url.clickCount}</span>
                      </div>
                      <span className="text-[10px] uppercase text-slate-500">Total Clicks</span>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(url.id)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                      title="Admin Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
