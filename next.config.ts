import os from 'os';
import type { NextConfig } from 'next';

const interfaces = os.networkInterfaces();

const localIp = Object.values(interfaces)
  .flat()
  .find((networkInterface) => {
    return networkInterface?.family === 'IPv4' && !networkInterface.internal;
  })?.address;

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true
  },

  allowedDevOrigins: localIp ? [localIp] : []
};

export default nextConfig;
