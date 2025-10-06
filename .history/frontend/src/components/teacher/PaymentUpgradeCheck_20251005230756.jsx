import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UpgradeToOnlinePayment from './UpgradeToOnlinePayment';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const PaymentUpgradeCheck = ({ children }) => {
  const { user } = useAuth();
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkPaymentStatus();
  }, [user]);

  const checkPaymentStatus = async () => {
    if (!user || user.type !== 'teacher') {
      setIsChecking(false);
      return;
    }

    try {
      // Check if teacher has online payment enabled
      const response = await api.get('/api/users/me');
      const teacherData = response.data;
      
      if (!teacherData.requires_online_payment) {
        setNeedsUpgrade(true);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      // If we can't check, assume they need upgrade
      setNeedsUpgrade(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpgradeComplete = () => {
    setNeedsUpgrade(false);
    toast({
      title: "Success",
      description: "Online payment has been enabled! You can now create batches with payment links.",
    });
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking payment setup...</p>
        </div>
      </div>
    );
  }

  if (needsUpgrade) {
    return <UpgradeToOnlinePayment onUpgradeComplete={handleUpgradeComplete} />;
  }

  return children;
};

export default PaymentUpgradeCheck;
