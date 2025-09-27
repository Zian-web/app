import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const BatchPayments = ({ 
  payments, 
  userRole, 
  getStudentName, 
  getPaymentStatusColor, 
  onUpdatePayment,
  paymentFilter,
  onFilterChange,
  paymentSearch,
  onSearchChange
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);

  const handleUpdatePayment = (payment) => {
    setSelectedPayment(payment);
    setShowUpdatePayment(true);
    onUpdatePayment(payment);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Payment Records</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search student..."
            value={paymentSearch}
            onChange={onSearchChange}
            className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <Button variant={paymentFilter === 'all' ? 'default' : 'outline'} onClick={() => onFilterChange('all')}>All</Button>
            <Button variant={paymentFilter === 'paid' ? 'default' : 'outline'} onClick={() => onFilterChange('paid')}>Paid</Button>
            <Button variant={paymentFilter === 'pending' ? 'default' : 'outline'} onClick={() => onFilterChange('pending')}>Pending</Button>
          </div>
        </div>
      </div>

      {/* This is where the update payment UI was, it's now handled in BatchDetails */}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  {userRole === 'teacher' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(payment => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{getStudentName(payment.studentId)}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.paidDate || 'N/A'}</TableCell>
                    {userRole === 'teacher' && (
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdatePayment(payment)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Update
                        </Button>
                      </TableCell>
                    )}
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

export default BatchPayments;