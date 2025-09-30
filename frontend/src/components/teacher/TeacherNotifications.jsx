import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';

const TeacherNotifications = ({ notifications, getBatchName }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Notification</span>
        </Button>
      </div>
      <div className="space-y-4">
        {notifications.map(notification => (
          <Card key={notification.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {notification.title}
                <Badge variant="outline">{notification.type}</Badge>
              </CardTitle>
              <CardDescription>
                {getBatchName(notification.batchId)} • {notification.date}
              </CardDescription>
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

export default TeacherNotifications;
