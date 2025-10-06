import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle } from 'lucide-react';
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


const BatchStudents = ({ batchId, students, payments, userRole, onSendFeeNotification, getPaymentStatusBadgeType, styles, onDeleteStudent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const filteredStudents = useMemo(() => students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  ), [students, searchQuery]);

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when search changes
    setDisplayedStudents([]); // Clear displayed students
  }, [searchQuery]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newStudents = filteredStudents.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedStudents(newStudents);
    } else {
      setDisplayedStudents(prev => [...prev, ...newStudents]);
    }
    setIsLoading(false);
  }, [currentPage, filteredStudents, itemsPerPage]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedStudents.length < filteredStudents.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      {userRole === 'teacher' && (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex-1 mr-4 w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm w-full"
            />
          </div>
        </div>
      )}
      <div 
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {displayedStudents.map((student) => {
            const studentPayments = (payments || []).filter(p => p.studentId === student.id);
            const hasUnpaidFees = studentPayments.some(p => p.status === 'pending' || p.status === 'overdue');

            return (
              <Card key={student.id} className="border rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-dark">{student.full_name}</h3>
                      <p className="text-sm text-neutral">{student.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center space-x-2 mt-4 sm:mt-0">
                      {hasUnpaidFees && userRole === 'teacher' && (
                        <Button
                          size="sm"
                          className={`${styles.button.outline} !text-warning !border-warning hover:!bg-warning/10`}
                          onClick={() => onSendFeeNotification(student.id)}
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Fee Alert</span>
                        </Button>
                      )}
                      {userRole === 'teacher' && <StudentAccessButton batchId={batchId} studentId={student.id} isInitiallyBlocked={student.material_access_blocked} />}
                      {userRole === 'teacher' && <Button size="sm" variant="destructive" onClick={() => onDeleteStudent(student.id)}>Delete</Button>}
                      <Badge variant={getPaymentStatusBadgeType(student.paymentStatus) || 'secondary'}>
                        {student.paymentStatus || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {isLoading && (
            <div className="text-center py-4">
              Loading more students...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchStudents;