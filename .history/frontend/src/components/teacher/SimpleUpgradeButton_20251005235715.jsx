import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, CheckCircle, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const SimpleUpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    bankName: '',
    accountHolderName: '',
    email: '',
    phoneNumber: '+91'
  });
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpgrade = async () => {
    // Validate required fields
    if (!formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields: Bank Account Number, IFSC Code, Account Holder Name, Email, and Phone Number",
        variant: "destructive"
      });
      return;
    }

    // Validate Indian phone number format
    if (!formData.phoneNumber.startsWith('+91') || formData.phoneNumber.length !== 13) {
      toast({
        title: "Error",
        description: "Please enter a valid Indian phone number (10 digits after +91)",
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
        bank_name: formData.bankName,
        account_holder_name: formData.accountHolderName,
        email: formData.email,
        phone_number: formData.phoneNumber
      });

      // Create Razorpay account with all required fields
      // Frontend sends: email, full_name, phone_number, bank_account_number, ifsc_code, bank_name, account_type
      // Backend automatically adds: type="route", business_type="individual", profile, addresses from teacher registration
      await api.post('/api/teacher/razorpay-account', {
        email: formData.email,
        full_name: formData.accountHolderName,
        phone_number: formData.phoneNumber,
        bank_account_number: formData.bankAccountNumber,
        ifsc_code: formData.ifscCode,
        bank_name: formData.bankName,
        account_type: formData.accountType
      });
      
      setIsEnabled(true);
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

  if (isEnabled) {
    return (
      <Card className="border-green-500 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="font-medium text-green-800">Online Payment Enabled</p>
              <p className="text-sm text-green-600">You can collect payments from students</p>
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
            <br />
            <span className="text-xs text-gray-600">
              Note: Business type, profile category, and address details are automatically added from your teacher registration data.
            </span>
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
              <Label htmlFor="accountHolderName" className="text-sm font-medium">
                Account Holder Name *
              </Label>
              <Input
                id="accountHolderName"
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                placeholder="Name as per bank account"
                className="mt-1"
              />
            </div>
            
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => {
                let value = e.target.value;
                // Ensure it starts with +91
                if (!value.startsWith('+91')) {
                  value = '+91' + value.replace(/^\+91/, '');
                }
                handleInputChange('phoneNumber', value);
              }}
              placeholder="+91 9876543210"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Enter your 10-digit mobile number (e.g., 9876543210)</p>
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
              disabled={isLoading || !formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName || !formData.email || !formData.phoneNumber || formData.phoneNumber.length !== 13}
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

export default SimpleUpgradeButton;
