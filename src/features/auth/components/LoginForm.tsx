import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { SocialLoginButton } from './SocialLoginButton';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user, isAuthenticated } = useAuth();

  // Handle initial auth state
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // Check if user needs onboarding
      if (user.role === 'STUDENT' && !user.hasCompletedOnboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate, location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;
    
    try {
      setError(null);
      setIsSubmitting(true);
      const userData = await login(data.email, data.password);
      
      // Show success message
      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting...",
      });

      // Navigation is handled by useEffect
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err instanceof Error ? err.message : 'Invalid credentials',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading || isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">
          {isSubmitting ? "Signing in..." : "Loading..."}
        </p>
      </div>
    );
  }

  // Already authenticated
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Social Login Buttons */}
      <div className="grid gap-4">
        <SocialLoginButton
          provider="google"
          onClick={() => console.log('Google login')}
          className="w-full"
        />
        <SocialLoginButton
          provider="facebook"
          onClick={() => console.log('Facebook login')}
          className="w-full"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </div>
  );
} 