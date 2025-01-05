import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            CodeSpring
          </h1>
          <p className="text-lg text-muted-foreground">
            Create a new password for your account
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
} 