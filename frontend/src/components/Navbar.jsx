import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, LayoutDashboard, BarChart2, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-500 transition-colors">
            <Link2 className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SmartURL
          </span>
        </Link>

        <div className="flex items-center space-x-8">
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/analytics" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
