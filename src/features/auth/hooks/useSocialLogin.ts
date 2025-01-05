import { useState } from 'react';

type Provider = 'google' | 'facebook' | 'github';

interface SocialLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function useSocialLogin() {
  const [isLoading, setIsLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setIsLoading(provider);
      setError(null);

      // Open the OAuth provider's login page in a popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        `/api/auth/${provider}`,
        `${provider}Login`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Failed to open login popup. Please disable your popup blocker and try again.');
      }

      // Listen for messages from the popup
      const response: SocialLoginResponse = await new Promise((resolve, reject) => {
        window.addEventListener('message', function handler(event) {
          // Verify the origin of the message
          if (event.origin !== window.location.origin) return;

          if (event.data.error) {
            reject(new Error(event.data.error));
          } else if (event.data.token) {
            resolve(event.data);
          }

          // Clean up
          window.removeEventListener('message', handler);
          popup.close();
        });

        // Check if popup was closed before completing
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Login window was closed'));
          }
        }, 1000);
      });

      // Store the token
      localStorage.setItem('token', response.token);

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(null);
    }
  };

  return {
    handleSocialLogin,
    isLoading,
    error,
  };
} 