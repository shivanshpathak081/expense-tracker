import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from '../redux/slices/authSlice.js';
import ProfileCard from '../components/ProfileCard.jsx';
import Button from '../components/Common/Button.jsx';

// Profile page: view info card and update name/currency preferences.
const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, currency: user?.currency } });

  const onSubmit = async (payload) => {
    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated');
    } else {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <ProfileCard user={user} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input {...register('name')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
          <select {...register('currency')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </div>
  );
};

export default Profile;
