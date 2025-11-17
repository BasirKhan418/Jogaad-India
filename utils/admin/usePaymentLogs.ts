"use client";

import { useState, useEffect, useCallback } from "react";
import { PaymentLog } from "@/repository/admin/paymentLogs";
import { PaymentLogStats } from "@/utils/admin/paymentLogService";

export interface UsePaymentLogsResult {
  logs: PaymentLog[];
  stats: PaymentLogStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTodayPaymentLogs(): UsePaymentLogsResult {
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [stats, setStats] = useState<PaymentLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/logs/today", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment logs");
      }

      const data = await response.json();
      
      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs);
        setStats(data.stats);
      } else {
        setLogs([]);
        setStats(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLogs([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, stats, loading, error, refetch: fetchLogs };
}

export function usePaymentLogsByDate(date: string): UsePaymentLogsResult {
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [stats, setStats] = useState<PaymentLogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!date) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/logs/bydate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ date })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment logs");
      }

      const data = await response.json();
      
      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs);
        setStats(data.stats);
      } else {
        setLogs([]);
        setStats(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLogs([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, stats, loading, error, refetch: fetchLogs };
}
