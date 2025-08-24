#!/usr/bin/env node

/**
 * Script para configurar Linear MCP en VS Code
 * Guía paso a paso para conectar Linear con tu proyecto
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CONFIG_FILE = path.join(process.cwd(), '.linear-mcp.json');

console.log('\n🚀 Configuración de Linear MCP para VS Code\n');
console.log('Este script te ayudará a configurar Linear con MCP (Model Context Protocol).\n');

const steps = [
  {
    title: '📋 Paso 1: Obtener API Key de Linear',
    instructions: `
1. Abre Linear en tu navegador
2. Ve a Settings (⚙️) → API → Personal API keys
3. Haz clic en "Create key"
4. Dale un nombre descriptivo (ej: "MIC MAC Pro - VS Code MCP")
5. Copia la API key generada
    `
  },
  {
    title: '🔧 Paso 2: Configurar VS Code',
    instructions: `
1. Asegúrate de tener la extensión de Claude instalada en VS Code
2. En VS Code, abre la paleta de comandos (Cmd/Ctrl + Shift + P)
3. Busca "Claude: Configure MCP Servers" o similar
4. Si no aparece, verifica que la extensión esté instalada y activa
    `
  }
];

function showStep(step) {
  console.log(`\n${step.title}`);
  console.log('─'.repeat(50));
  console.log(step.instructions);
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupLinearMCP() {
  // Mostrar instrucciones
  steps.forEach(showStep);

  console.log('\n📝 Ahora vamos a configurar tu API Key:\n');

  const apiKey = await askQuestion('Pega tu Linear API Key aquí: ');

  if (!apiKey || apiKey.trim() === '') {
    console.log('\n❌ API Key no proporcionada. Configuración cancelada.');
    process.exit(1);
  }

  // Crear configuración
  const config = {
    mcpServers: {
      linear: {
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/server-linear"
        ],
        env: {
          LINEAR_API_KEY: apiKey.trim()
        }
      }
    }
  };

  // Guardar configuración
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(`\n✅ Configuración guardada en: ${CONFIG_FILE}`);
  } catch (error) {
    console.error('\n❌ Error al guardar la configuración:', error.message);
    process.exit(1);
  }

  console.log('\n🎯 Siguiente paso: Configurar VS Code\n');
  console.log('─'.repeat(50));
  console.log(`
Para VS Code necesitas configurar MCP en la extensión de Claude:

1. Abre VS Code Settings (Cmd/Ctrl + ,)
2. Busca "Claude" o "MCP" en la configuración
3. Encuentra la sección de MCP Servers
4. Agrega la siguiente configuración:

{
  "linear": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-linear"],
    "env": {
      "LINEAR_API_KEY": "${apiKey.trim().substring(0, 10)}..."
    }
  }
}

Alternativamente, puedes copiar el contenido de .linear-mcp.json
  `);

  console.log('\n📚 Documentación y recursos:');
  console.log('─'.repeat(50));
  console.log('• Linear API Docs: https://developers.linear.app/docs/graphql/working-with-the-graphql-api');
  console.log('• MCP Protocol: https://modelcontextprotocol.io/');
  console.log('• Tu configuración Linear: ./linear-config.md');

  console.log('\n✨ ¡Configuración completada!\n');
  console.log('Ahora puedes usar Linear desde Claude en VS Code con comandos como:');
  console.log('• "Muéstrame mis issues de Linear"');
  console.log('• "Crea un nuevo issue en Linear"');
  console.log('• "Actualiza el estado del issue MIC-XXX"');

  rl.close();
}

// Ejecutar setup
setupLinearMCP().catch(console.error);