import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StudentNotifications = ({ notifications = [] }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(notifications.length > 0) ? (
              notifications.map(notification => (
                <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(notification.created_at)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-gray-500">No notifications yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNotifications;