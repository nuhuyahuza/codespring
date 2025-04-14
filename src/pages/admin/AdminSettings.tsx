
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Server, 
  ShieldAlert, 
  Mail, 
  BellRing, 
  Globe, 
  Palette
} from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Platform Settings" 
        description="Manage global platform configurations and preferences"
      >
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </PageHeader>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input id="platform-name" defaultValue="Codespring Learning Platform" />
                </div>

                <div>
                  <Label htmlFor="platform-url">Platform URL</Label>
                  <Input id="platform-url" defaultValue="https://learn.codespring.dev" />
                </div>

                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@codespring.dev" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the platform in maintenance mode for all users
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch id="enable-registration" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-instructor-application">Instructor Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to apply to become instructors
                    </p>
                  </div>
                  <Switch id="enable-instructor-application" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure timezone and localization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="default-timezone">Default Timezone</Label>
                <select 
                  id="default-timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="America/New_York"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="default-language">Default Language</Label>
                <select 
                  id="default-language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="en-US"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              <div>
                <Label htmlFor="date-format">Date Format</Label>
                <select 
                  id="date-format"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="MM/DD/YYYY"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MMMM D, YYYY">MMMM D, YYYY</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch id="two-factor-auth" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="strong-passwords">Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Require strong passwords for all users
                    </p>
                  </div>
                  <Switch id="strong-passwords" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-logout">Automatic Logout</Label>
                    <p className="text-sm text-muted-foreground">
                      Log users out after period of inactivity
                    </p>
                  </div>
                  <Switch id="auto-logout" defaultChecked />
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="allowed-ip-ranges">Allowed IP Ranges (Admin Access)</Label>
                  <Input id="allowed-ip-ranges" placeholder="e.g. 192.168.1.0/24, 10.0.0.0/8" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to allow all IPs. Separate multiple ranges with commas.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="content-security">Content Security Policy</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable strict content security policy
                    </p>
                  </div>
                  <Switch id="content-security" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email providers and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>
              
              <div>
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" type="number" />
              </div>
              
              <div>
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input id="smtp-username" placeholder="user@example.com" />
              </div>
              
              <div>
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smtp-secure">Use Secure Connection (TLS)</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable TLS for secure email delivery
                  </p>
                </div>
                <Switch id="smtp-secure" defaultChecked />
              </div>

              <div>
                <Label htmlFor="email-from">From Email Address</Label>
                <Input id="email-from" placeholder="noreply@codespring.dev" />
              </div>

              <div>
                <Label htmlFor="email-from-name">From Name</Label>
                <Input id="email-from-name" placeholder="Codespring Learning" />
              </div>
              
              <Button className="mt-2" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Admin Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-new-users">New User Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new users register
                    </p>
                  </div>
                  <Switch id="notify-new-users" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-instructor-requests">Instructor Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when users apply to become instructors
                    </p>
                  </div>
                  <Switch id="notify-instructor-requests" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-payments">Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on payment events (successful, failed)
                    </p>
                  </div>
                  <Switch id="notify-payments" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">System Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-errors">System Errors</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on critical system errors
                    </p>
                  </div>
                  <Switch id="notify-errors" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-logins">Admin Login Attempts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on failed admin login attempts
                    </p>
                  </div>
                  <Switch id="notify-logins" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize platform appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Platform Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-16 w-16 rounded border flex items-center justify-center bg-muted">
                      <span className="text-2xl font-bold">C</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="favicon-upload">Favicon</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-8 w-8 rounded border flex items-center justify-center bg-muted">
                      <span className="text-xs font-bold">C</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input id="primary-color" defaultValue="#0099ff" className="w-32" />
                    <div className="h-10 w-10 rounded-md" style={{ backgroundColor: "#0099ff" }}></div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input id="secondary-color" defaultValue="#6c757d" className="w-32" />
                    <div className="h-10 w-10 rounded-md" style={{ backgroundColor: "#6c757d" }}></div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input id="accent-color" defaultValue="#ff9900" className="w-32" />
                    <div className="h-10 w-10 rounded-md" style={{ backgroundColor: "#ff9900" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-party Integrations</CardTitle>
              <CardDescription>Connect external services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Payment Gateway</Label>
                      <p className="text-sm text-muted-foreground">
                        Configure payment processing
                      </p>
                    </div>
                    <Switch id="payments-enabled" defaultChecked />
                  </div>
                  
                  <div className="mt-4 space-y-4 pl-6 border-l-2 border-muted">
                    <div>
                      <Label htmlFor="payment-provider">Provider</Label>
                      <select 
                        id="payment-provider"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="stripe"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="square">Square</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" type="password" placeholder="••••••••" />
                    </div>
                    
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" defaultValue="https://learn.codespring.dev/api/payments/webhook" readOnly />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use this URL in your payment provider's dashboard to configure webhooks
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Video Conferencing</Label>
                      <p className="text-sm text-muted-foreground">
                        Configure live class video provider
                      </p>
                    </div>
                    <Switch id="video-enabled" defaultChecked />
                  </div>
                  
                  <div className="mt-4 space-y-4 pl-6 border-l-2 border-muted">
                    <div>
                      <Label htmlFor="video-provider">Provider</Label>
                      <select 
                        id="video-provider"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="zoom"
                      >
                        <option value="zoom">Zoom</option>
                        <option value="meet">Google Meet</option>
                        <option value="teams">Microsoft Teams</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="video-api-key">API Key</Label>
                      <Input id="video-api-key" type="password" placeholder="••••••••" />
                    </div>
                    
                    <div>
                      <Label htmlFor="video-secret">API Secret</Label>
                      <Input id="video-secret" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>System-level configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed error logging
                    </p>
                  </div>
                  <Switch id="debug-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="caching">Response Caching</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable API response caching
                    </p>
                  </div>
                  <Switch id="caching" defaultChecked />
                </div>
                
                <div>
                  <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                  <Input id="cache-ttl" type="number" defaultValue="3600" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backup-frequency">Database Backup Frequency</Label>
                  <select 
                    id="backup-frequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="daily"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
                
                <Button variant="outline" className="flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  Trigger Manual Backup
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button variant="destructive" className="flex items-center">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Reset Platform to Default Settings
                </Button>
                <p className="text-xs text-muted-foreground">
                  This will reset all platform settings to their default values. This action cannot be undone.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
