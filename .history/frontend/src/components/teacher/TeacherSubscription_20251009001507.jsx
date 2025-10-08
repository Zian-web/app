import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const TeacherSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionMetrics, setSubscriptionMetrics] = useState(null);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch subscription status
      const statusResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.STATUS);
      setSubscriptionStatus(statusResponse);
      
      // Fetch subscription metrics
      const metricsResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.METRICS);
      setSubscriptionMetrics(metricsResponse);
      
      // Fetch subscription payments
      const paymentsResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.PAYMENTS);
      setSubscriptionPayments(Array.isArray(paymentsResponse) ? paymentsResponse : []);
      
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (plan = 'basic') => {
    try {
      setIsCreating(true);
      await api.post(`/api/teacher/subscription/create?plan=${plan}`);
      
      toast({
        title: "Success",
        description: "Subscription created successfully",
      });
      
      fetchSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const processSubscriptionPayment = async (subscriptionId) => {
    try {
      await api.post(`/api/teacher/subscription/payment?subscription_id=${subscriptionId}`);
      
      toast({
        title: "Success",
        description: "Subscription payment processed",
      });
      
      fetchSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const unlockMaterials = async () => {
    try {
      await api.post('/api/teacher/subscription/unlock-materials');
      
      toast({
        title: "Success",
        description: "Materials unlocked successfully",
      });
      
      fetchSubscriptionData(); // Refresh data
    } catch (error) {
      console.error('Error unlocking materials:', error);
      toast({
        title: "Error",
        description: "Failed to unlock materials",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        {subscriptionStatus && !subscriptionStatus.subscription_active && (
          <Button onClick={() => createSubscription('basic')} disabled={isCreating}>
            <CreditCard className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create Subscription'}
          </Button>
        )}
        
        {subscriptionStatus && subscriptionStatus.subscription_active && (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">You already have an active subscription</p>
            <p className="text-sm text-gray-600 mt-1">Check the subscription details below</p>
          </div>
        )}
      </div>

      {/* Subscription Status Alert */}
      {subscriptionStatus && (
        <Alert className={subscriptionStatus.materials_locked ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {subscriptionStatus.materials_locked ? (
              <div className="flex items-center justify-between">
                <div>
                  <strong>Materials Locked:</strong> {subscriptionStatus.lock_reason || 'Subscription overdue'}
                  {subscriptionStatus.grace_period_ends && (
                    <p className="text-sm">Grace period ends: {new Date(subscriptionStatus.grace_period_ends).toLocaleDateString()}</p>
                  )}
                </div>
                <Button onClick={unlockMaterials} variant="outline" size="sm">
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock Materials
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                <span>All materials are accessible</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Overview Cards */}
      {subscriptionStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Subscription Status</p>
                  <p className="text-2xl font-bold">
                    {subscriptionStatus.subscription_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Inactive
                      </Badge>
                    )}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Materials Access</p>
                  <p className="text-2xl font-bold">
                    {subscriptionStatus.materials_locked ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        Unlocked
                      </Badge>
                    )}
                  </p>
                </div>
                {subscriptionStatus.materials_locked ? (
                  <Lock className="w-8 h-8 text-red-600" />
                ) : (
                  <Unlock className="w-8 h-8 text-green-600" />
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Payment</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {subscriptionStatus.next_payment_due ? 
                      new Date(subscriptionStatus.next_payment_due).toLocaleDateString() : 
                      'N/A'
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Metrics */}
      {subscriptionMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Current Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{subscriptionMetrics?.total_students || 0}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{subscriptionMetrics?.total_batches || 0}</p>
                <p className="text-sm text-gray-600">Total Batches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">₹{subscriptionMetrics?.average_fee_per_student || 0}</p>
                <p className="text-sm text-gray-600">Avg Fee per Student</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionPayments && Array.isArray(subscriptionPayments) && subscriptionPayments.length > 0 ? (
            <div className="space-y-4">
              {subscriptionPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Subscription Payment</p>
                    <p className="text-sm text-gray-600">
                      {payment.billing_period_start && payment.billing_period_end ? 
                        `${new Date(payment.billing_period_start).toLocaleDateString()} - ${new Date(payment.billing_period_end).toLocaleDateString()}` :
                        'Payment period not available'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{payment.amount || 0}</p>
                    <Badge variant={payment.payment_status === 'paid' ? 'default' : 'destructive'}>
                      {payment.payment_status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No payment history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSubscription;
