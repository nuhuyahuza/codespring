import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface SystemSettings {
  id: number;
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    defaultUserRole: 'STUDENT' | 'INSTRUCTOR';
  };
  email: {
    provider: 'SMTP' | 'SES' | 'SENDGRID';
    fromEmail: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUsername?: string;
    smtpPassword?: string;
    apiKey?: string;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enablePushNotifications: boolean;
    enableSMSNotifications: boolean;
    defaultNotificationTypes: string[];
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requirePasswordReset: number;
    twoFactorAuth: boolean;
  };
  payment: {
    currency: string;
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    stripePublicKey?: string;
    stripeSecretKey?: string;
    paypalClientId?: string;
    paypalSecretKey?: string;
  };
  storage: {
    provider: 'LOCAL' | 'S3' | 'CLOUDINARY';
    maxFileSize: number;
    allowedFileTypes: string[];
    s3Bucket?: string;
    s3Region?: string;
    s3AccessKey?: string;
    s3SecretKey?: string;
  };
  updatedAt: string;
  createdAt: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to fetch system settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setError(null);
      toast.success('Settings updated successfully');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to update system settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  };
} 