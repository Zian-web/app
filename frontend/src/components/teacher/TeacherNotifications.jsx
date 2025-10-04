import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Plus } from 'lucide-react';
import CreateNotificationDialog from '../forms/CreateNotificationDialog';

const TeacherNotifications = ({ notifications, getBatchName, batches, onDataRefresh }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button className="flex items-center space-x-2" onClick={() => setIsCreateDialogOpen(true)}>
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
                <Badge variant="outline">{notification.batchName}</Badge>
              </CardTitle>
              <CardDescription>
                {notification.batchName} • {new Date(notification.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <CreateNotificationDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        batches={batches}
        onNotificationCreated={onDataRefresh}
      />
    </div>
  );
};

export default TeacherNotifications;