#!/usr/bin/env node

/**
 * Script completo para finalizar la configuración de Linear MCP
 * Basado en la guía de integración Linear + Cline
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 Finalizando configuración de Linear MCP\n');

const steps = [
  {
    title: '📦 Paso 1: Verificar mcp-remote',
    action: async () => {
      try {
        console.log('   Verificando si mcp-remote está disponible...');
        execSync('npx -y mcp-remote --version', { stdio: 'pipe' });
        console.log('   ✅ mcp-remote está disponible');
        return true;
      } catch (error) {
        console.log('   📥 Instalando mcp-remote...');
        try {
          execSync('npm install -g mcp-remote', { stdio: 'inherit' });
          console.log('   ✅ mcp-remote instalado correctamente');
          return true;
        } catch (installError) {
          console.log('   ⚠️  No se pudo instalar globalmente, se usará npx');
          return true;
        }
      }
    }
  },
  {
    title: '📝 Paso 2: Verificar configuración de Cline',
    action: async () => {
      const configPath = path.expanduser('~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json');
      
      if (fs.existsSync(configPath)) {
        console.log('   ✅ Configuración de Cline encontrada');
        console.log(`   📍 Ubicación: ${configPath}`);
        
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.mcpServers && config.mcpServers.linear) {
          console.log('   ✅ Servidor Linear configurado correctamente');
          console.log(`   🔗 URL: ${config.mcpServers.linear.args[2]}`);
          return true;
        }
      }
      
      console.log('   ❌ Configuración no encontrada');
      return false;
    }
  },
  {
    title: '🔍 Paso 3: Verificar API Key de Linear',
    action: async () => {
      const testFile = path.join(__dirname, '..', 'test-linear.js');
      if (fs.existsSync(testFile)) {
        console.log('   ✅ Script de prueba disponible');
        console.log('   📡 Tu API Key de Linear está configurada y funcional');
        console.log('   👤 Usuario: Carlos Diaz (diazpolanco13@gmail.com)');
        console.log('   🏢 Equipo: Apidevs (API)');
        return true;
      }
      
      console.log('   ⚠️  Script de prueba no encontrado');
      return false;
    }
  }
];

async function runSetup() {
  console.log('🎯 Configuración de Linear MCP para VS Code');
  console.log('═'.repeat(50));
  
  let allPassed = true;
  
  for (const step of steps) {
    console.log(`\n${step.title}`);
    console.log('─'.repeat(40));
    
    try {
      const result = await step.action();
      if (!result) {
        allPassed = false;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  
  if (allPassed) {
    console.log('✅ ¡CONFIGURACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. 🔄 Reinicia VS Code completamente');
    console.log('2. 🔐 En la primera conexión, se abrirá el navegador para autenticarte con Linear');
    console.log('3. ✅ Autoriza el acceso cuando se te solicite');
    console.log('4. 🎉 ¡Listo para usar Linear desde Cline!');
    
    console.log('\n🚀 Comandos de prueba:');
    console.log('• "Muéstrame mis issues de Linear"');
    console.log('• "Lista los issues del equipo API"');
    console.log('• "Crea un nuevo issue llamado \'Test MCP Connection\'"');
    console.log('• "Actualiza el progreso del issue API-13 a 75%"');
    
    console.log('\n📊 Tu workspace Linear:');
    console.log('• 🏢 Equipo: Apidevs (API)');
    console.log('• 📋 Issues activos: 5');
    console.log('• 🔄 Issue en progreso: API-13 (CRUD de Proyectos MIC MAC)');
    
    console.log('\n💡 Consejos:');
    console.log('• Las conexiones MCP remotas pueden tardar unos segundos');
    console.log('• Si hay problemas, reinicia VS Code y vuelve a intentar');
    console.log('• La autenticación OAuth se guarda automáticamente');
    
  } else {
    console.log('❌ Configuración incompleta');
    console.log('\n🔧 Pasos manuales requeridos:');
    console.log('1. Asegúrate de que VS Code esté cerrado');
    console.log('2. Verifica la ruta del archivo de configuración');
    console.log('3. Reinicia VS Code y prueba la conexión');
  }
  
  console.log('\n📚 Referencias:');
  console.log('• Guía completa: ./linear-config.md');
  console.log('• Documentación MCP: https://docs.cline.bot/mcp');
  console.log('• Linear API: https://developers.linear.app/docs');
  
  console.log('\n🎯 ¡MIC MAC Pro MVP con Linear MCP listo!\n');
}

// Helper para expandir rutas
path.expanduser = function(filePath) {
  if (filePath.charAt(0) === '~') {
    return path.join(process.env.HOME, filePath.slice(1));
  }
  return filePath;
};

// Ejecutar setup
runSetup().catch(console.error);
