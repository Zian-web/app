import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { joinBatch } from '../../lib/api';

const JoinBatchDialog = ({ open, onOpenChange, onJoinSuccess }) => {
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a join code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await joinBatch(joinCode.trim().toUpperCase());
      toast({
        title: "Success",
        description: "Join request sent successfully. Please wait for teacher approval.",
      });
      setJoinCode('');
      if (onJoinSuccess) onJoinSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to join batch",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join New Batch</DialogTitle>
          <DialogDescription>
            Enter the batch join code provided by your teacher to send a join request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinCode">Join Code</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter batch join code"
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Join Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinBatchDialog;
