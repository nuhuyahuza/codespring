import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LoginForm } from '../components/LoginForm';
import { vi } from 'vitest';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth Flow', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockNavigate.mockReset();
    localStorage.clear();
  });

  it('should show loading state initially', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle successful login for existing user', async () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'STUDENT', onboardingCompleted: true };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'fake-token', user: mockUser }),
      });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should redirect to onboarding for new student', async () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'STUDENT', onboardingCompleted: false };
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'fake-token', user: mockUser }),
      });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/onboarding', { replace: true });
    });
  });

  it('should handle login errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
}); 