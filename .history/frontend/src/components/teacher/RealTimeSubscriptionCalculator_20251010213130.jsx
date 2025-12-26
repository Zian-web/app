import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, Info, TrendingUp } from 'lucide-react';

const RealTimeSubscriptionCalculator = ({ 
  batchFees = 0, 
  studentLimit = 0, 
  currentStudents = 0,
  onCalculationChange = () => {}
}) => {
  const [fees, setFees] = useState(batchFees);
  const [maxStudents, setMaxStudents] = useState(studentLimit);
  const [currentStudentCount, setCurrentStudentCount] = useState(currentStudents);

  // Real-time calculation based on max(35, 7% of fees) logic
  const calculateSubscription = () => {
    const minPerStudent = 35;
    const commissionRate = 7; // 7%
    const minStudents = 20;

    // Calculate commission per student: max(7% of batch fees, ₹35)
    let commissionPerStudent;
    if (fees && fees > 0) {
      const sevenPercentOfFees = (fees * commissionRate) / 100;
      commissionPerStudent = Math.max(sevenPercentOfFees, minPerStudent);
    } else {
      commissionPerStudent = minPerStudent;
    }

    // Use max student limit for subscription calculation
    const effectiveStudentCount = Math.max(maxStudents, minStudents);
    
    // Calculate total subscription
    const totalSubscription = commissionPerStudent * effectiveStudentCount;

    // Calculate breakdown
    const sevenPercentAmount = fees ? (fees * commissionRate) / 100 : 0;
    const isSevenPercentHigher = sevenPercentAmount > minPerStudent;
    const actualCommissionUsed = isSevenPercentHigher ? sevenPercentAmount : minPerStudent;

    return {
      commissionPerStudent: Math.round(commissionPerStudent),
      effectiveStudentCount,
      totalSubscription: Math.round(totalSubscription),
      sevenPercentAmount: Math.round(sevenPercentAmount),
      minPerStudent,
      isSevenPercentHigher,
      actualCommissionUsed: Math.round(actualCommissionUsed),
      calculation: {
        step1: `7% of ₹${fees} = ₹${Math.round(sevenPercentAmount)}`,
        step2: `max(₹${Math.round(sevenPercentAmount)}, ₹${minPerStudent}) = ₹${Math.round(actualCommissionUsed)}`,
        step3: `₹${Math.round(actualCommissionUsed)} × ${effectiveStudentCount} students = ₹${Math.round(totalSubscription)}`
      }
    };
  };

  const calculation = calculateSubscription();

  useEffect(() => {
    onCalculationChange(calculation);
  }, [fees, maxStudents, currentStudentCount, calculation]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Real-Time Subscription Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="fees">Batch Fees (₹)</Label>
              <Input
                id="fees"
                type="number"
                value={fees}
                onChange={(e) => setFees(parseFloat(e.target.value) || 0)}
                placeholder="Enter batch fees"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(parseInt(e.target.value) || 0)}
                placeholder="Enter max students"
                min="1"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="currentStudents">Current Students</Label>
              <Input
                id="currentStudents"
                type="number"
                value={currentStudentCount}
                onChange={(e) => setCurrentStudentCount(parseInt(e.target.value) || 0)}
                placeholder="Current enrolled"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Real-time calculation display */}
          <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Live Calculation</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Batch Fees:</span>
                      <span className="font-medium">₹{fees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">7% of Fees:</span>
                      <span className="font-medium">₹{calculation.sevenPercentAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Minimum per Student:</span>
                      <span className="font-medium">₹{calculation.minPerStudent}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-gray-700">Commission per Student:</span>
                      <span className="font-bold text-blue-600">₹{calculation.commissionPerStudent}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Students:</span>
                      <span className="font-medium">{maxStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Students:</span>
                      <span className="font-medium">{currentStudentCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Effective Students:</span>
                      <span className="font-medium">{calculation.effectiveStudentCount}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium text-gray-700">Monthly Subscription:</span>
                      <span className="font-bold text-green-600">₹{calculation.totalSubscription}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-step calculation */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Calculation Steps</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    <span>{calculation.calculation.step1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    <span>{calculation.calculation.step2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    <span className="font-medium">{calculation.calculation.step3}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logic explanation */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Logic:</strong> Commission per student = max(7% of batch fees, ₹35). 
                  Total subscription = Commission per student × max(student_limit, 20 students).
                  {calculation.isSevenPercentHigher ? 
                    ` In this case, 7% of fees (₹${calculation.sevenPercentAmount}) is higher than minimum (₹${calculation.minPerStudent}).` :
                    ` In this case, minimum (₹${calculation.minPerStudent}) is higher than 7% of fees (₹${calculation.sevenPercentAmount}).`
                  }
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeSubscriptionCalculator;
