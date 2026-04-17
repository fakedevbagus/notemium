import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteEditor from './NoteEditor';
import { useNotesStore } from '../../store/notesStore';

// Mock the store
jest.mock('../../store/notesStore', () => ({
  useNotesStore: jest.fn(),
}));

const mockUpdateNote = jest.fn();
const mockDeleteNote = jest.fn();

(useNotesStore as jest.Mock).mockReturnValue({
  updateNote: mockUpdateNote,
  deleteNote: mockDeleteNote,
});

describe('NoteEditor', () => {
  const note = { id: 1, title: 'Test Note', content: 'Initial content' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders note title and content', () => {
    render(<NoteEditor note={note} />);
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial content')).toBeInTheDocument();
  });

  it('updates title and content when note changes', () => {
    const { rerender } = render(<NoteEditor note={note} />);
    const newNote = { id: 1, title: 'Updated Title', content: 'Updated content' };
    rerender(<NoteEditor note={newNote} />);
    expect(screen.getByDisplayValue('Updated Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Updated content')).toBeInTheDocument();
  });

  it('calls updateNote when form is submitted', async () => {
    render(<NoteEditor note={note} />);
    fireEvent.change(screen.getByDisplayValue('Test Note'), { target: { value: 'New Title' } });
    fireEvent.change(screen.getByDisplayValue('Initial content'), { target: { value: 'New content' } });
    fireEvent.click(screen.getByText(/save/i));
    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledWith(1, { title: 'New Title', content: 'New content' });
    });
  });

  it('calls deleteNote when delete button is clicked and confirmed', async () => {
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    render(<NoteEditor note={note} />);
    fireEvent.click(screen.getByText(/delete/i));
    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledWith(1);
    });
  });

  it('does not call deleteNote when delete is cancelled', () => {
    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false);
    render(<NoteEditor note={note} />);
    fireEvent.click(screen.getByText(/delete/i));
    expect(mockDeleteNote).not.toHaveBeenCalled();
  });

  it('shows message when no note is selected', () => {
    render(<NoteEditor note={null} />);
    expect(screen.getByText('Select a note to view or edit')).toBeInTheDocument();
  });
});
