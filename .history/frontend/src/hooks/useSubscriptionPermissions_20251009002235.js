import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ENDPOINTS } from '../config/endpoints';

export const useSubscriptionPermissions = () => {
  const [permissions, setPermissions] = useState({
    canCreateBatch: false,
    canUploadMaterial: false,
    hasActiveSubscription: false,
    subscriptionStatus: null,
    loading: true,
    error: null
  });

  const checkPermissions = async () => {
    try {
      setPermissions(prev => ({ ...prev, loading: true, error: null }));
      
      // Check subscription status
      const statusResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.STATUS_CHECK);
      
      // Check batch creation permission
      const batchCreationResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_BATCH_CREATION);
      
      setPermissions({
        canCreateBatch: batchCreationResponse.can_create_batch || false,
        canUploadMaterial: true, // Will be checked per batch
        hasActiveSubscription: statusResponse.subscription_active || false,
        subscriptionStatus: statusResponse,
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
    refreshPermissions: checkPermissions
  };
};
