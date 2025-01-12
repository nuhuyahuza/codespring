import { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    toast.error('Something went wrong', {
      description: error.message || 'An unexpected error occurred',
      action: {
        label: 'Retry',
        onClick: () => window.location.reload(),
      },
      duration: 5000,
    });
  }

  public render() {
    // Reset error state after showing toast
    if (this.state.hasError) {
      this.setState({ hasError: false });
    }
    
    return this.props.children;
  }
} 