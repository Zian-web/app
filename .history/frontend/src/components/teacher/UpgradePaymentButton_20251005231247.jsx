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
      const response = await api.get('/api/users/me');
      const teacherData = response.data;
      setIsOnlinePaymentEnabled(teacherData.requires_online_payment || false);
    } catch (error) {
      console.error('Error checking payment status:', error);
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
            onClick={handleUpgrade}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? 'Enabling...' : 'Enable Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePaymentButton;
