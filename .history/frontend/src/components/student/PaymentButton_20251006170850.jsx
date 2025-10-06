import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS } from '../../config/endpoints';

const PaymentButton = ({ batchId, months = 1, className = "", variant = "default" }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayNow = async () => {
    try {
      setLoading(true);
      
      const response = await api.post(ENDPOINTS.PAYMENTS.ONLINE.INITIATE, {
        batch_id: batchId,
        months: months,
        payment_mode: "online"
      });
      
      if (response.data?.url) {
        // Redirect to the payment page
        window.location.href = response.data.url;
      } else {
        toast({
          title: "Payment Error",
          description: "No payment URL received",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.response?.data?.detail || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayNow}
      className={`flex items-center gap-2 ${className}`}
      variant={variant}
    >
      <CreditCard className="h-4 w-4" />
      Pay Now
    </Button>
  );
};

export default PaymentButton;
