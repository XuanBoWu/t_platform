import { useEffect } from 'react';
import { useAppStore } from '../store';
import { ApiService } from '../services/api';

export const useDevices = () => {
  const { devices, selectedDevice, setDevices, setSelectedDevice } = useAppStore();

  // 获取设备列表
  const fetchDevices = async () => {
    const deviceList = await ApiService.getDevices();
    setDevices(deviceList);

    // 如果当前没有选中的设备，且有设备可用，选中第一个
    if (!selectedDevice && deviceList.length > 0) {
      const connectedDevice = deviceList.find((d) => d.state === 'connected');
      if (connectedDevice) {
        setSelectedDevice(connectedDevice.id);
      }
    }
  };

  // 定期刷新设备列表
  useEffect(() => {
    // 初始加载
    fetchDevices();

    // 每3秒刷新一次
    const interval = setInterval(fetchDevices, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    devices,
    selectedDevice,
    fetchDevices,
    refreshDevices: fetchDevices,
  };
};
