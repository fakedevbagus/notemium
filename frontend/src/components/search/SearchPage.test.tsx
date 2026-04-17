import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from './SearchPage';

jest.mock('./SearchBar', () => (props: any) => (
  <button onClick={() => props.onSearch('test query')}>MockSearchBar</button>
));
jest.mock('./SearchResults', () => (props: any) => (
  <div>MockSearchResults: {props.results.length}</div>
));
jest.mock('../../lib/apiSearch', () => ({
  searchAll: jest.fn(async (query) => [{ id: 1, title: 'Result 1' }]),
}));

describe('SearchPage', () => {
  it('renders and performs search', async () => {
    render(<SearchPage />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    fireEvent.click(screen.getByText('MockSearchBar'));
    await waitFor(() => expect(screen.getByText(/MockSearchResults: 1/)).toBeInTheDocument());
  });

  it('shows loading and error states', async () => {
    const { searchAll } = require('../../lib/apiSearch');
    searchAll.mockImplementationOnce(() => new Promise((_, reject) => reject(new Error('fail'))));
    render(<SearchPage />);
    fireEvent.click(screen.getByText('MockSearchBar'));
    expect(screen.getByText('Searching...')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('fail')).toBeInTheDocument());
  });
});