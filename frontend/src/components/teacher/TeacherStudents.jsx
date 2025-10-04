import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { toggleStudentAccess } from '../../lib/api';

const StudentAccessButton = ({ batchId, studentId, isInitiallyBlocked }) => {
  const { toast } = useToast();
  const [isBlocked, setIsBlocked] = useState(isInitiallyBlocked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleAccess = async () => {
    setIsLoading(true);
    try {
      const response = await toggleStudentAccess(batchId, studentId);
      setIsBlocked(response.material_access_blocked);
      toast({
        title: 'Success',
        description: response.material_access_blocked
          ? 'Student access to materials has been blocked.'
          : 'Student access to materials has been restored.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update student access.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={isBlocked ? 'destructive' : 'outline'}
      onClick={handleToggleAccess}
      disabled={isLoading}
      className="mr-2"
    >
      {isLoading ? 'Updating...' : (isBlocked ? 'Unblock Access' : 'Block Access')}
    </Button>
  );
};

const TeacherStudents = ({ students, onDeleteStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() =>
    students.filter(student =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.batch_name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [students, searchQuery]);

  return (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex-1 mr-4 w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search students by name, email, or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-lg w-full"
            />
          </div>
        </div>
      <div 
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
      >
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            filteredStudents.map((student) => (
              <Card key={`${student.id}-${student.batch_id}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-dark">{student.full_name}</h3>
                      <p className="text-sm text-neutral">{student.email}</p>
                      <p className="text-sm text-neutral-dark font-semibold mt-1">Batch: {student.batch_name}</p>
                    </div>
                    <div className="flex flex-wrap items-center space-x-2 mt-4 sm:mt-0">
                        <StudentAccessButton batchId={student.batch_id} studentId={student.id} isInitiallyBlocked={student.material_access_blocked} />
                        <Button size="sm" variant="destructive" onClick={() => onDeleteStudent(student.batch_id, student.id)}>Delete</Button>
                      <Badge className={student.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {student.payment_status || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents;