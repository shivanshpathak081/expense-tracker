import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { logoutUser, updateProfile } from '../redux/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Top navigation bar with menu toggle (mobile), dark mode switch, and logout.
const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const toggleDarkMode = () => {
    const next = !user?.darkMode;
    document.documentElement.classList.toggle('dark', next);
    dispatch(updateProfile({ darkMode: next }));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-gray-800">
      <button onClick={onMenuClick} className="lg:hidden" aria-label="Open menu">
        <Menu size={22} className="text-gray-600 dark:text-gray-300" />
      </button>
      <h1 className="hidden text-lg font-semibold text-gray-800 dark:text-white lg:block">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {user?.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
