import React from 'react';
import { Card, CardContent } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

const BatchAttendance = ({ attendance, getStudentName }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map(att => (
                <TableRow key={att.id}>
                  <TableCell>{att.date}</TableCell>
                  <TableCell>{getStudentName(att.studentId)}</TableCell>
                  <TableCell>
                    <Badge className={att.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {att.status}
                    </Badge>
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

export default BatchAttendance;