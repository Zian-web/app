import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const SubscriptionGuard = ({ 
  action, 
  children, 
  subscriptionStatus, 
  onSubscribe 
}) => {
  const { toast } = useToast();

  // If subscription is active, show children
  if (subscriptionStatus?.subscription_active) {
    return children;
  }

  // If beta testing is enabled, show children
  if (subscriptionStatus?.beta_testing_enabled) {
    return children;
  }

  // Show subscription required message
  const getActionMessage = () => {
    switch (action) {
      case 'create_batch':
        return 'You need an active subscription to create new batches.';
      case 'upload_material':
        return 'You need an active subscription to upload materials.';
      case 'access_materials':
        return 'You need an active subscription to access materials.';
      default:
        return 'You need an active subscription to perform this action.';
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case 'create_batch':
        return 'Create Batch';
      case 'upload_material':
        return 'Upload Material';
      case 'access_materials':
        return 'Access Materials';
      default:
        return 'Action Restricted';
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="border-orange-500 bg-orange-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>Subscription Required</strong>
              <p className="text-sm mt-1">{getActionMessage()}</p>
            </div>
            <Badge variant="destructive" className="ml-2">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Required for {getActionTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getActionTitle()} is Locked
            </h3>
            <p className="text-gray-600 mb-4">
              {getActionMessage()}
            </p>
          </div>

          {subscriptionStatus && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Current Status:</h4>
              <div className="flex items-center gap-2">
                <Badge variant={subscriptionStatus.subscription_active ? 'default' : 'destructive'}>
                  {subscriptionStatus.subscription_active ? 'Active' : 'Inactive'}
                </Badge>
                {subscriptionStatus.materials_locked && (
                  <Badge variant="destructive">
                    <Lock className="h-3 w-3 mr-1" />
                    Materials Locked
                  </Badge>
                )}
              </div>
              {subscriptionStatus.next_payment_due && (
                <p className="text-sm text-gray-600">
                  Next Payment Due: {new Date(subscriptionStatus.next_payment_due).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={onSubscribe} className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Create Subscription
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/teacher/subscription'}>
              View Subscription Details
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact support for assistance with your subscription.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionGuard;
