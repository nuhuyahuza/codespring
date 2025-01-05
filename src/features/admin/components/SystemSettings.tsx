import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Mail,
  Bell,
  Shield,
  CreditCard,
  FileText,
  Save,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSystemSettings } from '@/hooks/useSystemSettings';

interface SystemConfig {
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
}

const defaultConfig: SystemConfig = {
  general: {
    siteName: 'CodeSpring',
    siteDescription: 'Online Learning Platform',
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'STUDENT',
  },
  email: {
    provider: 'SMTP',
    fromEmail: 'noreply@codespring.com',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'smtp-user',
    smtpPassword: '********',
  },
  notifications: {
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: false,
    defaultNotificationTypes: [
      'course_updates',
      'assignments',
      'messages',
      'announcements',
    ],
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordReset: 90,
    twoFactorAuth: false,
  },
  payment: {
    currency: 'USD',
    stripeEnabled: true,
    paypalEnabled: false,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
  },
  storage: {
    provider: 'S3',
    maxFileSize: 50,
    allowedFileTypes: ['image/*', 'video/*', 'application/pdf'],
    s3Bucket: 'codespring-uploads',
    s3Region: 'us-east-1',
    s3AccessKey: 'AKIA...',
    s3SecretKey: '********',
  },
};

export function SystemSettings() {
  const { settings, isLoading, updateSettings } = useSystemSettings();
  const [config, setConfig] = useState(settings || defaultConfig);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setConfig(settings);
    }
  }, [settings]);

  const handleSaveConfig = async () => {
    try {
      setIsSubmitting(true);
      await updateSettings(config);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>
        <Button onClick={handleSaveConfig} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Storage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic platform configuration settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Site Name</Label>
                  <Input
                    value={config.general.siteName}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        general: {
                          ...config.general,
                          siteName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Site Description</Label>
                  <Input
                    value={config.general.siteDescription}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        general: {
                          ...config.general,
                          siteDescription: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to prevent user access
                    </p>
                  </div>
                  <Switch
                    checked={config.general.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        general: {
                          ...config.general,
                          maintenanceMode: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch
                    checked={config.general.allowRegistration}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        general: {
                          ...config.general,
                          allowRegistration: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default User Role</Label>
                  <Select
                    value={config.general.defaultUserRole}
                    onValueChange={(value: 'STUDENT' | 'INSTRUCTOR') =>
                      setConfig({
                        ...config,
                        general: {
                          ...config.general,
                          defaultUserRole: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email service settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Email Provider</Label>
                  <Select
                    value={config.email.provider}
                    onValueChange={(value: 'SMTP' | 'SES' | 'SENDGRID') =>
                      setConfig({
                        ...config,
                        email: {
                          ...config.email,
                          provider: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMTP">SMTP</SelectItem>
                      <SelectItem value="SES">Amazon SES</SelectItem>
                      <SelectItem value="SENDGRID">SendGrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>From Email</Label>
                  <Input
                    type="email"
                    value={config.email.fromEmail}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        email: {
                          ...config.email,
                          fromEmail: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                {config.email.provider === 'SMTP' && (
                  <>
                    <div className="grid gap-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={config.email.smtpHost}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            email: {
                              ...config.email,
                              smtpHost: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={config.email.smtpPort}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            email: {
                              ...config.email,
                              smtpPort: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP Username</Label>
                      <Input
                        value={config.email.smtpUsername}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            email: {
                              ...config.email,
                              smtpUsername: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP Password</Label>
                      <Input
                        type="password"
                        value={config.email.smtpPassword}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            email: {
                              ...config.email,
                              smtpPassword: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {(config.email.provider === 'SES' ||
                  config.email.provider === 'SENDGRID') && (
                  <div className="grid gap-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={config.email.apiKey}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          email: {
                            ...config.email,
                            apiKey: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable email notifications
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        notifications: {
                          ...config.notifications,
                          enableEmailNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.enablePushNotifications}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        notifications: {
                          ...config.notifications,
                          enablePushNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable SMS notifications
                    </p>
                  </div>
                  <Switch
                    checked={config.notifications.enableSMSNotifications}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        notifications: {
                          ...config.notifications,
                          enableSMSNotifications: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        security: {
                          ...config.security,
                          sessionTimeout: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Maximum Login Attempts</Label>
                  <Input
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        security: {
                          ...config.security,
                          maxLoginAttempts: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Minimum Password Length</Label>
                  <Input
                    type="number"
                    value={config.security.passwordMinLength}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        security: {
                          ...config.security,
                          passwordMinLength: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Password Reset Period (days)</Label>
                  <Input
                    type="number"
                    value={config.security.requirePasswordReset}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        security: {
                          ...config.security,
                          requirePasswordReset: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch
                    checked={config.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        security: {
                          ...config.security,
                          twoFactorAuth: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Currency</Label>
                  <Select
                    value={config.payment.currency}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        payment: {
                          ...config.payment,
                          currency: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Stripe</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable Stripe payments
                      </p>
                    </div>
                    <Switch
                      checked={config.payment.stripeEnabled}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          payment: {
                            ...config.payment,
                            stripeEnabled: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.payment.stripeEnabled && (
                    <>
                      <div className="grid gap-2">
                        <Label>Stripe Public Key</Label>
                        <Input
                          value={config.payment.stripePublicKey}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              payment: {
                                ...config.payment,
                                stripePublicKey: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Stripe Secret Key</Label>
                        <Input
                          type="password"
                          value={config.payment.stripeSecretKey}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              payment: {
                                ...config.payment,
                                stripeSecretKey: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PayPal</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable PayPal payments
                      </p>
                    </div>
                    <Switch
                      checked={config.payment.paypalEnabled}
                      onCheckedChange={(checked) =>
                        setConfig({
                          ...config,
                          payment: {
                            ...config.payment,
                            paypalEnabled: checked,
                          },
                        })
                      }
                    />
                  </div>

                  {config.payment.paypalEnabled && (
                    <>
                      <div className="grid gap-2">
                        <Label>PayPal Client ID</Label>
                        <Input
                          value={config.payment.paypalClientId}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              payment: {
                                ...config.payment,
                                paypalClientId: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>PayPal Secret Key</Label>
                        <Input
                          type="password"
                          value={config.payment.paypalSecretKey}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              payment: {
                                ...config.payment,
                                paypalSecretKey: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure file storage settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Storage Provider</Label>
                  <Select
                    value={config.storage.provider}
                    onValueChange={(value: 'LOCAL' | 'S3' | 'CLOUDINARY') =>
                      setConfig({
                        ...config,
                        storage: {
                          ...config.storage,
                          provider: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOCAL">Local Storage</SelectItem>
                      <SelectItem value="S3">Amazon S3</SelectItem>
                      <SelectItem value="CLOUDINARY">Cloudinary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Maximum File Size (MB)</Label>
                  <Input
                    type="number"
                    value={config.storage.maxFileSize}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        storage: {
                          ...config.storage,
                          maxFileSize: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                {config.storage.provider === 'S3' && (
                  <>
                    <div className="grid gap-2">
                      <Label>S3 Bucket</Label>
                      <Input
                        value={config.storage.s3Bucket}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storage: {
                              ...config.storage,
                              s3Bucket: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>S3 Region</Label>
                      <Input
                        value={config.storage.s3Region}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storage: {
                              ...config.storage,
                              s3Region: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>S3 Access Key</Label>
                      <Input
                        value={config.storage.s3AccessKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storage: {
                              ...config.storage,
                              s3AccessKey: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>S3 Secret Key</Label>
                      <Input
                        type="password"
                        value={config.storage.s3SecretKey}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            storage: {
                              ...config.storage,
                              s3SecretKey: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 