import { useState, useEffect, useCallback } from 'react';
import type { DeviceInfo } from '@shared/types';

const API_BASE = 'http://localhost:3173';

export function useDevices() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/devices`);
      const data = await res.json();
      if (data.success) {
        setDevices(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch devices');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      console.error('Failed to fetch devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    // 轮询设备状态
    const interval = setInterval(fetchDevices, 2000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    refreshDevices: fetchDevices,
  };
}

export async function executeCommand(deviceId: string, command: string) {
  const res = await fetch(`${API_BASE}/api/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, command }),
  });
  return res.json();
}
