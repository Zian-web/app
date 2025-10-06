import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const SimpleRazorpaySetup = ({ onSetupComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const { toast } = useToast();

  const createRazorpayAccount = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/teacher/razorpay-account');
      
      setAccountCreated(true);
      toast({
        title: "Success",
        description: "Razorpay account created successfully! You can now receive online payments.",
      });
      
      onSetupComplete?.(response.data);
    } catch (error) {
      console.error('Error creating Razorpay account:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create Razorpay account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Razorpay Account Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!accountCreated ? (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Required:</strong> To enable online payments for your batches, you need to create a Razorpay account. 
                This will allow students to pay you directly through the platform.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label>What this does:</Label>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Creates a Razorpay Route Account for you</li>
                  <li>• Enables online payment collection from students</li>
                  <li>• Automatically generates payment links for your batches</li>
                  <li>• Allows direct money transfer to your bank account</li>
                </ul>
              </div>
              
              <Button 
                onClick={createRazorpayAccount} 
                disabled={isLoading}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isLoading ? 'Creating Account...' : 'Create Razorpay Account'}
              </Button>
            </div>
          </>
        ) : (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>✅ Razorpay Account Created!</strong> You can now create batches with online payment enabled.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleRazorpaySetup;
