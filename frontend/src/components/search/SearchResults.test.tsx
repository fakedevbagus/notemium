import { render, screen } from '@testing-library/react';
import SearchResults from './SearchResults';

describe('SearchResults', () => {
  const mockResults = [
    { id: 1, type: 'note', title: 'First Note', snippet: 'This is your first note.' },
    { id: 2, type: 'folder', title: 'Work', snippet: '' },
  ];

  it('renders results list', () => {
    render(<SearchResults results={mockResults} />);
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('(note)')).toBeInTheDocument();
    expect(screen.getByText('This is your first note.')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('(folder)')).toBeInTheDocument();
  });

  it('renders no results message when empty', () => {
    render(<SearchResults results={[]} />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('does not render snippet for folders', () => {
    render(<SearchResults results={mockResults} />);
    const folderItem = screen.getByText('Work').closest('li');
    expect(folderItem).not.toHaveTextContent('This is your first note.'); // Ensure folder doesn't have note's snippet
    // The folder li should only have the title and type, no snippet div
    expect(folderItem?.querySelector('.text-sm')).toBeNull();
  });
});