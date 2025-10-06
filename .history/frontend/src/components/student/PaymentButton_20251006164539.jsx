import React from 'react';
import { Button } from '../ui/button';
import { CreditCard } from 'lucide-react';
import { ENDPOINTS, API_BASE_URL } from '../../config/endpoints';

const PaymentButton = ({ batchId, months = 1, className = "", variant = "default" }) => {
  const handlePayNow = () => {
    // Simple redirect to payment page with full API URL
    const paymentUrl = `${API_BASE_URL}${ENDPOINTS.PAYMENTS.STUDENT.PAYMENT_PAGE(batchId, months)}`;
    window.location.href = paymentUrl;
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
