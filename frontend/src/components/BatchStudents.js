import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Input } from './ui/input';

const BatchStudents = ({ students, payments, userRole, onSendFeeNotification, getPaymentStatusBadgeType, styles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  }, [currentPage, filteredStudents]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedStudents.length < filteredStudents.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
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
      <div 
        className="h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {displayedStudents.map((student) => {
            const studentPayments = payments.filter(p => p.studentId === student.id);
            const hasUnpaidFees = studentPayments.some(p => p.status === 'pending' || p.status === 'overdue');

            return (
              <Card key={student.id} className={styles.card}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-dark">{student.name}</h3>
                      <p className="text-sm text-neutral">{student.email}</p>
                      <p className="text-sm text-neutral">{student.phone}</p>
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
                      <Button size="sm" variant="outline" className="mr-2">Actions</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                      <Badge className={styles.badge[getPaymentStatusBadgeType(student.paymentStatus)] || styles.badge.warning}>
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