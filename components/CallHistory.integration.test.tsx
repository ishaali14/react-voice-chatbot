import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CallHistory } from './CallHistory';
import { ThemeProvider } from '../ThemeContext';
import { i18n } from '../i18n';

describe('CallHistory component integration test', () => {
  it('renders call history list with translations', async () => {
    i18n.changeLanguage('fr-FR');
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory />
      </ThemeProvider>
    );
    await waitFor(() => getByText('Historique des appels'));
    expect(getByText('Historique des appels')).toBeInTheDocument();
  });

  it('calls API to fetch call histories', async () => {
    const { getAllByRole } = render(
      <ThemeProvider>
        <CallHistory />
      </ThemeProvider>
    );
    await waitFor(() => getAllByRole('listitem'));
    expect(getAllByRole('listitem')).toHaveLength(2);
  });
});