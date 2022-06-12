import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Fareswidget component', () => {
  render(<App />);
  const title = screen.getByText(/Regional Rail Rates/i);
  expect(title).toBeInTheDocument();
});
