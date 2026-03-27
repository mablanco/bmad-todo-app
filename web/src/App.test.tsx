import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the todo capture shell instead of the Vite starter', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Capture what matters now' }),
    ).toBeVisible();
    expect(screen.getByLabelText('Task description')).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'No tasks yet' }),
    ).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Get started' })).toBeNull();
    expect(screen.queryByText(/Count is/i)).toBeNull();
  });

  it('allows keyboard-style form submission without losing the shell state', () => {
    render(<App />);

    const form = screen.getByRole('form', { name: 'Create a task' });
    const input = screen.getByLabelText('Task description');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.submit(form);

    expect(screen.getByRole('heading', { name: 'Capture what matters now' })).toBeVisible();
    expect(input).toHaveValue('Buy milk');
    expect(screen.getByRole('heading', { name: 'No tasks yet' })).toBeVisible();
  });
});
