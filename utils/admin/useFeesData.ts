import { useState, useEffect, useCallback } from 'react';
import { fetchFees, createFees, updateFees, FeesData, FeesResponse } from './feesService';
import { toast } from 'sonner';

export const useFeesData = () => {
  const [feesData, setFeesData] = useState<FeesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fees data
  const loadFees = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFees(signal);

      if (result.success && result.data) {
        setFeesData(result.data);
      } else {
        // No fees exist yet, which is okay
        setFeesData(null);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError('Failed to load fees');
        console.error('Error loading fees:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Create or update fees
  const saveFees = useCallback(
    async (userFee: number, employeeFee: number): Promise<boolean> => {
      try {
        setSaving(true);
        setError(null);

        let result: FeesResponse;

        if (feesData && feesData._id) {
          // Update existing fees
          result = await updateFees(feesData._id, {
            userOneTimeFee: userFee,
            employeeOneTimeFee: employeeFee,
          });
        } else {
          // Create new fees
          result = await createFees({
            userOneTimeFee: userFee,
            employeeOneTimeFee: employeeFee,
          });
        }

        if (result.success) {
          toast.success(result.message || 'Fees saved successfully');
          // Update local state with the new data
          if (result.fees || result.data) {
            setFeesData(result.fees || result.data || null);
          }
          return true;
        } else {
          toast.error(result.message || 'Failed to save fees');
          return false;
        }
      } catch (error) {
        console.error('Error saving fees:', error);
        toast.error('An error occurred while saving fees');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [feesData]
  );

  // Refetch fees data
  const refetch = useCallback(() => {
    const controller = new AbortController();
    loadFees(controller.signal);
    return () => controller.abort();
  }, [loadFees]);

  // Initial load
  useEffect(() => {
    const controller = new AbortController();
    loadFees(controller.signal);
    return () => controller.abort();
  }, [loadFees]);

  return {
    feesData,
    loading,
    saving,
    error,
    saveFees,
    refetch,
  };
};
