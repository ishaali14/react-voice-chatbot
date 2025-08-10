import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CallHistory } from './CallHistory';
import { ThemeProvider } from '../ThemeContext';

describe('CallHistory component', () => {
  it('renders call history list', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory />
      </ThemeProvider>
    );
    expect(getByText('Call History')).toBeInTheDocument();
  });

  it('toggles open state when button is clicked', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory />
      </ThemeProvider>
    );
    const button = getByText('Open');
    fireEvent.click(button);
    expect(getByText('Close')).toBeInTheDocument();
  });

  it('renders call histories list', () => {
    const callHistories = [
      { id: 1, date: '2022-01-01', duration: '00:01:00' },
      { id: 2, date: '2022-01-02', duration: '00:02:00' },
    ];
    const { getAllByRole } = render(
      <ThemeProvider>
        <CallHistory callHistories={callHistories} />
      </ThemeProvider>
    );
    const listItems = getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
});