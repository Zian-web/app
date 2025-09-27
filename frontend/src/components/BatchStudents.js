import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle } from 'lucide-react';

const BatchStudents = ({ students, payments, userRole, onSendFeeNotification, getPaymentStatusBadgeType, styles }) => {
  return (
    <div className="grid gap-4">
      {students.map(student => {
        const studentPayments = payments.filter(p => p.studentId === student.id);
        const hasUnpaidFees = studentPayments.some(p => p.status === 'pending' || p.status === 'overdue');

        return (
          <Card key={student.id} className={styles.card}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-dark">{student.name}</h3>
                  <p className="text-sm text-neutral">{student.email}</p>
                  <p className="text-sm text-neutral">{student.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
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
    </div>
  );
};

export default BatchStudents;