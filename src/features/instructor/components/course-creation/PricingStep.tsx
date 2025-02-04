import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

const formSchema = z.object({
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  isLiveEnabled: z.boolean().default(false),
  hasCertification: z.boolean().default(false),
  certificationPrice: z.coerce.number().min(0).optional(),
  liveSessionDetails: z.object({
    maxStudents: z.coerce.number().min(1, 'Must allow at least 1 student'),
    sessionDuration: z.coerce.number().min(15, 'Session must be at least 15 minutes'),
    scheduleType: z.enum(['WEEKLY', 'BI_WEEKLY', 'MONTHLY']),
  }).optional(),
});

interface PricingStepProps {
  initialData?: z.infer<typeof formSchema>;
  onSave: (data: z.infer<typeof formSchema>) => void;
}

export function PricingStep({ initialData, onSave }: PricingStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      price: 0,
      status: 'DRAFT',
      isLiveEnabled: false,
      hasCertification: false,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const isLiveEnabled = form.watch('isLiveEnabled');
  const hasCertification = form.watch('hasCertification');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Price ($)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasCertification"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Certification
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable certification for course completion
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {hasCertification && (
          <FormField
            control={form.control}
            name="certificationPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="isLiveEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Live Sessions
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable live sessions for this course
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isLiveEnabled && (
          <Card className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="liveSessionDetails.maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Students per Session</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveSessionDetails.sessionDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min="15" step="15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="liveSessionDetails.scheduleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="BI_WEEKLY">Bi-Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        )}

        <Button type="submit" className="w-full">
          Save and Continue
        </Button>
      </form>
    </Form>
  );
} 