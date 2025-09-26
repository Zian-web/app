import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockStudents } from '../data';

const BatchStudentManager = ({ batch, userRole }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const { toast } = useToast();

  const batchStudents = mockStudents.filter(student => 
    student.enrolledBatches.includes(batch.id)
  );

  const handleAddStudent = () => {
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive"
      });
      return;
    }

    const student = mockStudents.find(s => s.id === selectedStudent);
    if (student) {
      student.enrolledBatches.push(batch.id);
      toast({
        title: "Success",
        description: `${student.name} added to batch successfully`,
        variant: "default"
      });
      setSelectedStudent('');
      setShowAddStudent(false);
    }
  };

  const handleRemoveStudent = (student) => {
    student.enrolledBatches = student.enrolledBatches.filter(id => id !== batch.id);
    toast({
      title: "Success",
      description: `${student.name} removed from batch`,
      variant: "default"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Students</CardTitle>
          <CardDescription>Students enrolled in this batch</CardDescription>
        </div>
        {userRole === 'teacher' && (
          <Button onClick={() => setShowAddStudent(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showAddStudent && (
          <div className="mb-6 p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Student</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddStudent(false)}>×</Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student">Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-full">
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
                <Button variant="outline" onClick={() => setShowAddStudent(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>
                  Add Student
                </Button>
              </div>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batchStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      toast({
                        title: "View Student",
                        description: `Viewing ${student.name}'s details`,
                      });
                    }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {userRole === 'teacher' && (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveStudent(student)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BatchStudentManager;