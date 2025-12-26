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
  Unlock,
  Clock,
  RefreshCw,
  Info,
  Calculator
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';
import RealTimeSubscriptionCalculator from './RealTimeSubscriptionCalculator';

const TeacherSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionMetrics, setSubscriptionMetrics] = useState(null);
  const [subscriptionPayments, setSubscriptionPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Subscription information components
  const renderSubscriptionInfo = (subscription) => {
    return (
      <div className="subscription-info bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Subscription Fee Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Maximum Student Limit:</span> {subscription.max_student_limit || subscription.student_limit || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current Enrolled:</span> {subscription.current_student_count || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Batch Fees:</span> ₹{subscription.batch_fees || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Minimum Met:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${subscription.minimum_met ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {subscription.minimum_met ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Commission per Student:</span> ₹{subscription.commission_per_student || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Monthly Fee:</span> ₹{subscription.monthly_fee || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Effective Students:</span> {subscription.effective_student_count || Math.max(subscription.current_student_count || 0, 20)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Commission Rate:</span> 7%
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-blue-800 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            <strong>Note:</strong> Subscription is based on maximum student limit, not current enrollment.
          </p>
        </div>
      </div>
    );
  };

  const showSubscriptionDetails = (batch) => {
    return (
      <div className="subscription-details bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Subscription Calculation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Maximum Students:</span> {batch.max_student_limit || batch.student_limit || 'N/A'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Current Students:</span> {batch.current_student_count || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Monthly Fee:</span> ₹{batch.monthly_fee || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Minimum Met:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${batch.minimum_met ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {batch.minimum_met ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Batch Fees:</span> ₹{batch.batch_fees || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Commission per Student:</span> ₹{batch.commission_per_student || 0}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Effective Students:</span> {batch.effective_student_count || Math.max(batch.current_student_count || 0, 20)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Commission Rate:</span> 7%
            </p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            <strong>💡 Tip:</strong> Subscription fee is calculated based on your maximum student limit 
            ({batch.max_student_limit || batch.student_limit || 'N/A'} students), not current enrollment 
            ({batch.current_student_count || 0} students).
          </p>
        </div>
      </div>
    );
  };

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
      
      // For each subscription, fetch detailed calculation
      if (statusResponse && statusResponse.subscriptions) {
        const updatedSubscriptions = await Promise.all(
          statusResponse.subscriptions.map(async (subscription) => {
            try {
              // Fetch detailed subscription calculation for this batch
              const calculationResponse = await api.get(`/api/subscription/calculate/${subscription.batch_id}`);
              return {
                ...subscription,
                ...calculationResponse,
                monthly_fee: calculationResponse.monthly_fee || calculationResponse.subscription_calculation?.total_subscription || subscription.monthly_fee,
                max_student_limit: calculationResponse.student_limit || subscription.max_student_limit,
                student_limit: calculationResponse.student_limit || subscription.student_limit,
                current_student_count: calculationResponse.current_student_count || subscription.current_student_count,
                batch_fees: calculationResponse.batch_fees || subscription.batch_fees,
                commission_per_student: calculationResponse.commission_per_student || calculationResponse.subscription_calculation?.commission_per_student || 0,
                effective_student_count: calculationResponse.effective_student_count || calculationResponse.subscription_calculation?.student_count || 0,
                minimum_met: calculationResponse.minimum_met || calculationResponse.subscription_calculation?.minimum_met || false
              };
            } catch (error) {
              console.error(`Error fetching calculation for batch ${subscription.batch_id}:`, error);
              return subscription;
            }
          })
        );
        
        setSubscriptionStatus({
          ...statusResponse,
          subscriptions: updatedSubscriptions
        });
      }
      
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
      await api.post(`${ENDPOINTS.SUBSCRIPTION.TEACHER.CREATE}?plan=${plan}`);
      
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

  const processSubscriptionPayment = async (subscriptionId, months = 1) => {
    try {
      console.log('Processing subscription payment:', { subscriptionId, months });
      
      // Use direct fetch to avoid API client issues
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${API_BASE_URL}/api/teacher/subscription/payment?subscription_id=${subscriptionId}&months=${months}`;
      
      console.log('Payment URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(import.meta.env.VITE_API_KEY && { 'X-API-Key': import.meta.env.VITE_API_KEY })
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          console.log('JSON response:', data);
          
          // Check for payment URL in various possible structures
          const paymentUrl = data?.payment_link_url || 
                            data?.payment_url || 
                            data?.url || 
                            data?.redirect_url ||
                            data?.payment_link ||
                            data?.link;
          
          if (paymentUrl) {
            console.log('Redirecting to payment URL:', paymentUrl);
            window.location.href = paymentUrl;
            toast({
              title: "Redirecting to Payment",
              description: "You will be redirected to Razorpay to complete the payment",
            });
          } else {
            console.error('No payment URL found in JSON response:', data);
            toast({
              title: "Error",
              description: "No payment URL received. Response: " + JSON.stringify(data),
              variant: "destructive"
            });
          }
        } else {
          // Handle HTML response (payment page)
          const html = await response.text();
          console.log('HTML response received, length:', html.length);
          
          if (html.includes('Razorpay') || html.includes('payment')) {
            // This is likely a payment page, redirect to it
            console.log('Payment page received, redirecting...');
            window.location.href = url;
            toast({
              title: "Redirecting to Payment",
              description: "You will be redirected to Razorpay to complete the payment",
            });
          } else {
            console.error('Unexpected HTML response:', html.substring(0, 200));
            toast({
              title: "Error",
              description: "Unexpected response format from server",
              variant: "destructive"
            });
          }
        }
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        toast({
          title: "Error",
          description: `Payment failed: ${response.status} - ${errorText}`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment: " + error.message,
        variant: "destructive"
      });
    }
  };

  const unlockMaterials = async () => {
    try {
      await api.post(ENDPOINTS.SUBSCRIPTION.TEACHER.UNLOCK_MATERIALS);
      
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

  const recalculateSubscriptionFees = async (batchId) => {
    try {
      const response = await api.post(`/api/teacher/subscription/recalculate/${batchId}`);
      
      toast({
        title: "Success",
        description: "Subscription fees recalculated successfully",
      });
      
      fetchSubscriptionData(); // Refresh data
      return response;
    } catch (error) {
      console.error('Error recalculating subscription fees:', error);
      toast({
        title: "Error",
        description: "Failed to recalculate subscription fees",
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

      {/* Subscription Details for Overview */}
      {subscriptionStatus && subscriptionStatus.subscriptions && subscriptionStatus.subscriptions.length > 0 && (
        <div className="space-y-4">
          {subscriptionStatus.subscriptions.map((subscription) => (
            <div key={`overview-${subscription.subscription_id}`}>
              {showSubscriptionDetails(subscription)}
            </div>
          ))}
        </div>
      )}

      {/* Batch Subscriptions */}
      {subscriptionStatus && subscriptionStatus.subscriptions && subscriptionStatus.subscriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Batch Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptionStatus.subscriptions.map((subscription) => (
                <div key={subscription.subscription_id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{subscription.batch_name || `Batch ${subscription.batch_id}`}</h3>
                        <Badge variant={subscription.payment_status === 'paid' ? 'default' : 'destructive'}>
                          {subscription.payment_status === 'paid' ? 'Paid' : 'Payment Due'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Subscription Period</p>
                          <p className="font-medium">
                            {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : 'N/A'} - 
                            {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Fee</p>
                          <p className="font-medium text-lg">
                            ₹{subscription.monthly_fee || 'Calculate Fee'}
                            {subscription.monthly_fee === 0 && (
                              <span className="text-xs text-orange-600 ml-2">(Fee not calculated)</span>
                            )}
                          </p>
                          {subscription.monthly_fee === 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum subscription fee will be calculated based on batch details
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Number of Students</p>
                          <p className="font-medium">{subscription.student_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Billing Date</p>
                          <p className="font-medium">
                            {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Subscription Information */}
                      {renderSubscriptionInfo(subscription)}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {/* Show Pay Now button for any subscription that's not paid */}
                      {subscription.payment_status !== 'paid' ? (
                        <div className="flex flex-col items-end gap-2">
                          <Button 
                            onClick={() => processSubscriptionPayment(subscription.subscription_id)}
                            className="flex items-center gap-2"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay Now {subscription.monthly_fee > 0 ? `(₹${subscription.monthly_fee})` : '(Calculate Fee)'}
                          </Button>
                          {subscription.monthly_fee === 0 && (
                            <p className="text-xs text-gray-500 text-right">
                              Fee will be calculated during payment
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Fee Information */}
      {subscriptionStatus && subscriptionStatus.subscriptions && subscriptionStatus.subscriptions.some(sub => sub.monthly_fee === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Subscription Fee Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Why is the subscription fee ₹0?</h4>
              <p className="text-sm text-orange-700 mb-3">
                The subscription fee is calculated based on your batch details. If the fee shows ₹0, it means:
              </p>
              <ul className="text-sm text-orange-700 space-y-1 ml-4">
                <li>• The batch doesn't have enough students (minimum 20 required)</li>
                <li>• The batch fees haven't been set properly</li>
                <li>• The subscription fee calculation is pending</li>
              </ul>
              <p className="text-sm text-orange-700 mt-3">
                <strong>Minimum subscription fee:</strong> ₹35 per student (minimum 20 students) or 7% of batch fees, whichever is higher.
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Recalculate fees for all subscriptions
                    if (subscriptionStatus && subscriptionStatus.subscriptions) {
                      subscriptionStatus.subscriptions.forEach(subscription => {
                        if (subscription.batch_id) {
                          recalculateSubscriptionFees(subscription.batch_id);
                        }
                      });
                    }
                  }}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recalculate Fees
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Information - Remove in production */}
      {process.env.NODE_ENV === 'development' && subscriptionStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Debug: Subscription Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(subscriptionStatus, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* No Subscriptions Message */}
      {subscriptionStatus && (!subscriptionStatus.subscriptions || subscriptionStatus.subscriptions.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              No Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Subscriptions Found
              </h3>
              <p className="text-gray-600 mb-4">
                You don't have any active subscriptions. Create a subscription to start using the platform.
              </p>
              <Button onClick={() => createSubscription('basic')} disabled={isCreating}>
                <CreditCard className="h-4 w-4 mr-2" />
                {isCreating ? 'Creating...' : 'Create Subscription'}
              </Button>
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
