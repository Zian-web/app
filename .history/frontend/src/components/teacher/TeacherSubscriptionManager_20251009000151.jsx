import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';
import { api } from '../../lib/api';
import { CreditCard, DollarSign, Users, Calendar, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

const TeacherSubscriptionManager = ({ teacherId }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionMetrics, setSubscriptionMetrics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, [teacherId]);

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      // Fetch subscription status
      const statusData = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.STATUS);
      setSubscriptionStatus(statusData);

      // Fetch subscription metrics
      const metricsData = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.METRICS);
      setSubscriptionMetrics(metricsData);

      // Fetch teacher subscriptions
      const subscriptionsData = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.SUBSCRIPTIONS);
      setSubscriptions(subscriptionsData.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (plan = 'basic') => {
    try {
      setLoading(true);
      
      await api.post(`${ENDPOINTS.SUBSCRIPTION.TEACHER.CREATE}?plan=${plan}`);
      
      toast({
        title: "Success",
        description: "Subscription created successfully",
      });
      fetchSubscriptionData();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Expired</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {subscriptionStatus && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {subscriptionStatus.subscription_active ? 'Active' : 'Inactive'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Next Billing</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {subscriptionStatus.next_payment_due ? 
                          new Date(subscriptionStatus.next_payment_due).toLocaleDateString() : 
                          'N/A'
                        }
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Materials</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {subscriptionStatus.materials_locked ? 'Locked' : 'Unlocked'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={() => createSubscription('basic')} disabled={loading}>
                  Create Basic Subscription
                </Button>
                <Button variant="outline" onClick={() => createSubscription('premium')} disabled={loading}>
                  Create Premium Subscription
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Active Subscriptions</h3>
                <Button onClick={fetchSubscriptionData} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              {subscriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Monthly Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.batch_name}</TableCell>
                        <TableCell>{subscription.subscription_plan}</TableCell>
                        <TableCell>₹{subscription.monthly_fee}</TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>
                          {subscription.next_billing_date ? 
                            new Date(subscription.next_billing_date).toLocaleDateString() : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>{subscription.student_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active subscriptions</p>
                  <Button onClick={() => createSubscription()} className="mt-4">
                    Create First Subscription
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              {subscriptionMetrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Total Students</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{subscriptionMetrics.total_students}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Monthly Revenue</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">₹{subscriptionMetrics.monthly_revenue}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Commission Rate</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{subscriptionMetrics.commission_percentage}%</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Beta Testing</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {subscriptionMetrics.beta_testing_free ? 'Free' : 'Paid'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherSubscriptionManager;
