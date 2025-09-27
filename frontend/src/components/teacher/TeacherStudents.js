import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

const TeacherStudents = ({ students, batchIds, getPaymentStatusColor }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrolled Batches</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrolledBatches.filter(batchId => batchIds.includes(batchId)).length} batches</TableCell>
                    <TableCell><Badge className={getPaymentStatusColor(student.paymentStatus)}>{student.paymentStatus}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="mr-2">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
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

export default TeacherStudents;