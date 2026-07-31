import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import { getErrorMessage } from '../utils/helpers.js';
import { updateProfile } from '../redux/slices/authSlice.js';
import Button from '../components/Common/Button.jsx';

// Settings page: change password and toggle dark mode preference.
const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onChangePassword = async (payload) => {
    try {
      await api.put('/auth/change-password', payload);
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleDarkMode = () => {
    const next = !user?.darkMode;
    document.documentElement.classList.toggle('dark', next);
    dispatch(updateProfile({ darkMode: next }));
  };

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <div>
          <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toggle the app's color theme</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`h-6 w-11 rounded-full transition ${user?.darkMode ? 'bg-primary-600' : 'bg-gray-300'}`}
        >
          <span className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition ${user?.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="font-medium text-gray-800 dark:text-white">Change Password</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input type="password" {...register('currentPassword', { required: 'Required' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input type="password" {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 characters' } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  );
};

export default Settings;
