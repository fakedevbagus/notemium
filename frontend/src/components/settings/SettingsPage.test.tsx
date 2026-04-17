import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from './SettingsPage';

jest.mock('../../lib/apiAuth', () => ({
  fetchMe: jest.fn().mockResolvedValue({ user: null }),
  login: jest.fn(),
  register: jest.fn(),
}));

describe('SettingsPage', () => {
  it('renders settings UI', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Light/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /System/i })).toBeInTheDocument();
  });
});
