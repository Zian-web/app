import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const BatchAttendance = ({ attendance, getStudentName }) => {
  const [displayedAttendance, setDisplayedAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newAttendance = attendance.slice(startIndex, endIndex);
    
    if (currentPage === 1) {
      setDisplayedAttendance(newAttendance);
    } else {
      setDisplayedAttendance(prev => [...prev, ...newAttendance]);
    }
    setIsLoading(false);
  }, [currentPage, attendance]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !isLoading && displayedAttendance.length < attendance.length) {
      setIsLoading(true);
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div 
          className="overflow-x-auto h-[75vh] sm:h-[80vh] md:h-[85vh] min-h-[600px] overflow-y-auto"
          onScroll={handleScroll}
        >
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Date</TableHead>
                <TableHead className="w-[40%]">Student</TableHead>
                <TableHead className="w-[30%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedAttendance.map((att) => (
                <TableRow key={att.id}>
                  <TableCell className="w-[30%]">{att.date}</TableCell>
                  <TableCell className="w-[40%]">{getStudentName(att.studentId)}</TableCell>
                  <TableCell className="w-[30%]">
                   <Badge variant={att.status === 'present' ? 'success' : 'destructive'}>
                     {att.status}
                   </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading more attendance records...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchAttendance;
