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
      
      // Check material upload permission
      const materialUploadResponse = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_MATERIAL_UPLOAD);
      
      setPermissions({
        canCreateBatch: batchCreationResponse.allowed || false,
        canUploadMaterial: materialUploadResponse.allowed || false,
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

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    ...permissions,
    refreshPermissions: checkPermissions
  };
};
