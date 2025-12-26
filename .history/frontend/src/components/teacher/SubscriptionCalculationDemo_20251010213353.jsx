import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, RefreshCw, Info, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import RealTimeSubscriptionCalculator from './RealTimeSubscriptionCalculator';

const SubscriptionCalculationDemo = () => {
  const [batchId, setBatchId] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeCalculation, setRealTimeCalculation] = useState(null);
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

  const calculateRealTime = async () => {
    if (!realTimeCalculation) return;

    try {
      setIsLoading(true);
      const response = await api.get('/api/subscription/calculate-real-time', {
        params: {
          batch_fees: realTimeCalculation.batchFees,
          student_limit: realTimeCalculation.studentLimit,
          current_students: realTimeCalculation.currentStudents
        }
      });
      
      setCalculationResult(response);
      
      toast({
        title: "Success",
        description: "Real-time calculation completed",
      });
    } catch (error) {
      console.error('Error calculating real-time subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to calculate real-time subscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRealTimeCalculationChange = (calculation) => {
    setRealTimeCalculation(calculation);
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
          <div className="space-y-6">
            {/* Real-time Calculator */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Real-Time Calculator
              </h3>
              <RealTimeSubscriptionCalculator
                batchFees={0}
                studentLimit={0}
                currentStudents={0}
                onCalculationChange={handleRealTimeCalculationChange}
              />
              
              {realTimeCalculation && (
                <div className="mt-4">
                  <Button 
                    onClick={calculateRealTime}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4" />
                    Calculate with API
                  </Button>
                </div>
              )}
            </div>

            {/* Batch ID Calculator */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Calculate for Existing Batch</h3>
              <div className="flex gap-2">
                <Input
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
              </div>
            </div>

            {/* Results Display */}
            {calculationResult && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Calculation Result
                    </CardTitle>
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
                          <p><span className="font-medium">Monthly Fee:</span> ₹{calculationResult.calculation?.total_subscription}</p>
                          <p><span className="font-medium">Commission per Student:</span> ₹{calculationResult.calculation?.commission_per_student}</p>
                          <p><span className="font-medium">Effective Students:</span> {calculationResult.calculation?.effective_student_count}</p>
                          <p><span className="font-medium">7% of Fees:</span> ₹{calculationResult.calculation?.seven_percent_amount}</p>
                          <p><span className="font-medium">Minimum per Student:</span> ₹{calculationResult.calculation?.min_per_student}</p>
                        </div>
                      </div>
                    </div>

                    {calculationResult.calculation?.calculation_steps && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Step-by-Step Calculation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                            <span>{calculationResult.calculation.calculation_steps.step1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                            <span>{calculationResult.calculation.calculation_steps.step2}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                            <span className="font-medium">{calculationResult.calculation.calculation_steps.step3}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {calculationResult.calculation?.logic_explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-blue-800 text-sm flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Logic:</strong> {calculationResult.calculation.logic_explanation}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <strong>Calculation Complete:</strong> 
                        Monthly subscription fee is ₹{calculationResult.calculation?.total_subscription} 
                        based on {calculationResult.calculation?.effective_student_count} students 
                        at ₹{calculationResult.calculation?.commission_per_student} per student.
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