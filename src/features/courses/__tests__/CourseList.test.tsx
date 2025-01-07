import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseList } from '../components/CourseList';
import { renderWithProviders } from '../../../test/utils';

describe('CourseList', () => {
  it('renders loading state initially', () => {
    renderWithProviders(<CourseList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders courses after loading', async () => {
    renderWithProviders(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('Test Instructor')).toBeInTheDocument();
    });
  });

  it('filters courses by search term', async () => {
    renderWithProviders(<CourseList />);

    const searchInput = screen.getByPlaceholderText(/search courses/i);
    await userEvent.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });
  });

  it('filters courses by difficulty level', async () => {
    renderWithProviders(<CourseList />);

    const filterSelect = screen.getByLabelText(/difficulty/i);
    await userEvent.selectOptions(filterSelect, 'Beginner');

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });
  });
}); 