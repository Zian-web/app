import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

const TeacherAttendance = ({ attendance, getBatchName, getStudentName }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendance Records</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map(att => (
                  <TableRow key={att.id}>
                    <TableCell>{att.date}</TableCell>
                    <TableCell>{getBatchName(att.batchId)}</TableCell>
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
    </div>
  );
};

export default TeacherAttendance;