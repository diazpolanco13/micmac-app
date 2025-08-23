import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from '../Welcome';

describe('Welcome Component', () => {
  test('renders welcome message', () => {
    render(<Welcome />);
    expect(screen.getByText('🚀 MIC MAC Pro')).toBeInTheDocument();
    expect(screen.getByText('Análisis Prospectivos Automatizados')).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(<Welcome title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('hides component when button clicked', () => {
    render(<Welcome />);
    const button = screen.getByText('Comenzar');
    fireEvent.click(button);
    expect(screen.queryByText('🚀 MIC MAC Pro')).not.toBeInTheDocument();
  });

  test('shows automation status', () => {
    render(<Welcome />);
    expect(screen.getByText('🤖 Automatización Activa')).toBeInTheDocument();
  });
});