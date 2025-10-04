import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { teacherService } from '../../services/teacherService';

const BatchStudentManager = ({ batch, userRole }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const fetchedStudents = await teacherService.getBatchStudents(batch.id);
        setStudents(fetchedStudents);
      } catch (error) {
        toast({
          title: "Error fetching students",
          description: error.message,
          variant: "destructive"
        });
      }
    };

    if (batch?.id) {
      fetchStudents();
    }
  }, [batch, toast]);

  const handleAddStudent = () => {
    // TODO: This function still uses mock data and needs to be adapted to use API calls.
    if (!selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive"
      });
      return;
    }

    toast({ title: "Info", description: "Add student functionality needs to be updated to work with the API." });
  };

  const handleRemoveStudent = async (studentId, studentName) => {
    try {
      await teacherService.removeStudentFromBatch(batch.id, studentId);
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentId));
      toast({
        title: "Success",
        description: `${studentName} has been removed from the batch.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove student: ${error.message}`,
        variant: "destructive"
      });
    }
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
                    {/* This part needs to be updated to fetch available students from an API */}
                    <SelectItem value="mock">Mock Student (Not implemented)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id} className="flex flex-col md:table-row mb-4 md:mb-0">
                  <TableCell className="md:table-cell" data-label="ID">{student.id}</TableCell>
                  <TableCell className="md:table-cell" data-label="Name">{student.name}</TableCell>
                  <TableCell className="md:table-cell" data-label="Email">{student.email}</TableCell>
                  <TableCell className="md:table-cell" data-label="Payment Status">{student.payment_status || 'N/A'}</TableCell>
                  <TableCell className="md:table-cell" data-label="Actions">
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
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveStudent(student.id, student.name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchStudentManager;