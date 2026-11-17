// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InquiryForm } from '../src/components/inquiry-form';
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it('shows server rejection without losing the inquiry', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Too many attempts. Please try again later.' }),
    }),
  );
  render(<InquiryForm />);
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Sample Visitor' } });
  fireEvent.change(screen.getByLabelText('Email address'), {
    target: { value: 'visitor@example.test' },
  });
  fireEvent.change(screen.getByLabelText('How can we help?'), {
    target: { value: 'I would like to learn more about this sample property.' },
  });
  fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form')!);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Too many attempts'));
  expect((screen.getByLabelText('Your name') as HTMLInputElement).value).toBe('Sample Visitor');
});
it('reports durable submission success', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }),
  );
  render(<InquiryForm />);
  fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Sample Visitor' } });
  fireEvent.change(screen.getByLabelText('Email address'), {
    target: { value: 'visitor@example.test' },
  });
  fireEvent.change(screen.getByLabelText('How can we help?'), {
    target: { value: 'I would like to learn more about this sample property.' },
  });
  fireEvent.submit(screen.getByRole('button', { name: 'Send inquiry' }).closest('form')!);
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toContain('Your inquiry has been saved'),
  );
});
