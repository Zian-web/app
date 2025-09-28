import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import AddBatchDialog from '../AddBatchDialog';
import { useToast } from '../../hooks/use-toast';

const TeacherBatches = ({ batches, onSelectBatch, onAddBatch }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">My Batches</h2>
        <Button
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map(batch => (
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
      </div>
    </div>
  );
};

export default TeacherBatches;