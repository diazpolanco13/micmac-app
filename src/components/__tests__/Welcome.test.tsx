import { render, screen, fireEvent } from '@testing-library/react';
import Welcome from '../Welcome';

describe('Welcome Component', () => {
  test('renders welcome message', () => {
    render(<Welcome />);
    expect(screen.getByText('MIC MAC Pro')).toBeInTheDocument();
    expect(screen.getByText('Análisis Prospectivos Automatizados')).toBeInTheDocument();
  });

  test('renders with custom props', () => {
    render(<Welcome title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    // El título siempre es "MIC MAC Pro" en el nuevo diseño
    expect(screen.getByText('MIC MAC Pro')).toBeInTheDocument();
  });

  test('hides component when button clicked', () => {
    render(<Welcome />);
    const button = screen.getByText('Explorar Demo');
    fireEvent.click(button);
    expect(screen.queryByText('MIC MAC Pro')).not.toBeInTheDocument();
  });

  test('shows automation status', () => {
    render(<Welcome />);
    expect(screen.getByText('🤖 Agentes de Automatización Activos')).toBeInTheDocument();
  });
});