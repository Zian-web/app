import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Settings,
  Bell,
  FileText,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const TeacherSubscriptionSystem = ({ teacherId, batches = [], materials = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscription, setSubscription] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');
  const [materialsLocked, setMaterialsLocked] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock subscription data - replace with actual API calls
  const mockSubscription = {
    id: 1,
    teacher_id: teacherId,
    subscription_plan: 'basic',
    monthly_fee: 700,
    student_count: 25,
    batch_count: 3,
    status: 'active',
    start_date: '2024-01-01',
    next_billing_date: '2024-02-01',
    grace_period_ends: '2024-02-12',
    days_until_expiry: 5,
    materials_locked: false,
    lock_reason: null
  };

  const mockSubscriptionPayments = [
    {
      id: 1,
      amount: 700,
      payment_date: '2024-01-01',
      payment_status: 'paid',
      billing_period_start: '2024-01-01',
      billing_period_end: '2024-01-31'
    },
    {
      id: 2,
      amount: 700,
      payment_date: null,
      payment_status: 'due',
      billing_period_start: '2024-02-01',
      billing_period_end: '2024-02-29'
    }
  ];

  useEffect(() => {
    setSubscription(mockSubscription);
    setSubscriptionStatus(mockSubscription.status);
    setMaterialsLocked(mockSubscription.materials_locked);
  }, [teacherId]);

  // Calculate subscription metrics
  const totalStudents = batches.reduce((sum, batch) => sum + (batch.approved_student_count || 0), 0);
  const totalBatches = batches.length;
  const averageFeePerStudent = totalStudents > 0 ? 500 : 0; // Mock calculation

  // Calculate subscription fee based on student count
  const calculateSubscriptionFee = (studentCount) => {
    const baseFee = 700; // ₹700 for first 20 students
    const includedStudents = 20;
    const commissionPerStudent = 35; // Minimum ₹35 per additional student
    
    if (studentCount <= includedStudents) {
      return baseFee;
    }
    
    const additionalStudents = studentCount - includedStudents;
    const additionalFee = additionalStudents * commissionPerStudent;
    
    return baseFee + additionalFee;
  };

  const currentSubscriptionFee = calculateSubscriptionFee(totalStudents);

  const handlePaySubscription = async () => {
    try {
      setIsLoading(true);
      // API call to process subscription payment
      toast({
        title: "Payment Processing",
        description: "Redirecting to payment gateway...",
        variant: "default"
      });
      
      // Simulate payment process
      setTimeout(() => {
        toast({
          title: "Payment Successful",
          description: "Your subscription has been renewed successfully",
          variant: "default"
        });
        setShowPaymentDialog(false);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process subscription payment. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleSendReminder = async () => {
    try {
      setIsLoading(true);
      // API call to send payment reminder
      toast({
        title: "Reminder Sent",
        description: "Payment reminder has been sent to your email",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'suspended': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expired': return <Lock className="w-4 h-4 text-red-600" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Subscription Management</h2>
          <p className="text-muted-foreground">Manage your platform subscription and access</p>
        </div>
        <div className="flex gap-2">
          {subscriptionStatus === 'active' && (
            <Button onClick={handleSendReminder} variant="outline" disabled={isLoading}>
              <Bell className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          )}
        </div>
      </div>

      {/* Subscription Status Alert */}
      {materialsLocked && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Materials Locked:</strong> Your subscription payment is overdue. 
            All your materials are locked until payment is received. 
            <Button 
              variant="link" 
              className="p-0 h-auto ml-2"
              onClick={() => setShowPaymentDialog(true)}
            >
              Pay Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {subscriptionStatus === 'expired' && !materialsLocked && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment Due Soon:</strong> Your subscription payment is due on {subscription?.next_billing_date}. 
            Materials will be locked if payment is not received by the grace period end date.
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
            {getStatusIcon(subscriptionStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{subscriptionStatus}</div>
            <p className="text-xs text-muted-foreground">
              {subscription?.days_until_expiry} days until expiry
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentSubscriptionFee.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Based on {totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalBatches} batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Access</CardTitle>
            {materialsLocked ? (
              <Lock className="h-4 w-4 text-red-600" />
            ) : (
              <Unlock className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {materialsLocked ? 'Locked' : 'Unlocked'}
            </div>
            <p className="text-xs text-muted-foreground">
              {materials.length} materials available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <Badge variant="outline">{subscription?.subscription_plan}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Fee:</span>
                  <span className="font-bold">₹{currentSubscriptionFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Billing:</span>
                  <span className="font-medium">{subscription?.next_billing_date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grace Period Ends:</span>
                  <span className="font-medium text-orange-600">{subscription?.grace_period_ends}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={getStatusColor(subscriptionStatus)}>
                      {subscriptionStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Students:</span>
                    <span className="font-medium">{totalStudents}/200</span>
                  </div>
                  <Progress value={(totalStudents / 200) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Batches:</span>
                    <span className="font-medium">{totalBatches}/50</span>
                  </div>
                  <Progress value={(totalBatches / 50) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Materials:</span>
                    <span className="font-medium">{materials.length}/1000</span>
                  </div>
                  <Progress value={(materials.length / 1000) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setShowPaymentDialog(true)}
                  className="h-20 flex flex-col gap-2"
                  disabled={isLoading}
                >
                  <CreditCard className="w-6 h-6" />
                  <span>Pay Subscription</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendReminder}
                  className="h-20 flex flex-col gap-2"
                  disabled={isLoading}
                >
                  <Bell className="w-6 h-6" />
                  <span>Send Reminder</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {/* Show subscription history */}}
                  className="h-20 flex flex-col gap-2"
                >
                  <FileText className="w-6 h-6" />
                  <span>View History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4 p-4">
                {mockSubscriptionPayments.map(payment => (
                  <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Subscription Payment</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.billing_period_start} - {payment.billing_period_end}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{payment.amount}</p>
                      <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {payment.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches.map(batch => (
                    <div key={batch.id} className="flex justify-between items-center">
                      <span>{batch.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{batch.approved_student_count || 0}</span>
                        <span className="text-sm text-muted-foreground">students</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Fee (20 students):</span>
                    <span className="font-medium">₹700</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Additional Students:</span>
                    <span className="font-medium">{Math.max(0, totalStudents - 20)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Additional Fee:</span>
                    <span className="font-medium">₹{Math.max(0, totalStudents - 20) * 35}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Monthly Fee:</span>
                    <span>₹{currentSubscriptionFee.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Subscription Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Reminders</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Send email reminders before due date</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto-renewal</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Automatically renew subscription</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Preferences</label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Payment due reminders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Material lock warnings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Usage limit alerts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Subscription Fee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Monthly Fee:</span>
                <span className="font-bold text-lg">₹{currentSubscriptionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Students:</span>
                <span>{totalStudents}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Batches:</span>
                <span>{totalBatches}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <select className="w-full p-2 border rounded-md">
                <option value="razorpay">Razorpay (Online)</option>
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePaySubscription}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Pay Now'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherSubscriptionSystem;
