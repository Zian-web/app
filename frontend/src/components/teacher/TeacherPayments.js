import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Bell } from 'lucide-react';
import PaymentSummary from '../PaymentSummary';

const TeacherPayments = ({
  payments = [],
  getStudentName,
  getBatchName,
  getPaymentStatusColor,
  paymentFilter,
  onFilterChange,
  paymentSearch,
  onSearchChange,
  onAlertPending
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Overall Payment</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <input
            type="text"
            placeholder="Search student or batch..."
            value={paymentSearch}
            onChange={onSearchChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
          />
          <div className="flex items-center justify-between gap-2">
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'all' ? 'default' : 'outline'} onClick={() => onFilterChange('all')}>All</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'paid' ? 'default' : 'outline'} onClick={() => onFilterChange('paid')}>Paid</Button>
            <Button className="flex-1 md:flex-initial" variant={paymentFilter === 'pending' ? 'default' : 'outline'} onClick={() => onFilterChange('pending')}>Due</Button>
          </div>
          <Button variant="secondary" onClick={onAlertPending} className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Alert All Due</span>
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell>{getStudentName(payment.studentId)}</TableCell>
                    <TableCell>{getBatchName(payment.batchId)}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell><Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge></TableCell>
                    <TableCell>{payment.paidDate || 'N/A'}</TableCell>
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

export default TeacherPayments;