import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, RefreshCw, Info } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const SubscriptionCalculationDemo = () => {
  const [batchId, setBatchId] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const calculateSubscription = async () => {
    if (!batchId) {
      toast({
        title: "Error",
        description: "Please enter a batch ID",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/api/subscription/calculate/${batchId}`);
      setCalculationResult(response);
      
      toast({
        title: "Success",
        description: "Subscription calculation completed",
      });
    } catch (error) {
      console.error('Error calculating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to calculate subscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateSubscription = async () => {
    if (!batchId) {
      toast({
        title: "Error",
        description: "Please enter a batch ID",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post(`/api/teacher/subscription/recalculate/${batchId}`);
      setCalculationResult(response);
      
      toast({
        title: "Success",
        description: "Subscription recalculated successfully",
      });
    } catch (error) {
      console.error('Error recalculating subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to recalculate subscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enhanced Subscription Calculation Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="batchId"
                  type="number"
                  placeholder="Enter batch ID"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                />
                <Button 
                  onClick={calculateSubscription} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate
                </Button>
                <Button 
                  onClick={recalculateSubscription} 
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Recalculate
                </Button>
              </div>
            </div>

            {calculationResult && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Calculation Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Batch Information</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Batch ID:</span> {calculationResult.batch_id}</p>
                          <p><span className="font-medium">Batch Name:</span> {calculationResult.batch_name}</p>
                          <p><span className="font-medium">Batch Fees:</span> ₹{calculationResult.batch_fees}</p>
                          <p><span className="font-medium">Student Limit:</span> {calculationResult.student_limit}</p>
                          <p><span className="font-medium">Current Students:</span> {calculationResult.current_student_count}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-800">Subscription Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Monthly Fee:</span> ₹{calculationResult.monthly_fee}</p>
                          <p><span className="font-medium">Commission per Student:</span> ₹{calculationResult.commission_per_student}</p>
                          <p><span className="font-medium">Effective Students:</span> {calculationResult.effective_student_count}</p>
                          <p><span className="font-medium">Minimum Met:</span> 
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${calculationResult.minimum_met ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {calculationResult.minimum_met ? 'Yes' : 'No'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {calculationResult.subscription_calculation && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Detailed Calculation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><span className="font-medium">Commission per Student:</span> ₹{calculationResult.subscription_calculation.commission_per_student}</p>
                            <p><span className="font-medium">Student Count:</span> {calculationResult.subscription_calculation.student_count}</p>
                            <p><span className="font-medium">Total Subscription:</span> ₹{calculationResult.subscription_calculation.total_subscription}</p>
                          </div>
                          <div>
                            <p><span className="font-medium">Minimum Met:</span> {calculationResult.subscription_calculation.minimum_met ? 'Yes' : 'No'}</p>
                            <p><span className="font-medium">Batch Fees:</span> ₹{calculationResult.subscription_calculation.batch_fees}</p>
                            <p><span className="font-medium">Commission Rate:</span> {calculationResult.subscription_calculation.commission_rate}%</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <strong>Calculation Logic:</strong> 
                        Commission = max(7% of batch fees, ₹35) per student × max(student_limit, 20 students)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCalculationDemo;
