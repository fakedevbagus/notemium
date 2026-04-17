import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });

  it('starts with light theme by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('toggles to dark theme on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('toggles back to light theme on second click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
});