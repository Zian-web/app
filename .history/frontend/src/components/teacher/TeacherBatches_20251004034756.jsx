import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Eye, Edit, Trash2, AlertTriangle, Clipboard, RefreshCw } from 'lucide-react';
import AddBatchDialog from '../forms/AddBatchDialog';
import { useToast } from '../../hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { deleteBatch, generateJoinCode } from '../../lib/api';

const TeacherBatches = ({ batches, onSelectBatch, onAddBatch, onBatchDelete, onDataRefresh }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [displayedBatches, setDisplayedBatches] = useState([]);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const handleRegenerateCode = async (batchId) => {
    if (!batchId) return;
    try {
      const response = await generateJoinCode(batchId);
      toast({
        title: "Success",
        description: `New join code generated: ${response.join_code}`,
      });
      if (onDataRefresh) onDataRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate new code",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ description: "Join code copied to clipboard." });
    });
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newBatches = batches.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedBatches(newBatches);
    } else {
      setDisplayedBatches(prev => [...prev, ...newBatches]);
    }
    setIsLoading(false);
  }, [currentPage, batches]);

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    
    try {
      await deleteBatch(batchToDelete.id);
      toast({
        title: "Success",
        description: "Batch deleted successfully",
      });
      onBatchDelete(batchToDelete.id);
      setIsDeleteDialogOpen(false);
      setBatchToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete batch",
        variant: "destructive"
      });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedBatches.length < batches.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">My Batches</h2>
         <Button
           variant="navy"
           className="flex items-center space-x-2"
           onClick={() => setIsAddDialogOpen(true)}
         >
           <Plus className="w-4 h-4" />
           <span>Add Batch</span>
         </Button>
      </div>
      <AddBatchDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddBatch={onAddBatch}
      />
      <div 
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {displayedBatches.map((batch) => (
            <Card key={batch.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {batch.name}
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectBatch(batch)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBatchToDelete(batch);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{batch.subject}</CardDescription>
              </CardHeader>
              <CardContent onClick={() => onSelectBatch(batch)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                    <span className="font-semibold">Join Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base">{batch.join_code}</span>
                      <Clipboard className="h-4 w-4 text-gray-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(batch.join_code); }} />
                      <RefreshCw className="h-4 w-4 text-gray-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleRegenerateCode(batch.id); }} />
                    </div>
                  </div>
                  <p className="text-sm"><strong>Schedule:</strong> {batch.schedule || 'Not set'}</p>
                  <p className="text-sm"><strong>Students:</strong> {batch.approved_student_count} / {batch.student_limit}</p>
                  <p className="text-sm"><strong>Duration:</strong> {batch.start_date ? `${batch.start_date} to ${batch.end_date}` : 'Not set'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {isLoading && (
            <div className="text-center py-4">
              Loading more batches...
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Batch
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {batchToDelete?.name}? This action cannot be undone.
              All materials associated with this batch will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBatchToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteBatch}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherBatches;