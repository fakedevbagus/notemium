import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input and button', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByPlaceholderText('Search notes or folders...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('calls onSearch with query when form is submitted', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search notes or folders...');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(screen.getByText('Search'));
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onSearch when Enter is pressed', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Search notes or folders...');
    fireEvent.change(input, { target: { value: 'enter query' } });
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('enter query');
  });
});