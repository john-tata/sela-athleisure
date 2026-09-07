import {
  Bell,
  Search,
  LogOut,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({
  title,
  onMenuClick,
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const initial =
    user?.email?.charAt(0)?.toUpperCase() || 'A';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-[#111111] transition"
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg sm:text-xl font-semibold text-[#111111] truncate">
          {title}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C89A5A] w-48 lg:w-64"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-500 hover:text-[#111111] transition"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-[#C89A5A] rounded-full" />
        </button>

        {/* User / Logout */}
        <button
          onClick={handleLogout}
          title={`Logout ${user?.email || ''}`}
          className="w-8 h-8 bg-[#C89A5A] rounded-full flex items-center justify-center text-white text-sm font-medium hover:opacity-80 transition flex-shrink-0"
        >
          {initial}
        </button>
      </div>
    </header>
  );
}