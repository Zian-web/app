import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Users, FileText, Bell, Eye, CreditCard } from 'lucide-react';
import PaymentSummary from '../shared/PaymentSummary';
import BankAccountDetailsDialog from '../forms/BankAccountDetailsDialog';
import SimpleUpgradeButton from './SimpleUpgradeButton';

const TeacherDashboardOverview = ({
  batches = [],
  students = [],
  materials = [],
  notifications = [],
  onSelectBatch = () => {}
}) => {
  const [showBankDetailsDialog, setShowBankDetailsDialog] = useState(false);

  return (
    <div className="space-y-6">
      <SimpleUpgradeButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade to Online Payment
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upgrade to Online Payment</h3>
                <p className="text-sm text-gray-600">Enable online payment collection from students</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowBankDetailsDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Batches</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batches.slice(0, 3).map(batch => (
                <div key={batch.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{batch.name}</p>
                    <p className="text-sm text-slate-600">{batch.schedule}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{batch.approved_student_count} students</Badge>
                    <Button size="sm" variant="outline" onClick={() => onSelectBatch(batch)}><Eye className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <Badge variant="outline">{notification.batchName}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(notification.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BankAccountDetailsDialog
        isOpen={showBankDetailsDialog}
        onClose={() => setShowBankDetailsDialog(false)}
      />
    </div>
  );
};

export default TeacherDashboardOverview;
