import React from 'react';

// Displays the logged-in user's avatar initials, name and email.
const ProfileCard = ({ user }) => {
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700 dark:bg-primary-700 dark:text-primary-100">
        {initials || 'U'}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        <p className="text-xs text-gray-400">Currency: {user?.currency}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
