import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { uploadMaterial } from '../../lib/api';

const AddMaterialDialog = ({ open, onOpenChange, onSuccess, onMaterialUploaded, batches = [] }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !selectedFile || selectedBatches.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select at least one batch",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);

      await Promise.all(
        selectedBatches.map(batchId => uploadMaterial(batchId, formData))
      );

      toast({
        title: "Success",
        description: "Material uploaded successfully to selected batches"
      });

      // Reset form
      setTitle('');
      setSelectedFile(null);
      setSelectedBatches([]);
      // Call success callbacks
      if (onSuccess) onSuccess();
      if (onMaterialUploaded) onMaterialUploaded();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload material",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      e.target.value = null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Study Material</DialogTitle>
          <DialogDescription>
            Upload a PDF file as study material. The file should be less than 10MB.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter material title"
              required
            />
          </div>

          <div>
            <Label>Select Batches</Label>
            <div className="flex flex-wrap gap-2 py-2">
              {batches.map((batch) => (
                <Button
                  key={batch.id}
                  type="button"
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

          <div>
            <Label htmlFor="file">PDF File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !title || !selectedFile || selectedBatches.length === 0}
            >
              {isUploading ? "Uploading..." : "Upload Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialDialog;