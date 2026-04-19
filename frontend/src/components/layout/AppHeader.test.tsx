import { render, screen } from '@testing-library/react';
import AppHeader from './AppHeader';

describe('AppHeader', () => {
  it('renders app title', () => {
    render(<AppHeader />);
    expect(screen.getByText('Notemium')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<AppHeader />);
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
  });
});