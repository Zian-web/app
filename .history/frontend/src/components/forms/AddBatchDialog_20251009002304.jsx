import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from '../../hooks/use-toast';
import { Plus } from 'lucide-react';
import { useSubscriptionPermissions } from '../../hooks/useSubscriptionPermissions';
import SubscriptionGuard from '../teacher/SubscriptionGuard';


const AddBatchDialog = ({ open, onOpenChange, onAddBatch }) => {
  const [batchData, setBatchData] = useState({
    name: '',
    subject: '',
    schedule: '',
    startDate: '',
    endDate: '',
    student_limit: 30,
    fees: ''
  });

  const { canCreateBatch, subscriptionStatus, loading: permissionsLoading } = useSubscriptionPermissions();

  const handleAdd = async () => {
    if (!batchData.name || !batchData.subject) {
      toast({
        title: "Error",
        description: "Please fill at least name and subject",
        variant: "destructive"
      });
      return;
    }

    // Check subscription permission before creating batch
    if (!canCreateBatch) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to create batches. Please subscribe first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Map frontend fields to backend expected fields
      const mappedData = {
        name: batchData.name,
        subject: batchData.subject,
        schedule: batchData.schedule || null,
        student_limit: batchData.student_limit || 30,
        fees: batchData.fees ? parseInt(batchData.fees) : null,
        start_date: batchData.startDate || null,
        end_date: batchData.endDate || null
      };
      
      // Pass the mapped data up to the parent to handle the API call
      await onAddBatch(mappedData);
      // Reset form and close dialog on success (as signaled by parent)
      setBatchData({ name: '', subject: '', schedule: '', startDate: '', endDate: '', student_limit: 30, fees: '' });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding batch:', error);
      
      // Handle subscription-related errors
      if (error.message && error.message.includes('Subscription required')) {
        toast({
          title: "Subscription Required",
          description: "You need an active subscription to create batches. Please subscribe first.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create batch. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
          <DialogDescription>Fill in the details to create a new batch.</DialogDescription>
        </DialogHeader>
        
        {!canCreateBatch && !permissionsLoading ? (
          <SubscriptionGuard 
            action="create_batch"
            subscriptionStatus={subscriptionStatus}
            onSubscribe={() => {
              onOpenChange(false);
              // Navigate to subscription page
              window.location.href = '/teacher/subscription';
            }}
          />
        ) : (
          <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Batch Name</Label>
            <Input 
              id="name" 
              value={batchData.name} 
              onChange={(e) => setBatchData({...batchData, name: e.target.value})} 
              placeholder="Enter batch name" 
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              value={batchData.subject} 
              onChange={(e) => setBatchData({...batchData, subject: e.target.value})} 
              placeholder="Enter subject" 
            />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Input 
              id="schedule" 
              value={batchData.schedule} 
              onChange={(e) => setBatchData({...batchData, schedule: e.target.value})} 
              placeholder="Mon/Wed/Fri 10AM-12PM" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                type="date" 
                id="startDate" 
                value={batchData.startDate} 
                onChange={(e) => setBatchData({...batchData, startDate: e.target.value})} 
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                type="date" 
                id="endDate" 
                value={batchData.endDate} 
                onChange={(e) => setBatchData({...batchData, endDate: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_limit">Maximum Students</Label>
              <Input 
                type="number" 
                id="student_limit" 
                value={batchData.student_limit} 
                onChange={(e) => setBatchData({...batchData, student_limit: parseInt(e.target.value)})} 
                min="1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="fees">Course Fees</Label>
              <Input 
                type="number" 
                id="fees" 
                value={batchData.fees} 
                onChange={(e) => setBatchData({...batchData, fees: e.target.value})} 
                placeholder="Enter course fees"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Batch</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBatchDialog;
