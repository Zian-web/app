
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { createNotification } from '../../lib/api';

const CreateNotificationDialog = ({ isOpen, onClose, batches, onNotificationCreated }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!title || !message || selectedBatches.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields and select at least one batch.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    try {
      await Promise.all(
        selectedBatches.map(batchId =>
          createNotification(batchId, { title, message })
        )
      );

      toast({
        title: 'Success',
        description: 'Notifications sent successfully.',
      });
      onNotificationCreated();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
          </div>
          <div className="space-y-2">
            <Label>Batches</Label>
            {/* TODO: Replace with a proper multi-select component */}
            <div className="flex flex-wrap gap-2">
              {batches.map(batch => (
                <Button
                  key={batch.id}
                  variant={selectedBatches.includes(batch.id) ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedBatches(prev =>
                      prev.includes(batch.id)
                        ? prev.filter(id => id !== batch.id)
                        : [...prev, batch.id]
                    );
                  }}
                >
                  {batch.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNotificationDialog;
