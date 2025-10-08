import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  CreditCard, 
  Calendar,
  ExternalLink,
  Clock
} from 'lucide-react';
import { getSubscriptionStatus, checkSubscriptionPaymentStatus, checkMonthlyPaymentStatus } from '../../lib/subscriptionUtils';

const SubscriptionStatusBanner = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!subscriptionStatus) {
    return null;
  }

  // If subscription is active and not in beta, don't show banner
  if (subscriptionStatus.subscription_active && !subscriptionStatus.beta_testing_enabled) {
    return null;
  }

  // If beta testing is enabled, show success banner
  if (subscriptionStatus.beta_testing_enabled) {
    return (
      <Alert className="border-green-500 bg-green-50 mb-4">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-green-800">Beta Testing Mode Active</strong>
              <p className="text-sm text-green-700 mt-1">
                You're currently in beta testing mode. All features are free!
              </p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-800">
              FREE ACCESS
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // If materials are locked, show critical warning
  if (subscriptionStatus.materials_locked) {
    return (
      <Alert className="border-red-500 bg-red-50 mb-4">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-red-800">Materials Locked</strong>
              <p className="text-sm text-red-700 mt-1">
                Your materials are locked due to subscription issues. Please check your subscription status.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive">
                <Lock className="h-3 w-3 mr-1" />
                LOCKED
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.href = '/teacher/dashboard?tab=subscription'}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Check Subscription
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // If subscription is required, show warning
  if (!subscriptionStatus.subscription_active) {
    return (
      <Alert className="border-orange-500 bg-orange-50 mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-orange-800">Subscription Required</strong>
              <p className="text-sm text-orange-700 mt-1">
                You need an active subscription to create batches and upload materials.
              </p>
              {subscriptionStatus.next_payment_due && (
                <p className="text-xs text-orange-600 mt-1">
                  Next payment due: {new Date(subscriptionStatus.next_payment_due).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                REQUIRED
              </Badge>
              <Button 
                size="sm" 
                onClick={() => window.location.href = '/teacher/dashboard?tab=subscription'}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Subscribe Now
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default SubscriptionStatusBanner;
