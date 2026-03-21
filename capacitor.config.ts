import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ai.youtube',
  appName: 'AI YouTube Studio',
  webDir: 'dist',
  server: {
    url: "https://f501f4a7-a9b1-4ddf-9ef1-7bdc77879bfc.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
};

export default config;
