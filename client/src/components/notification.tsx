import React from 'react';
import { FaBell } from 'react-icons/fa';

interface NotificationBellProps {
  notificationCount: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notificationCount }) => {
  return (
    <div className="relative">
      <FaBell className="text-3xl" />
      {notificationCount > 0 && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {notificationCount}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
