import React, { useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { X, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const PaymentUpgradeBanner = ({ onUpgradeClick }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { toast } = useToast();

  const handleQuickUpgrade = async () => {
    try {
      setIsUpgrading(true);
      
      // Enable online payment without additional details
      await api.put('/api/teacher', {
        requires_online_payment: true
      });

      // Create Razorpay account with minimal details
      await api.post('/api/teacher/razorpay-account');
      
      toast({
        title: "Success",
        description: "Online payment enabled! You can now collect payments from students.",
      });
      
      setIsDismissed(true);
      onUpgradeClick?.();
    } catch (error) {
      console.error('Error enabling online payment:', error);
      toast({
        title: "Error",
        description: "Failed to enable online payment. Please try the full setup.",
        variant: "destructive"
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Alert className="border-blue-500 bg-blue-50 mb-6">
      <DollarSign className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <strong>💡 Enable Online Payments</strong>
            <p className="text-sm text-blue-700 mt-1">
              Start collecting payments from students online. Get automatic payment links for all your batches.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleQuickUpgrade}
            disabled={isUpgrading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <CreditCard className="w-3 h-3 mr-1" />
            {isUpgrading ? 'Enabling...' : 'Enable Now'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsDismissed(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PaymentUpgradeBanner;
