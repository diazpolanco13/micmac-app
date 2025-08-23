'use client';

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
}