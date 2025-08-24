import { render, screen } from '@testing-library/react';
import { Dialog } from '../Dialog';

describe('Dialog Component', () => {
  test('renders when open', () => {
    render(
      <Dialog open onClose={() => {}}>
        <div>Dialog Content</div>
      </Dialog>
    );
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        <div>Dialog Content</div>
      </Dialog>
    );
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  test('renders with title', () => {
    render(
      <Dialog open onClose={() => {}}>
        <div>
          <h2>Dialog Title</h2>
          <div>Content</div>
        </div>
      </Dialog>
    );
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });
});