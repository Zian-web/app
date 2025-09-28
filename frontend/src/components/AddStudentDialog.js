import React, { useState, useMemo } from 'react';
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
import { Input } from './ui/input';
import { mockStudents } from '../data';
import { useToast } from '../hooks/use-toast';
import { Plus, Search } from 'lucide-react';

const AddStudentDialog = ({ batch, onAddStudent }) => {
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

    const studentToUpdate = mockStudents.find(s => s.id === selectedStudent);
    if (studentToUpdate && batch && !studentToUpdate.enrolledBatches.includes(batch.id)) {
        studentToUpdate.enrolledBatches.push(batch.id);
    }
    
    if(onAddStudent) {
        onAddStudent(selectedStudent);
    }

    setSelectedStudent('');
    setSearchTerm('');
    setOpen(false);
    toast({
      title: "Success",
      description: `Student ${studentToUpdate ? studentToUpdate.name : selectedStudent} added to ${batch ? batch.name : 'the batch'} successfully`,
    });
  };

  const availableStudents = useMemo(() => {
    if (!batch) return [];
    const unenrolledStudents = mockStudents.filter(s => !s.enrolledBatches.includes(batch.id));

    if (!searchTerm) {
      return unenrolledStudents;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return unenrolledStudents.filter(student =>
      student.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      student.id.toLowerCase().includes(lowerCaseSearchTerm) ||
      (student.email && student.email.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [batch, searchTerm]);

  if (!batch) return null;

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
            <Label htmlFor="search">Search Student (Name, ID, or Email)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedStudent('');
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="student">Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableStudents.length > 0 ? (
                  availableStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500">
                    {searchTerm 
                        ? "No matching students found." 
                        : "All students are already enrolled in this batch."
                    }
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent} disabled={!selectedStudent}>
              Add Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;