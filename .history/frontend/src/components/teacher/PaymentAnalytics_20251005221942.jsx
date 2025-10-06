import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const PaymentAnalytics = ({ batches = [], payments = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock analytics data - replace with actual API calls
  const mockAnalytics = {
    totalRevenue: 125000,
    monthlyRevenue: 45000,
    weeklyRevenue: 12000,
    dailyAverageRevenue: 1800,
    totalStudents: 150,
    paidStudents: 120,
    dueStudents: 30,
    paymentRate: 80,
    averagePayment: 2500,
    topBatches: [
      { id: 1, name: 'Math Class A', revenue: 25000, students: 25 },
      { id: 2, name: 'Science Class B', revenue: 20000, students: 20 },
      { id: 3, name: 'English Class C', revenue: 15000, students: 15 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 40000, students: 120 },
      { month: 'Feb', revenue: 45000, students: 135 },
      { month: 'Mar', revenue: 50000, students: 150 },
      { month: 'Apr', revenue: 48000, students: 145 },
      { month: 'May', revenue: 52000, students: 155 },
      { month: 'Jun', revenue: 55000, students: 165 }
    ],
    paymentMethods: [
      { method: 'Online', count: 80, percentage: 66.7, amount: 100000 },
      { method: 'Cash', count: 40, percentage: 33.3, amount: 25000 }
    ],
    dailyRevenue: [
      { date: '2024-01-01', revenue: 2000 },
      { date: '2024-01-02', revenue: 2500 },
      { date: '2024-01-03', revenue: 1800 },
      { date: '2024-01-04', revenue: 3200 },
      { date: '2024-01-05', revenue: 2800 },
      { date: '2024-01-06', revenue: 1500 },
      { date: '2024-01-07', revenue: 2200 }
    ]
  };

  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    // Fetch analytics data based on time range and batch filter
    fetchAnalytics();
  }, [timeRange, selectedBatch]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      // API call to fetch analytics
      // setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async (format) => {
    try {
      setIsLoading(true);
      // API call to export data
      toast({
        title: "Export Started",
        description: `Exporting data in ${format} format...`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRevenueGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Payment Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your payment data</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => handleExportData('csv')} variant="outline" disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.paymentRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              {analytics.paidStudents}/{analytics.totalStudents} students paid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.averagePayment)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              +5.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="batches">Top Batches</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Revenue trend chart will be implemented here</p>
                    <p className="text-sm">Monthly revenue: {formatCurrency(analytics.monthlyRevenue)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.paymentMethods.map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{method.method}</span>
                        <span className="text-sm text-muted-foreground">
                          {method.percentage}% ({method.count} payments)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(method.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Weekly Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.weeklyRevenue)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Daily Average</p>
                    <p className="text-2xl font-bold">{formatCurrency(analytics.dailyRevenue[0]?.revenue || 0)}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Due Amount</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency((analytics.totalStudents - analytics.paidStudents) * analytics.averagePayment)}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Trends Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Monthly revenue chart will be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.dailyRevenue.map((day, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{day.date}</span>
                      <span className="font-medium">{formatCurrency(day.revenue)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Batches Tab */}
        <TabsContent value="batches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Batches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topBatches.map((batch, index) => (
                  <div key={batch.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{batch.name}</p>
                        <p className="text-sm text-muted-foreground">{batch.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(batch.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(batch.revenue / batch.students)} per student
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Payment methods pie chart will be implemented here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Method Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.paymentMethods.map((method, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{method.method}</span>
                        <Badge variant="outline">{method.count} payments</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Amount:</span>
                          <span className="font-medium">{formatCurrency(method.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Percentage:</span>
                          <span className="font-medium">{method.percentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average per payment:</span>
                          <span className="font-medium">
                            {formatCurrency(method.amount / method.count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold">{formatCurrency(analytics.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Revenue:</span>
                    <span className="font-medium">{formatCurrency(analytics.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Revenue:</span>
                    <span className="font-medium">{formatCurrency(analytics.weeklyRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Student:</span>
                    <span className="font-medium">{formatCurrency(analytics.averagePayment)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Growth Rate:</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Students:</span>
                    <span className="font-bold">{analytics.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Students:</span>
                    <span className="font-medium text-green-600">{analytics.paidStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Students:</span>
                    <span className="font-medium text-red-600">{analytics.dueStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Rate:</span>
                    <span className="font-medium">{analytics.paymentRate}%</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${analytics.paymentRate}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Payment completion rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentAnalytics;
