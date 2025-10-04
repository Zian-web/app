import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import JoinBatchDialog from './JoinBatchDialog';
import { useToast } from '../../hooks/use-toast';
import { getStudentBatches } from '../../lib/api';
import { useCallback } from 'react';

const StudentBatches = ({ onSelectBatch }) => {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinBatchDialogOpen, setIsJoinBatchDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchBatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getStudentBatches();
      setBatches(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your batches. " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Batches</h2>
        <Button onClick={() => setIsJoinBatchDialogOpen(true)}>Join New Batch</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{batch.name}</CardTitle>
                  <CardDescription>{batch.subject}</CardDescription>
                </div>
                {batch.material_access_blocked && (
                  <Badge variant="destructive">Access Blocked</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Schedule:</span> {batch.schedule || 'Not specified'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Fees:</span> {batch.fees ? `₹${batch.fees}` : 'Not specified'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Students:</span> {batch.approved_student_count} / {batch.student_limit}
                </p>
              </div>
              <Button 
                onClick={() => onSelectBatch(batch)} 
                className="w-full"
                variant={batch.material_access_blocked ? "outline" : "default"}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <JoinBatchDialog
        open={isJoinBatchDialogOpen}
        onOpenChange={setIsJoinBatchDialogOpen}
        onJoinSuccess={() => {
          setIsJoinBatchDialogOpen(false);
          // Refresh the batches list after successful join
          fetchBatches();
        }}
      />
    </div>
  );
};

export default StudentBatches;
