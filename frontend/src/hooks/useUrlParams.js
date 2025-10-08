import { useEffect } from 'react';
import { useToast } from './use-toast';

/**
 * Custom hook to handle URL parameters for batch creation success/error messages
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoCleanup - Whether to automatically clean up URL parameters (default: true)
 * @param {Function} options.onSuccess - Callback function for success cases
 * @param {Function} options.onError - Callback function for error cases
 * @param {Function} options.onRefresh - Callback function to refresh data after success
 */
export const useUrlParams = ({ 
  autoCleanup = true, 
  onSuccess, 
  onError, 
  onRefresh 
} = {}) => {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for batch creation success/error messages
    const batchCreated = urlParams.get('batch_created');
    const batchId = urlParams.get('batch_id');
    const batchName = urlParams.get('batch_name');
    const message = urlParams.get('message');
    const error = urlParams.get('error');

    if (batchCreated === 'true') {
      const successMessage = message || 'Your batch has been created successfully.';
      const batchInfo = batchName ? `Batch: ${batchName}` : '';
      const idInfo = batchId ? `(ID: ${batchId})` : '';
      
      toast({
        title: "Batch Created Successfully!",
        description: `${successMessage} ${batchInfo} ${idInfo}`.trim(),
        variant: "default"
      });
      
      // Call custom success callback if provided
      if (onSuccess) {
        onSuccess({ batchId, batchName, message });
      }
      
      // Call refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
      
      // Clean up URL parameters
      if (autoCleanup) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('batch_created');
        newUrl.searchParams.delete('batch_id');
        newUrl.searchParams.delete('batch_name');
        newUrl.searchParams.delete('message');
        window.history.replaceState({}, '', newUrl);
      }
      
    } else if (error) {
      toast({
        title: "Batch Creation Failed",
        description: error,
        variant: "destructive"
      });
      
      // Call custom error callback if provided
      if (onError) {
        onError({ error });
      }
      
      // Clean up URL parameters
      if (autoCleanup) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('error');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [toast, autoCleanup, onSuccess, onError, onRefresh]);
};

/**
 * Custom hook specifically for batch creation success messages
 * @param {Function} onRefresh - Callback function to refresh data after success
 */
export const useBatchCreationMessages = (onRefresh) => {
  return useUrlParams({
    onSuccess: ({ batchId, batchName }) => {
      console.log(`Batch created successfully: ${batchName} (ID: ${batchId})`);
    },
    onError: ({ error }) => {
      console.error('Batch creation failed:', error);
    },
    onRefresh
  });
};

/**
 * Custom hook for student batch join messages
 * @param {Function} onRefresh - Callback function to refresh data after success
 */
export const useBatchJoinMessages = (onRefresh) => {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const batchJoined = urlParams.get('batch_joined');
    const batchId = urlParams.get('batch_id');
    const batchName = urlParams.get('batch_name');
    const message = urlParams.get('message');
    const error = urlParams.get('error');

    if (batchJoined === 'true') {
      const successMessage = message || 'You have successfully joined the batch.';
      const batchInfo = batchName ? `Batch: ${batchName}` : '';
      const idInfo = batchId ? `(ID: ${batchId})` : '';
      
      toast({
        title: "Batch Joined Successfully!",
        description: `${successMessage} ${batchInfo} ${idInfo}`.trim(),
        variant: "default"
      });
      
      if (onRefresh) {
        onRefresh();
      }
      
      // Clean up URL parameters
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('batch_joined');
      newUrl.searchParams.delete('batch_id');
      newUrl.searchParams.delete('batch_name');
      newUrl.searchParams.delete('message');
      window.history.replaceState({}, '', newUrl);
      
    } else if (error) {
      toast({
        title: "Batch Join Failed",
        description: error,
        variant: "destructive"
      });
      
      // Clean up URL parameters
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl);
    }
  }, [toast, onRefresh]);
};
