import { SignUpForm } from '@/features/auth/components/SignUpForm';

export function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            CodeSpring
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our community of learners and instructors
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
} 