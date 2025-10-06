import React, { useState, useEffect } from 'react';
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
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    bankName: '',
    accountHolderName: '',
    email: '',
    phoneNumber: '+91',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    try {
      const response = await api.get('/api/users/me');
      console.log('Teacher data response:', response);
      console.log('Teacher data:', response.data);
      
      // Handle different response structures
      let teacherData = null;
      if (response.data) {
        teacherData = response.data;
      } else if (response && typeof response === 'object') {
        teacherData = response;
      }
      
      console.log('Processed teacher data:', teacherData);
      
      // Check if teacher has online payment enabled
      // The API returns the field as 'requires_online_payment' or we need to check if Razorpay account exists
      const hasOnlinePayment = teacherData && (
        teacherData.requires_online_payment === true || 
        teacherData.requires_online_payment === 'true' ||
        teacherData.has_razorpay_account === true ||
        teacherData.has_razorpay_account === 'true' ||
        teacherData.razorpay_account_id ||
        teacherData.razorpay_account_status === 'active'
      );
      
      if (hasOnlinePayment) {
        console.log('Teacher has online payment enabled');
        console.log('Online payment fields:', {
          requires_online_payment: teacherData.requires_online_payment,
          has_razorpay_account: teacherData.has_razorpay_account,
          razorpay_account_id: teacherData.razorpay_account_id,
          razorpay_account_status: teacherData.razorpay_account_status
        });
        setIsEnabled(true);
      } else {
        console.log('Teacher does not have online payment enabled');
        console.log('Available fields:', Object.keys(teacherData || {}));
        console.log('Online payment fields:', {
          requires_online_payment: teacherData?.requires_online_payment,
          has_razorpay_account: teacherData?.has_razorpay_account,
          razorpay_account_id: teacherData?.razorpay_account_id,
          razorpay_account_status: teacherData?.razorpay_account_status
        });
        setIsEnabled(false);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setIsEnabled(false);
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
    if (!formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName || !formData.email || !formData.phoneNumber || !formData.street || !formData.city || !formData.state || !formData.postalCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields: Bank Account Number, IFSC Code, Account Holder Name, Email, Phone Number, and Address details",
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

    // Validate street address length
    if (formData.street.length > 100) {
      toast({
        title: "Error",
        description: "Street address must be 100 characters or less",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Starting upgrade process...');
      console.log('Form data:', formData);
      
      // Step 1: Enable online payment (only requires_online_payment field)
      console.log('Step 1: Updating teacher online payment status...');
      await api.put('/api/teacher', {
        requires_online_payment: true
      });
      console.log('Teacher update successful');

      // Step 2: Create Razorpay account with correct field mapping
      console.log('Step 2: Creating Razorpay Route Account...');
      const razorpayData = {
        email: formData.email,
        full_name: formData.accountHolderName,
        phone_number: formData.phoneNumber,
        bank_account_number: formData.bankAccountNumber,
        ifsc_code: formData.ifscCode,
        bank_name: formData.bankName,
        account_type: formData.accountType,
        full_address: formData.street,
        district: formData.city,
        state: formData.state,
        pin_code: formData.postalCode
      };
      
      console.log('Razorpay data being sent:', razorpayData);
      await api.post('/api/teacher/razorpay-account', razorpayData);
      console.log('Razorpay account created successfully');
      
      // Refresh teacher status to get updated data
      console.log('Refreshing teacher status...');
      await checkPaymentStatus();
      
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

  if (isChecking) {
    return (
      <Card className="border-gray-300 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-gray-600">Checking payment status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            We need your bank account details and address to create a Razorpay Route Account for direct payments.
            <br />
            <span className="text-xs text-gray-600">
              Note: Business type and profile category are automatically added from your teacher registration data.
              <br />
              <strong>Important:</strong> If you have multiple addresses in your registration, please enter your primary address only (max 100 characters).
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

          {/* Address Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Address Details *</h4>
            <p className="text-xs text-gray-600 mb-3">
              Please enter a concise address (max 100 characters for street). 
              This will be used for your Razorpay account verification.
              <br />
              <strong>Note:</strong> Enter only your primary address to avoid conflicts with your registration data.
            </p>
            
            <div>
              <Label htmlFor="street" className="text-sm font-medium">
                Street Address * (Max 100 characters)
              </Label>
              <Input
                id="street"
                type="text"
                value={formData.street}
                onChange={(e) => {
                  // Limit to 100 characters
                  const value = e.target.value.slice(0, 100);
                  handleInputChange('street', value);
                }}
                placeholder="123 Main Street, Area Name"
                className="mt-1"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.street.length}/100 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="state" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="postalCode" className="text-sm font-medium">
                Postal Code *
              </Label>
              <Input
                id="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="400001"
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
              disabled={isLoading || !formData.bankAccountNumber || !formData.ifscCode || !formData.accountHolderName || !formData.email || !formData.phoneNumber || formData.phoneNumber.length !== 13 || !formData.street || !formData.city || !formData.state || !formData.postalCode}
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
