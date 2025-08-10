import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CallHistory } from './CallHistory';
import { ThemeProvider } from '../ThemeContext';

describe('CallHistory component edge cases test', () => {
  it('handles empty call histories list', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory callHistories={[]} />
      </ThemeProvider>
    );
    expect(getByText('No call history')).toBeInTheDocument();
  });

  it('handles null call histories list', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory callHistories={null} />
      </ThemeProvider>
    );
    expect(getByText('No call history')).toBeInTheDocument();
  });

  it('handles undefined call histories list', () => {
    const { getByText } = render(
      <ThemeProvider>
        <CallHistory />
      </ThemeProvider>
    );
    expect(getByText('No call history')).toBeInTheDocument();
  });
});
```

These test files cover various scenarios, including:

*   Rendering the call history list
*   Toggling the open state
*   Rendering call histories list with data
*   Integration tests with translations and API calls
*   Edge cases with empty, null, and undefined call histories lists

Make sure to update the file paths according to your project structure.

**jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```
**package.json**
```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```
Run tests using `npm run test` or `yarn test`, and generate coverage report using `npm run test:coverage` or `yarn test:coverage`.