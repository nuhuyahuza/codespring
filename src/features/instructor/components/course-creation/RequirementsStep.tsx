import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface RequirementsStepProps {
  initialData?: {
    learningObjectives: string[];
    requirements: string[];
  };
  onSave: (data: { learningObjectives: string[]; requirements: string[] }) => void;
}

export function RequirementsStep({ initialData, onSave }: RequirementsStepProps) {
  const [objectives, setObjectives] = useState<string[]>(initialData?.learningObjectives || []);
  const [requirements, setRequirements] = useState<string[]>(initialData?.requirements || []);
  const [newObjective, setNewObjective] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  // Reset state when initialData changes
  useEffect(() => {
    if (initialData) {
      setObjectives(initialData.learningObjectives);
      setRequirements(initialData.requirements);
    }
  }, [initialData]);

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ learningObjectives: objectives, requirements });
  };

  return (
    <div className="space-y-8">
      {/* Learning Objectives */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">What students will learn</Label>
        <div className="flex gap-2">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="e.g., Build a full-stack web application"
            onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
          />
          <Button onClick={handleAddObjective} className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {objectives.map((objective, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <span>{objective}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveObjective(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Course Requirements */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Course Requirements</Label>
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="e.g., Basic JavaScript knowledge"
            onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
          />
          <Button onClick={handleAddRequirement} className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {requirements.map((requirement, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <span>{requirement}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRequirement(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
        Save Requirements
      </Button>
    </div>
  );
} 