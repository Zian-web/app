import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';
import { mockStudents } from '../data';
import { useToast } from '../hooks/use-toast';

const AddStudentDialog = ({ batch, onAddStudent }) => {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const { toast } = useToast();

  const handleAddStudent = () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive"
      });
      return;
    }

    onAddStudent(selectedStudent);
    setSelectedStudent('');
    setOpen(false);
    toast({
      title: "Success",
      description: "Student added to batch successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Student to Batch</DialogTitle>
          <DialogDescription>
            Select a student to add to {batch.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="student">Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {mockStudents
                  .filter(s => !s.enrolledBatches.includes(batch.id))
                  .map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>
              Add Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;