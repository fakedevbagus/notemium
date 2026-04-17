import { render, screen } from '@testing-library/react';
import NotesPage from './NotesPage';
import { useNotesStore } from '../../store/notesStore';

jest.mock('../../store/notesStore', () => ({
  useNotesStore: jest.fn(),
}));

jest.mock('./NoteList', () => () => <div data-testid="note-list">NoteList</div>);
jest.mock('./NoteCreate', () => () => <div data-testid="note-create">NoteCreate</div>);
jest.mock('./NoteEditor', () => () => <div data-testid="note-editor">NoteEditor</div>);

describe('NotesPage', () => {
  beforeEach(() => {
    (useNotesStore as jest.Mock).mockReturnValue({
      notes: [{ id: 1, title: 'Test Note', content: '...' }],
      selectedId: 1,
      fetchNotes: jest.fn(),
      selectNote: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it('renders note list, create, and editor', () => {
    render(<NotesPage />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByTestId('note-list')).toBeInTheDocument();
    expect(screen.getByTestId('note-create')).toBeInTheDocument();
    expect(screen.getByTestId('note-editor')).toBeInTheDocument();
  });

  it('shows loading and error states', () => {
    (useNotesStore as jest.Mock).mockReturnValueOnce({
      notes: [],
      selectedId: null,
      fetchNotes: jest.fn(),
      selectNote: jest.fn(),
      loading: true,
      error: 'Error!',
    });
    render(<NotesPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
