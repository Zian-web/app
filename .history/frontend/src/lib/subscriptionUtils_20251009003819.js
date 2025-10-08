import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

/**
 * Check if teacher can create batches
 */
export const checkBatchCreationPermission = async () => {
  try {
    const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_BATCH_CREATION);
    return {
      allowed: response.can_create_batch || false,
      reason: response.reason || null
    };
  } catch (error) {
    console.error('Error checking batch creation permission:', error);
    return {
      allowed: false,
      reason: 'Failed to check permission'
    };
  }
};

/**
 * Check if teacher can upload materials to a specific batch
 */
export const checkMaterialUploadPermission = async (batchId) => {
  try {
    const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.CHECK_MATERIAL_UPLOAD(batchId));
    return {
      allowed: response.can_upload_materials || false,
      reason: response.reason || null
    };
  } catch (error) {
    console.error('Error checking material upload permission:', error);
    return {
      allowed: false,
      reason: 'Failed to check permission'
    };
  }
};

/**
 * Get subscription status for teacher
 */
export const getSubscriptionStatus = async () => {
  try {
    const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.STATUS_CHECK);
    return {
      subscription_active: response.subscription_active || false,
      beta_testing_enabled: response.beta_testing_enabled || false,
      materials_locked: response.materials_locked || false,
      next_payment_due: response.next_payment_due || null,
      reason: response.reason || null
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      subscription_active: false,
      beta_testing_enabled: false,
      materials_locked: true,
      next_payment_due: null,
      reason: 'Failed to check subscription status'
    };
  }
};

/**
 * Check subscription payment status
 */
export const checkSubscriptionPaymentStatus = async () => {
  try {
    const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.PAYMENT_STATUS);
    return {
      beta_testing: response.beta_testing || false,
      subscription_required: response.subscription_required || false,
      has_subscription: response.has_subscription || false,
      subscription_paid: response.subscription_paid || false,
      unpaid_count: response.unpaid_count || 0,
      message: response.message || null
    };
  } catch (error) {
    console.error('Error checking subscription payment status:', error);
    return {
      beta_testing: false,
      subscription_required: true,
      has_subscription: false,
      subscription_paid: false,
      unpaid_count: 0,
      message: 'Failed to check payment status'
    };
  }
};

/**
 * Check monthly payment status
 */
export const checkMonthlyPaymentStatus = async () => {
  try {
    const response = await api.get(ENDPOINTS.SUBSCRIPTION.TEACHER.MONTHLY_PAYMENT_STATUS);
    return {
      beta_testing: response.beta_testing || false,
      subscription_required: response.subscription_required || false,
      has_subscription: response.has_subscription || false,
      monthly_payment_overdue: response.monthly_payment_overdue || false,
      batches_locked: response.batches_locked || false,
      overdue_count: response.overdue_count || 0,
      message: response.message || null
    };
  } catch (error) {
    console.error('Error checking monthly payment status:', error);
    return {
      beta_testing: false,
      subscription_required: true,
      has_subscription: false,
      monthly_payment_overdue: false,
      batches_locked: false,
      overdue_count: 0,
      message: 'Failed to check monthly payment status'
    };
  }
};

/**
 * Handle subscription-related errors
 */
export const handleSubscriptionError = (error, action = 'perform this action') => {
  const errorMessage = error.message || error.toString();
  
  if (errorMessage.includes('Subscription required')) {
    return {
      title: 'Subscription Required',
      description: `You need an active subscription to ${action}. Please subscribe first.`,
      action: 'Subscribe Now',
      redirectTo: '/teacher/subscription'
    };
  } else if (errorMessage.includes('Materials locked')) {
    return {
      title: 'Materials Locked',
      description: 'Your materials are locked due to subscription issues. Please check your subscription status.',
      action: 'Check Subscription',
      redirectTo: '/teacher/subscription'
    };
  } else if (errorMessage.includes('Payment due')) {
    return {
      title: 'Payment Due',
      description: 'Your subscription payment is due. Please make a payment to continue.',
      action: 'Pay Now',
      redirectTo: '/teacher/subscription'
    };
  } else {
    return {
      title: 'Error',
      description: `Failed to ${action}. Please try again.`,
      action: null,
      redirectTo: null
    };
  }
};
