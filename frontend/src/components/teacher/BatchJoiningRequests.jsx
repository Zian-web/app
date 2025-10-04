import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

// This is now a presentational component. It receives data and callbacks via props.
export default function BatchJoiningRequests({ requests, onApprove, onReject }) {
  if (!requests || requests.length === 0) {
    return <p className="text-center text-gray-500 py-8">No pending join requests</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Joining Requests</h3>
      
      {requests.map(({ id, student, status }) => (
        <Card key={id} className="mb-4">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium">{student.full_name}</h4>
              <p className="text-sm text-gray-500">{student.email}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {status === 'pending' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onApprove(id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => onReject(id)}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Badge variant={status === 'approved' ? 'success' : 'destructive'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
