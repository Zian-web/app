import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, CheckCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const UpgradePaymentButton = () => {
  const [isOnlinePaymentEnabled, setIsOnlinePaymentEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    bankName: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      // Try /api/users/me first
      const response = await api.get('/api/users/me');
      const teacherData = response.data;
      
      console.log('API Response:', teacherData); // Debug log
      
      // Handle different possible response structures
      const isEnabled = teacherData?.requires_online_payment || 
                       teacherData?.data?.requires_online_payment || 
                       false;
      
      if (isEnabled !== undefined) {
        setIsOnlinePaymentEnabled(isEnabled);
      } else {
        // Fallback: try teacher profile endpoint
        try {
          const teacherResponse = await api.get('/api/teacher');
          const teacherProfile = teacherResponse.data;
          setIsOnlinePaymentEnabled(teacherProfile?.requires_online_payment || false);
        } catch (teacherError) {
          console.error('Error checking teacher profile:', teacherError);
          setIsOnlinePaymentEnabled(false);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // If we can't check, assume they need upgrade
      setIsOnlinePaymentEnabled(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpgrade = async () => {
    // Validate required fields
    if (!formData.bankAccountNumber || !formData.ifscCode) {
      toast({
        title: "Error",
        description: "Please fill in Bank Account Number and IFSC Code",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Enable online payment with bank details
      await api.put('/api/teacher', {
        requires_online_payment: true,
        bank_account_number: formData.bankAccountNumber,
        ifsc_code: formData.ifscCode,
        account_type: formData.accountType,
        bank_name: formData.bankName
      });

      // Create Razorpay account
      await api.post('/api/teacher/razorpay-account');
      
      setIsOnlinePaymentEnabled(true);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Online payment enabled! You can now collect payments from students.",
      });
    } catch (error) {
      console.error('Error enabling online payment:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to enable online payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return null;
  }

  if (isOnlinePaymentEnabled) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">Online Payment Enabled</p>
                <p className="text-sm text-green-600">You can collect payments from students</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <Card className="border-blue-500 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Enable Online Payments
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowForm(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-blue-700">
            We need your bank account details to create a Razorpay Route Account for direct payments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankAccountNumber" className="text-sm font-medium">
                Bank Account Number *
              </Label>
              <Input
                id="bankAccountNumber"
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                placeholder="Enter your bank account number"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="ifscCode" className="text-sm font-medium">
                IFSC Code *
              </Label>
              <Input
                id="ifscCode"
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountType" className="text-sm font-medium">
                Account Type
              </Label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="bankName" className="text-sm font-medium">
                Bank Name
              </Label>
              <Input
                id="bankName"
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="e.g., State Bank of India"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpgrade}
              disabled={isLoading || !formData.bankAccountNumber || !formData.ifscCode}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {isLoading ? 'Enabling...' : 'Enable Online Payments'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="font-medium text-blue-800">Enable Online Payments</p>
              <p className="text-sm text-blue-600">Start collecting payments from students</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Enable Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePaymentButton;
