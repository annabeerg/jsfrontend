import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import documents from './models/document';

test('if documents has an array longer than 0', () => {
  render(<App />)
    if (documents.length > 0) {
    expect(documents).toBe(expect.arrayContaining(expect.toMatchObject({ name: expect.any("Anna") })));
    }
});

test('if the start button is create', () => {
  render(<App />)
  render(<button />)
  const button = screen.getByRole('button', { name: /create/i })
  expect(button).toHaveClass('create')
});

  test('If the input field for title has correct start value', async () => {
    render(<App />)
    expect(screen.getByDisplayValue('Write your title here...')).toHaveAttribute('id', 'title-trix');
})
