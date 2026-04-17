import { render, screen, fireEvent } from '@testing-library/react';
import FolderList from './FolderList';

describe('FolderList', () => {
  const folders = [
    { id: 1, name: 'Work', noteCount: 2 },
    { id: 2, name: 'Personal', noteCount: 0 },
  ];

  it('renders folder names and note counts', () => {
    render(
      <FolderList 
        folders={folders} 
        onSelect={() => {}} 
        selectedId={null} 
      />
    );
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('2 notes')).toBeInTheDocument();
    expect(screen.getByText('0 notes')).toBeInTheDocument();
  });

  it('calls onSelect when a folder is clicked', () => {
    const onSelect = jest.fn();
    render(
      <FolderList 
        folders={folders} 
        onSelect={onSelect} 
        selectedId={null} 
      />
    );
    fireEvent.click(screen.getByText('Personal'));
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
