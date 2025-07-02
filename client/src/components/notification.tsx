// import React from 'react';
// import { FaBell } from 'react-icons/fa';

// interface NotificationBellProps {
//   notificationCount: number;
// }

// const NotificationBell: React.FC<NotificationBellProps> = ({ notificationCount }) => {
//   return (
//     <div className="relative">
//       <FaBell className="text-3xl" />
//       {notificationCount > 0 && (
//         <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//           {notificationCount}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotifications } from '../features/notificationSlice'; import { RootState } from '../app/store';
interface NotificationBellProps
{
  notificationCount: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ( { notificationCount } ) =>
{
  const [showNotifications, setShowNotifications] = useState( false );
  const notifications = useSelector( ( state: RootState ) => state.notifications.notificationsInformation );
  const dispatch = useDispatch();

  const handleClick = () =>
  {
    setShowNotifications( !showNotifications );
    if ( showNotifications )
    {
      dispatch( clearNotifications() );
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      <FaBell className="text-3xl" />
      {notificationCount > 0 && (
        <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {notificationCount}
        </div>
      )}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-md p-4 text-gray-700">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map( ( notification, index ) => (
                <li key={index}>{notification}</li>
              ) )}
            </ul>
          ) : (
            <p>No hay notificaciones</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
