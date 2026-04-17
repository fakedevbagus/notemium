import { render, screen } from '@testing-library/react';
import FoldersPage from './FoldersPage';
import { useFoldersStore } from '../../store/foldersStore';

jest.mock('../../store/foldersStore', () => ({
  useFoldersStore: jest.fn(),
}));

jest.mock('./FolderList', () => () => <div data-testid="folder-list">FolderList</div>);
jest.mock('./FolderCreate', () => () => <div data-testid="folder-create">FolderCreate</div>);
jest.mock('./FolderDetails', () => () => <div data-testid="folder-details">FolderDetails</div>);

describe('FoldersPage', () => {
  beforeEach(() => {
    (useFoldersStore as jest.Mock).mockReturnValue({
      folders: [{ id: 1, name: 'Work' }],
      selectedId: 1,
      fetchFolders: jest.fn(),
      selectFolder: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it('renders folder list, create, and details', () => {
    render(<FoldersPage />);
    expect(screen.getByText('Folders')).toBeInTheDocument();
    expect(screen.getByTestId('folder-list')).toBeInTheDocument();
    expect(screen.getByTestId('folder-create')).toBeInTheDocument();
    expect(screen.getByTestId('folder-details')).toBeInTheDocument();
  });

  it('shows loading and error states', () => {
    (useFoldersStore as jest.Mock).mockReturnValueOnce({
      folders: [],
      selectedId: null,
      fetchFolders: jest.fn(),
      selectFolder: jest.fn(),
      loading: true,
      error: 'Error!',
    });
    render(<FoldersPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
