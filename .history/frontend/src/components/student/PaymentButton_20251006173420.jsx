import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';

const PaymentButton = ({ batchId, months = 1, className = "", variant = "default" }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayNow = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to make payments",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Redirecting to payment page...');
      
      // Direct redirect to payment page with parameters
      const paymentUrl = `${API_BASE_URL}/api/student/batch/${batchId}/payment-page?months=${months}&token=${encodeURIComponent(token)}`;
      window.location.href = paymentUrl;
      
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.detail === "Invalid token") {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Payment Failed",
          description: error.response?.data?.detail || "Failed to initiate payment",
          variant: "destructive"
        });
      }
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
          Processing...
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
