import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ENDPOINTS } from '../config/endpoints';
import { checkSubscriptionPaymentStatus, checkMonthlyPaymentStatus } from '../lib/subscriptionUtils';

export const useSubscriptionPermissions = () => {
  const [permissions, setPermissions] = useState({
    canCreateBatch: false,
    canUploadMaterial: false,
    hasActiveSubscription: false,
    subscriptionStatus: null,
    paymentStatus: null,
    monthlyPaymentStatus: null,
    requiresPayment: false,
    loading: true,
    error: null
  });

  const checkPermissions = async () => {
    try {
      setPermissions(prev => ({ ...prev, loading: true, error: null }));
      
      // Check subscription status
      const statusResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.STATUS_CHECK);
      
      // Check payment status
      const paymentStatus = await checkSubscriptionPaymentStatus();
      
      // Check monthly payment status
      const monthlyPaymentStatus = await checkMonthlyPaymentStatus();
      
      // Check batch creation permission
      const batchCreationResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_BATCH_CREATION);
      
      // Determine permissions based on payment status
      let canCreateBatch = false;
      let canUploadMaterial = false;
      
      if (paymentStatus.beta_testing) {
        // Beta testing mode - allow everything
        canCreateBatch = true;
        canUploadMaterial = true;
      } else if (paymentStatus.subscription_paid && !monthlyPaymentStatus.batches_locked) {
        // Subscription paid and no batches locked
        canCreateBatch = batchCreationResponse.can_create_batch || false;
        canUploadMaterial = true;
      } else if (monthlyPaymentStatus.overdue_grace_count > 0) {
        // Within grace period - allow but show warning
        canCreateBatch = batchCreationResponse.can_create_batch || false;
        canUploadMaterial = true;
      }
      
      setPermissions({
        canCreateBatch,
        canUploadMaterial,
        hasActiveSubscription: statusResponse.subscription_active || false,
        subscriptionStatus: statusResponse,
        paymentStatus,
        monthlyPaymentStatus,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Error checking subscription permissions:', error);
      setPermissions(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to check subscription permissions'
      }));
    }
  };

  const checkMaterialUploadPermission = async (batchId) => {
    try {
      const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_MATERIAL_UPLOAD(batchId));
      return response.can_upload_materials || false;
    } catch (error) {
      console.error('Error checking material upload permission:', error);
      return false;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    ...permissions,
    refreshPermissions: checkPermissions,
    checkMaterialUploadPermission
  };
};
