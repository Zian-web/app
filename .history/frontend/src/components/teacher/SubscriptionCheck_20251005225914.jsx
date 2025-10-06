import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle, Lock, Unlock } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { api } from '../../lib/api';

const SubscriptionCheck = ({ onSubscriptionRequired, onSubscriptionOk }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/teacher/subscription/status-check');
      setSubscriptionStatus(response.data);
      
      // Check if materials are locked
      if (response.data.materials_locked) {
        onSubscriptionRequired?.(response.data);
      } else {
        onSubscriptionOk?.();
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // If subscription check fails, allow batch creation but show warning
      onSubscriptionOk?.();
    } finally {
      setIsLoading(false);
    }
  };

  const unlockMaterials = async () => {
    try {
      await api.post('/api/teacher/subscription/unlock-materials');
      toast({
        title: "Success",
        description: "Materials unlocked successfully",
      });
      checkSubscriptionStatus(); // Refresh status
    } catch (error) {
      console.error('Error unlocking materials:', error);
      toast({
        title: "Error",
        description: "Failed to unlock materials",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Checking subscription status...</span>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Subscription Status Alert */}
      <Alert className={subscriptionStatus.materials_locked ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {subscriptionStatus.materials_locked ? (
            <div className="flex items-center justify-between">
              <div>
                <strong>⚠️ Subscription Required:</strong> {subscriptionStatus.lock_reason}
                {subscriptionStatus.grace_period_ends && (
                  <p className="text-sm mt-1">
                    Grace period ends: {new Date(subscriptionStatus.grace_period_ends).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button onClick={unlockMaterials} variant="outline" size="sm">
                <Unlock className="w-4 h-4 mr-2" />
                Unlock Materials
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <span>✅ Subscription active - All materials accessible</span>
            </div>
          )}
        </AlertDescription>
      </Alert>

      {/* Subscription Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Subscription Status</h4>
          <div className="flex items-center gap-2">
            {subscriptionStatus.subscription_active ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            ) : (
              <Badge variant="destructive">
                Inactive
              </Badge>
            )}
            {subscriptionStatus.materials_locked && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Materials Locked
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Next Payment</h4>
          <p className="text-sm text-gray-600">
            {subscriptionStatus.next_payment_due ? 
              new Date(subscriptionStatus.next_payment_due).toLocaleDateString() : 
              'No payment due'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheck;
