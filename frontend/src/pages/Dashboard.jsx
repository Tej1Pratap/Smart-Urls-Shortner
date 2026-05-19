import React, { useState, useEffect } from 'react';
import { urlService } from '../services/api';
import { Plus, Link2, Copy, Trash2, ExternalLink, Calendar, MousePointer2, Search, Filter, Loader2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUrl, setNewUrl] = useState({ originalUrl: '', customShortCode: '', expiryDate: '' });
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await urlService.getMyUrls();
      setUrls(response.data);
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await urlService.shorten({
        ...newUrl,
        expiryDate: newUrl.expiryDate ? newUrl.expiryDate + 'T23:59:59' : null
      });
      toast.success('URL shortened successfully!');
      setNewUrl({ originalUrl: '', customShortCode: '', expiryDate: '' });
      fetchUrls();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await urlService.deleteUrl(id);
      toast.success('URL deleted');
      setUrls(urls.filter(u => u.id !== id));
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredUrls = urls.filter(u => 
    u.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Create Form */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-primary-500" />
              <span>Shorten New URL</span>
            </h2>
            <form onSubmit={handleShorten} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Long URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="url"
                    required
                    className="input-field pl-10"
                    placeholder="https://very-long-url.com/..."
                    value={newUrl.originalUrl}
                    onChange={(e) => setNewUrl({ ...newUrl, originalUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Custom Code (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. my-awesome-link"
                  value={newUrl.customShortCode}
                  onChange={(e) => setNewUrl({ ...newUrl, customShortCode: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Expiry Date (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="date"
                    className="input-field pl-10"
                    value={newUrl.expiryDate}
                    onChange={(e) => setNewUrl({ ...newUrl, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Shorten URL</span>}
              </button>
            </form>
          </div>
        </div>

        {/* Right: URL List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Your URLs</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search links..."
                className="input-field pl-10 py-2 text-sm"
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
              ) : filteredUrls.length === 0 ? (
                <div className="text-center py-20 glass-card">
                  <Link2 className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">No URLs found. Start by shortening one!</p>
                </div>
              ) : (
                filteredUrls.map((url) => (
                  <motion.div
                    key={url.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card p-5 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-primary-400 font-bold text-lg truncate">{url.shortUrl}</span>
                          <button 
                            onClick={() => copyToClipboard(url.shortUrl)}
                            className="p-1.5 text-slate-500 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedQr(url.shortUrl)}
                            className="p-1.5 text-slate-500 hover:text-white transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-slate-500 text-sm truncate max-w-md">{url.originalUrl}</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center text-slate-300 font-semibold space-x-1">
                            <MousePointer2 className="w-4 h-4" />
                            <span>{url.clickCount}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">Clicks</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <a 
                            href={url.shortUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                          <button 
                            onClick={() => handleDelete(url.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-widest">
                      <span>Created: {new Date(url.createdAt).toLocaleDateString()}</span>
                      {url.expiryDate && (
                        <span className={new Date(url.expiryDate) < new Date() ? 'text-red-400' : ''}>
                          Expires: {new Date(url.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>Last Access: {url.lastAccessed ? new Date(url.lastAccessed).toLocaleString() : 'Never'}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedQr(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <QRCodeSVG value={selectedQr} size={256} />
            <div className="mt-6 text-center">
              <p className="text-slate-900 font-bold mb-2">Scan QR Code</p>
              <p className="text-slate-500 text-sm break-all">{selectedQr}</p>
              <button 
                onClick={() => setSelectedQr(null)}
                className="mt-6 text-primary-600 font-semibold hover:text-primary-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
