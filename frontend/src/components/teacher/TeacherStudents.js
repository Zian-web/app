import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

const TeacherStudents = ({ students, batchIds, getPaymentStatusColor }) => {
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newStudents = students.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedStudents(newStudents);
    } else {
      setDisplayedStudents(prev => [...prev, ...newStudents]);
    }
    setIsLoading(false);
  }, [currentPage, students]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedStudents.length < students.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students</h2>
      <Card>
        <CardContent className="p-0">
          <div 
            className="overflow-x-auto h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
            onScroll={handleScroll}
          >
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">Student ID</TableHead>
                  <TableHead className="w-[20%]">Name</TableHead>
                  <TableHead className="w-[25%]">Email</TableHead>
                  <TableHead className="w-[15%]">Enrolled Batches</TableHead>
                  <TableHead className="w-[15%]">Payment Status</TableHead>
                  <TableHead className="w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium w-[10%]">{student.id}</TableCell>
                    <TableCell className="w-[20%]">{student.name}</TableCell>
                    <TableCell className="w-[25%]">{student.email}</TableCell>
                    <TableCell className="w-[15%]">{student.enrolledBatches.filter(batchId => batchIds.includes(batchId)).length} batches</TableCell>
                    <TableCell className="w-[15%]"><Badge className="bg-gray-200 text-gray-800">{student.paymentStatus}</Badge></TableCell>
                    <TableCell className="w-[15%]">
                      <Button size="sm" variant="outline" className="mr-2">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Loading more students...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStudents;