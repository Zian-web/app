import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

const BatchNotifications = ({ notifications, userRole }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {userRole === 'teacher' && (
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Notice</span>
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {notifications.map(notification => (
          <Card key={notification.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {notification.title}
              </CardTitle>
              <CardDescription>{new Date(notification.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BatchNotifications;
