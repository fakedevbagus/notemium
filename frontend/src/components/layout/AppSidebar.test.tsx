import { render, screen } from '@testing-library/react';
import AppSidebar from './AppSidebar';

describe('AppSidebar', () => {
  const pathname = '/notes';

  it('renders all navigation links', () => {
    render(<AppSidebar pathname={pathname} />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Folders')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active link', () => {
    render(<AppSidebar pathname={pathname} />);
    const notesLink = screen.getByText('Notes');
    expect(notesLink).toHaveClass('bg-blue-600');
  });
});