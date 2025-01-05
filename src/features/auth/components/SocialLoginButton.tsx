import { Button } from '@/components/ui';
import { Github, Facebook, Mail } from 'lucide-react';

type Provider = 'google' | 'facebook' | 'github';

interface SocialLoginButtonProps {
  provider: Provider;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const providerIcons = {
  google: Mail,
  facebook: Facebook,
  github: Github,
};

const providerNames = {
  google: 'Google',
  facebook: 'Facebook',
  github: 'GitHub',
};

export function SocialLoginButton({
  provider,
  onClick,
  isLoading,
  className,
}: SocialLoginButtonProps) {
  const Icon = providerIcons[provider];

  return (
    <Button
      variant="outline"
      type="button"
      className={className}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin mr-2">⌛</span>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <Icon className="mr-2 h-4 w-4" />
          {providerNames[provider]}
        </span>
      )}
    </Button>
  );
} 