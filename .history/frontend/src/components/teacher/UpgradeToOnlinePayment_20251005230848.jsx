import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const UpgradeToOnlinePayment = ({ onUpgradeComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    bankName: ''
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
      
      // Update teacher profile with payment details
      await api.put('/api/teacher', {
        requires_online_payment: true,
        bank_account_number: formData.bankAccountNumber,
        ifsc_code: formData.ifscCode,
        account_type: formData.accountType,
        bank_name: formData.bankName
      });

      // Create Razorpay Route Account
      await api.post('/api/teacher/razorpay-account');
      
      setUpgradeComplete(true);
      toast({
        title: "Success",
        description: "Online payment enabled successfully! You can now collect payments from students.",
      });
      
      onUpgradeComplete?.();
    } catch (error) {
      console.error('Error upgrading to online payment:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to enable online payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (upgradeComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-500 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Online Payment Enabled!</h2>
            <p className="text-green-700 mb-4">
              You can now collect payments from students online. All your future batches will automatically get payment links.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CreditCard className="w-3 h-3 mr-1" />
                Online Payments
              </Badge>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Users className="w-3 h-3 mr-1" />
                Student Payments
              </Badge>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Zap className="w-3 h-3 mr-1" />
                Instant Setup
              </Badge>
            </div>
            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Upgrade to Online Payment</CardTitle>
          <p className="text-gray-600">
            Enable online payment collection from your students with just a few details
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              What you'll get:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Automatic payment links for batches
              </div>
              <div className="flex items-center text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Direct money transfer to your account
              </div>
              <div className="flex items-center text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Payment reminders to students
              </div>
              <div className="flex items-center text-blue-700">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Secure payment processing
              </div>
            </div>
          </div>

          {/* Required Information */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Required:</strong> We need your bank account details to create a Razorpay Route Account. 
              This allows students to pay you directly.
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="space-y-4">
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
          </div>

          {/* Security Note */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">🔒 Security & Privacy</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your bank details are encrypted and stored securely</li>
              <li>• We only use this information to create your payment account</li>
              <li>• Students never see your bank details</li>
              <li>• All transactions are processed through Razorpay (PCI DSS compliant)</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleUpgrade}
              disabled={isLoading || !formData.bankAccountNumber || !formData.ifscCode}
              className="w-full md:w-auto px-8 py-3 text-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {isLoading ? 'Setting up...' : 'Enable Online Payments'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeToOnlinePayment;
