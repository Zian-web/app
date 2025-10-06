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
      
      // First, try to get existing payment link
      try {
        const redirectResponse = await api.get(ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_REDIRECT(batchId));
        if (redirectResponse.data?.redirect_url) {
          toast({
            title: "Redirecting to Payment",
            description: "Opening Razorpay payment page...",
          });
          window.open(redirectResponse.data.redirect_url, '_blank');
          return;
        }
      } catch (redirectError) {
        console.log('No existing payment link, creating new one...');
      }
      
      // If no existing link, create a new one
      const createResponse = await api.post(ENDPOINTS.PAYMENTS.STUDENT.CREATE_PAYMENT_LINK(batchId, months));
      
      if (createResponse.data?.redirect_url) {
        toast({
          title: "Payment Link Created",
          description: "Redirecting to Razorpay...",
        });
        window.open(createResponse.data.redirect_url, '_blank');
      } else {
        throw new Error('No redirect URL received');
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
      disabled={loading}
      className={`flex items-center gap-2 ${className}`}
      variant={variant}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating Payment...
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          Pay Now
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
