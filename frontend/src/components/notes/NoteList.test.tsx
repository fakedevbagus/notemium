import { render, screen, fireEvent } from '@testing-library/react';
import NoteList from './NoteList';

describe('NoteList', () => {
  const notes = [
    { id: 1, title: 'Note 1', content: 'Content 1' },
    { id: 2, title: 'Note 2', content: 'Content 2' },
  ];

  it('renders notes', () => {
    render(<NoteList notes={notes} onSelect={() => {}} selectedId={null} />);
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('calls onSelect when a note is clicked', () => {
    const onSelect = jest.fn();
    render(<NoteList notes={notes} onSelect={onSelect} selectedId={null} />);
    fireEvent.click(screen.getByText('Note 2'));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
