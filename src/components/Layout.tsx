import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User,
  LogOut,
  MessageCircle,
  Settings
} from 'lucide-react';
import DropletBackground from './common/DropletBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/explore', icon: Search },
    { name: 'Create', href: '/create', icon: PlusSquare },
    { name: 'Activity', href: '/activity', icon: Heart },
    { name: 'Messages', href: '/messages', icon: MessageCircle },
    { name: 'Profile', href: `/profile/${currentUser?.username}`, icon: User },
  ];

  return (
    <div className="flex min-h-screen">
      <DropletBackground />
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow glass-card pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Cliper</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 micro-btn ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/20 hover:text-purple-600'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          {/* User section */}
          <div className="flex-shrink-0 flex border-t border-white/20 p-4">
            <div className="flex items-center w-full">
              <img
                className="h-10 w-10 rounded-full border-2 border-white/30 shadow-lg"
                src={currentUser?.profilePicture}
                alt={currentUser?.username}
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-800">{currentUser?.username}</p>
                <p className="text-xs text-gray-600">{currentUser?.fullName}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Link
                  to="/settings"
                  className="p-2 rounded-full text-gray-500 hover:text-purple-600 hover:bg-white/20 transition-all duration-300 micro-btn"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-gray-500 hover:text-purple-600 hover:bg-white/20 transition-all duration-300 micro-btn"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/20">
        <div className="flex justify-around py-3">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 micro-btn ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <item.icon className="h-6 w-6 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-6 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 