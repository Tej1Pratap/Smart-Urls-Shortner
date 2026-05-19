import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, Zap, Shield, BarChart3, ChevronRight, MousePointer2, Smartphone, Loader2, Copy, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlService } from '../services/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [showQr, setShowQr] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await urlService.shorten({ originalUrl: url });
      setShortenedUrl(response.data.shortUrl);
      toast.success('URL shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="relative overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-24 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border-white/10 text-primary-400 text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4 fill-primary-400" />
          <span>The Next Gen URL Shortener</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-extrabold text-white leading-tight lg:leading-tight mb-8"
        >
          Shorten. Share. <br />
          <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Analyze Everything.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg lg:text-xl max-w-2xl mb-12"
        >
          Create short, memorable links instantly. No registration required to get started. 
          Sign up for detailed analytics and custom links.
        </motion.p>

        {/* Guest Shortener Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl mb-16"
        >
          <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-3 p-2 glass rounded-2xl border-white/10 shadow-2xl">
            <div className="flex-1 relative">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="url" 
                required
                placeholder="Paste your long link here..." 
                className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-0 placeholder:text-slate-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary py-4 px-8 whitespace-nowrap flex items-center justify-center space-x-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>Shorten Now</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Result Area */}
          <AnimatePresence>
            {shortenedUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-primary-500/30"
              >
                <div className="flex items-center space-x-3 overflow-hidden w-full">
                  <div className="p-2 bg-primary-600/20 rounded-lg">
                    <Link2 className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-primary-400 font-bold truncate">{shortenedUrl}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors" title="Copy">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowQr(!showQr)} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors" title="QR Code">
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showQr && shortenedUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-6 glass rounded-2xl inline-block bg-white">
              <QRCodeSVG value={shortenedUrl} size={150} />
            </motion.div>
          )}
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              icon: <Zap className="w-6 h-6 text-yellow-500" />,
              title: "Instant Shortening",
              desc: "Generate short codes in milliseconds with our lightning-fast backend."
            },
            {
              icon: <Shield className="w-6 h-6 text-green-500" />,
              title: "Secure & Reliable",
              desc: "JWT-based authentication ensures your links and data are always safe."
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-primary-500" />,
              title: "Deep Analytics",
              desc: "Track every click with real-time analytics and detailed performance charts."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card p-8 text-left group"
            >
              <div className="p-3 bg-white/5 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Floating Stats */}
        <div className="mt-32 w-full grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Links', value: '1M+', icon: <Link2 /> },
            { label: 'Clicks/Day', value: '500K+', icon: <MousePointer2 /> },
            { label: 'Happy Users', value: '10K+', icon: <Shield /> },
            { label: 'Countries', value: '120+', icon: <Smartphone /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h4 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">{stat.value}</h4>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
