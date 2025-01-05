import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  roles: ('STUDENT' | 'INSTRUCTOR' | 'ADMIN')[];
  config?: Record<string, any>;
}

const defaultFeatures: Feature[] = [
  {
    id: 'live-sessions',
    name: 'Live Sessions',
    description: 'Enable live video sessions between instructors and students',
    enabled: true,
    roles: ['INSTRUCTOR', 'STUDENT'],
    config: {
      maxParticipants: 50,
      recordingSetting: 'optional',
    },
  },
  {
    id: 'chat',
    name: 'Chat System',
    description: 'In-platform messaging and chat functionality',
    enabled: true,
    roles: ['INSTRUCTOR', 'STUDENT', 'ADMIN'],
  },
  {
    id: 'certificates',
    name: 'Course Certificates',
    description: 'Generate certificates upon course completion',
    enabled: true,
    roles: ['STUDENT'],
    config: {
      template: 'default',
      autoIssue: true,
    },
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Detailed analytics and reporting tools',
    enabled: true,
    roles: ['INSTRUCTOR', 'ADMIN'],
  },
];

export function FeatureControls() {
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState<Partial<Feature>>({
    roles: [],
  });

  const handleToggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const handleUpdateRoles = (featureId: string, role: string) => {
    setFeatures((prev) =>
      prev.map((feature) => {
        if (feature.id === featureId) {
          const roles = feature.roles.includes(role as any)
            ? feature.roles.filter((r) => r !== role)
            : [...feature.roles, role as any];
          return { ...feature, roles };
        }
        return feature;
      })
    );
  };

  const handleSaveFeatures = async () => {
    try {
      setIsSubmitting(true);
      // API call to save features
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success('Features updated successfully');
    } catch (error) {
      toast.error('Failed to update features');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.name || !newFeature.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = newFeature.name.toLowerCase().replace(/\s+/g, '-');
    setFeatures((prev) => [
      ...prev,
      {
        id,
        name: newFeature.name,
        description: newFeature.description,
        enabled: true,
        roles: newFeature.roles as any[],
      },
    ]);
    setNewFeature({ roles: [] });
    toast.success('Feature added successfully');
  };

  const handleDeleteFeature = (featureId: string) => {
    setFeatures((prev) => prev.filter((feature) => feature.id !== featureId));
    toast.success('Feature deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feature Controls</h2>
          <p className="text-muted-foreground">
            Manage platform features and permissions
          </p>
        </div>
        <Button onClick={handleSaveFeatures} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Feature</CardTitle>
          <CardDescription>Create a new platform feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input
                id="name"
                value={newFeature.name || ''}
                onChange={(e) =>
                  setNewFeature((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter feature name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newFeature.description || ''}
                onChange={(e) =>
                  setNewFeature((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter feature description"
              />
            </div>
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="flex gap-2">
                {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map((role) => (
                  <Button
                    key={role}
                    variant={
                      newFeature.roles?.includes(role as any)
                        ? 'secondary'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setNewFeature((prev) => ({
                        ...prev,
                        roles: prev.roles?.includes(role as any)
                          ? prev.roles.filter((r) => r !== role)
                          : [...(prev.roles || []), role],
                      }))
                    }
                  >
                    {role.toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddFeature}
              className="w-full"
              variant="secondary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {feature.name}
                    <Badge
                      variant={feature.enabled ? 'default' : 'secondary'}
                    >
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => handleToggleFeature(feature.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFeature(feature.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Roles</Label>
                  <div className="flex gap-2 mt-2">
                    {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map((role) => (
                      <Button
                        key={role}
                        variant={
                          feature.roles.includes(role as any)
                            ? 'secondary'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => handleUpdateRoles(feature.id, role)}
                      >
                        {role.toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {feature.config && (
                  <div className="space-y-2">
                    <Label>Configuration</Label>
                    <div className="grid gap-4 mt-2">
                      {Object.entries(feature.config).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Label className="min-w-[150px] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Label>
                          {typeof value === 'boolean' ? (
                            <Switch checked={value} />
                          ) : typeof value === 'number' ? (
                            <Input
                              type="number"
                              value={value}
                              className="max-w-[200px]"
                            />
                          ) : (
                            <Select defaultValue={value}>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                                <SelectItem value="optional">Optional</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 