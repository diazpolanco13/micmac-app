#!/usr/bin/env node
/**
 * 🚀 Inicializador de Automatización MIC MAC Pro
 * Configura todos los agentes especializados automáticamente
 */

const fs = require('fs');
const path = require('path');

async function initializeAutomation() {
  console.log('🚀 Inicializando automatización completa de MIC MAC Pro...\n');
  
  try {
    // Crear estructura de directorios
    await createDirectoryStructure();
    
    // Configurar archivos de configuración
    await createConfigFiles();
    
    // Crear archivos de ejemplo
    await createExampleFiles();
    
    // Configurar git hooks
    await setupGitHooks();
    
    // Mostrar resumen
    displaySummary();
    
    console.log('\n🎉 ¡Automatización configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante inicialización:', error.message);
    process.exit(1);
  }
}

async function createDirectoryStructure() {
  console.log('📁 Creando estructura de directorios...');
  
  const directories = [
    'src/app',
    'src/components',
    'src/lib',
    'src/hooks',
    'src/types',
    'src/utils',
    'src/__tests__',
    'prisma',
    'docs',
    'scripts',
    '.automation',
    '.github/workflows'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`  ✅ ${dir}`);
    }
  });
}

async function createConfigFiles() {
  console.log('\n⚙️  Creando archivos de configuración...');
  
  // Jest setup
  const jestSetup = `import '@testing-library/jest-dom';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}));

// Setup global test utilities
global.mockSupabase = {
  auth: {
    user: { id: 'test-user', email: 'test@example.com' }
  }
};`;

  fs.writeFileSync(path.join(process.cwd(), 'jest.setup.js'), jestSetup);
  console.log('  ✅ jest.setup.js');
  
  // Next.js config
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com']
  },
  env: {
    AUTOMATION_ENABLED: process.env.NODE_ENV === 'production' ? 'true' : 'false'
  }
};

module.exports = nextConfig;`;

  fs.writeFileSync(path.join(process.cwd(), 'next.config.js'), nextConfig);
  console.log('  ✅ next.config.js');
  
  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}`;

  fs.writeFileSync(path.join(process.cwd(), 'tailwind.config.js'), tailwindConfig);
  console.log('  ✅ tailwind.config.js');
  
  // Environment example
  const envExample = `# 🚀 MIC MAC Pro - Variables de Entorno

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Linear Integration
LINEAR_API_KEY=your_linear_api_key_here
LINEAR_TEAM_ID=your_team_id_here
LINEAR_PROJECT_ID=cf02bb0f-a49d-4f9c-9a85-bd4d03e5aed4

# Automation Configuration
AUTOMATION_ENABLED=true
GITHUB_TOKEN=your_github_token_here

# Development
NODE_ENV=development
PORT=3000`;

  fs.writeFileSync(path.join(process.cwd(), '.env.example'), envExample);
  console.log('  ✅ .env.example');
}

async function createExampleFiles() {
  console.log('\n📄 Creando archivos de ejemplo...');
  
  // Ejemplo de componente con test
  const exampleComponent = `'use client';

import { useState } from 'react';

interface WelcomeProps {
  title?: string;
  subtitle?: string;
}

export default function Welcome({ 
  title = '🚀 MIC MAC Pro', 
  subtitle = 'Análisis Prospectivos Automatizados' 
}: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        <p className="text-gray-600 mb-6">
          {subtitle}
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Comenzar
          </button>
        </div>
      </div>
      
      {/* Automation Status */}
      <div className="mt-8 p-4 bg-green-100 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 text-sm font-medium">
            🤖 Automatización Activa
          </span>
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(process.cwd(), 'src/components/Welcome.tsx'), exampleComponent);
  console.log('  ✅ src/components/Welcome.tsx');
  
  // Test para el componente
  const exampleTest = `import { render, screen, fireEvent } from '@testing-library/react';
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
});`;

  fs.writeFileSync(path.join(process.cwd(), 'src/components/__tests__/Welcome.test.tsx'), exampleTest);
  console.log('  ✅ src/components/__tests__/Welcome.test.tsx');
  
  // App page principal
  const appPage = `import Welcome from '@/components/Welcome';

export default function Home() {
  return <Welcome />;
}`;

  fs.writeFileSync(path.join(process.cwd(), 'src/app/page.tsx'), appPage);
  console.log('  ✅ src/app/page.tsx');
  
  // Layout
  const layout = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '🚀 MIC MAC Pro',
  description: 'Plataforma de Análisis Prospectivos con Automatización',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}`;

  fs.writeFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), layout);
  console.log('  ✅ src/app/layout.tsx');
  
  // Globals CSS
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-lg p-6;
  }
}`;

  fs.writeFileSync(path.join(process.cwd(), 'src/app/globals.css'), globalsCss);
  console.log('  ✅ src/app/globals.css');
}

async function setupGitHooks() {
  console.log('\n🔗 Configurando Git hooks...');
  
  const preCommitHook = `#!/bin/sh
# 🤖 Pre-commit hook - Automatización MIC MAC Pro

echo "🧪 @CursorTesting: Ejecutando tests antes del commit..."
npm run test:ci

if [ $? -ne 0 ]; then
  echo "❌ Tests fallaron. Commit cancelado."
  exit 1
fi

echo "📊 @CursorLinear: Actualizando progreso..."
npm run automation:linear

echo "✅ Pre-commit checks completados"`;

  const hooksDir = path.join(process.cwd(), '.git/hooks');
  if (fs.existsSync('.git')) {
    fs.writeFileSync(path.join(hooksDir, 'pre-commit'), preCommitHook);
    console.log('  ✅ Git pre-commit hook');
  }
}

function displaySummary() {
  console.log('\n📊 Resumen de Automatización Configurada:');
  console.log('');
  console.log('🤖 Agentes Especializados:');
  console.log('  🧪 @CursorTesting  - Tests automáticos (>80% coverage)');
  console.log('  📝 @CursorGit      - Commits y PRs automáticos');
  console.log('  📊 @CursorLinear   - Sync automático con Linear');
  console.log('  📚 @CursorDocs     - Documentación automática');
  console.log('');
  console.log('📋 Issues en Linear:');
  console.log('  API-5  - Setup proyecto (Manual)');
  console.log('  API-8  - Testing automático');
  console.log('  API-9  - Git automation');
  console.log('  API-10 - Linear sync');
  console.log('  API-11 - Documentation');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('  1. Configurar variables de entorno (.env.local)');
  console.log('  2. Configurar Supabase proyecto');
  console.log('  3. Ejecutar: npm run dev');
  console.log('  4. Ejecutar: npm run automation:all');
  console.log('');
  console.log('📚 Comandos disponibles:');
  console.log('  npm run automation:test   - Ejecutar @CursorTesting');
  console.log('  npm run automation:git    - Ejecutar @CursorGit');
  console.log('  npm run automation:linear - Ejecutar @CursorLinear');
  console.log('  npm run automation:docs   - Ejecutar @CursorDocs');
  console.log('  npm run automation:all    - Ejecutar todos los agentes');
}

// Ejecutar inicialización
if (require.main === module) {
  initializeAutomation();
}

module.exports = { initializeAutomation };
