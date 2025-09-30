import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

export default function BatchJoiningRequests({ batchId }) {
  const { toast } = useToast();
  const [requests, setRequests] = useState([
    {
      id: 1,
      studentName: "John Doe",
      email: "john@example.com",
      requestDate: "2025-09-28",
      status: "pending"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      email: "jane@example.com",
      requestDate: "2025-09-27",
      status: "pending"
    }
  ]);

  const handleAccept = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? {...req, status: 'accepted'} : req
    ));
    toast({
      title: "Request Accepted",
      description: "Student has been added to the batch"
    });
  };

  const handleReject = (requestId) => {
    setRequests(requests.map(req => 
      req.id === requestId ? {...req, status: 'rejected'} : req
    ));
    toast({
      title: "Request Rejected",
      description: "Join request has been rejected"
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Joining Requests</h3>
      
      {requests.map((request) => (
        <Card key={request.id} className="mb-4">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h4 className="font-medium">{request.studentName}</h4>
              <p className="text-sm text-gray-500">{request.email}</p>
              <p className="text-sm text-gray-500">Requested on: {request.requestDate}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {request.status === 'pending' ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAccept(request.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Badge variant={request.status === 'accepted' ? 'success' : 'destructive'}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {requests.length === 0 && (
        <p className="text-center text-gray-500">No pending join requests</p>
      )}
    </div>
  );
}
