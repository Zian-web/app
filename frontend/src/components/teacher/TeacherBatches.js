import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import AddBatchDialog from '../AddBatchDialog';
import { useToast } from '../../hooks/use-toast';

const TeacherBatches = ({ batches, onSelectBatch, onAddBatch }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [displayedBatches, setDisplayedBatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

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
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{batch.subject}</CardDescription>
              </CardHeader>
              <CardContent onClick={() => onSelectBatch(batch)}>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Schedule:</strong> {batch.schedule}</p>
                  <p className="text-sm"><strong>Students:</strong> {batch.students.length}</p>
                  <p className="text-sm"><strong>Duration:</strong> {batch.startDate} to {batch.endDate}</p>
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
    </div>
  );
};

export default TeacherBatches;