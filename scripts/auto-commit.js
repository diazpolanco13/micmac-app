#!/usr/bin/env node
/**
 * 📝 @CursorGit - Script de Automatización
 * Maneja commits automáticos con formato consistente y tracking Linear
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function autoCommit() {
  console.log('📝 @CursorGit: Iniciando commit automático...');
  
  try {
    // Verificar que estamos en un repo git
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
    
    // Verificar si hay cambios
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!status.trim()) {
      console.log('✅ No hay cambios para commitear');
      return;
    }
    
    console.log('📊 Cambios detectados:');
    console.log(status);
    
    // Determinar tipo de commit basado en archivos modificados
    const commitInfo = analyzeChanges(status);
    
    // Agregar archivos
    execSync('git add .', { stdio: 'inherit' });
    
    // Crear mensaje de commit automático
    const commitMessage = generateCommitMessage(commitInfo);
    
    // Hacer commit
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log(`✅ Commit creado: ${commitMessage}`);
    
    // Actualizar métricas de automatización
    await updateAutomationMetrics(commitInfo);
    
    // Si hay remote configurado, hacer push
    try {
      const remotes = execSync('git remote', { encoding: 'utf8' });
      if (remotes.trim()) {
        console.log('🚀 Pushing to remote...');
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Push completado exitosamente');
      } else {
        console.log('📋 No hay remote configurado. Solo commit local.');
      }
    } catch (error) {
      console.log('📋 Push no realizado (posiblemente no hay remote configurado)');
    }
    
    console.log('🎉 @CursorGit completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en @CursorGit:', error.message);
    process.exit(1);
  }
}

function analyzeChanges(status) {
  const lines = status.trim().split('\n');
  const changes = {
    added: [],
    modified: [],
    deleted: [],
    type: 'feat', // default
    scope: 'general',
    linearIssue: null
  };
  
  lines.forEach(line => {
    const [statusCode, ...fileParts] = line.trim().split(' ');
    const file = fileParts.join(' ');
    
    if (statusCode.includes('A')) changes.added.push(file);
    if (statusCode.includes('M')) changes.modified.push(file);
    if (statusCode.includes('D')) changes.deleted.push(file);
  });
  
  // Determinar tipo y scope basado en archivos
  if (changes.added.some(f => f.includes('test') || f.includes('.test.'))) {
    changes.type = 'test';
    changes.scope = 'testing';
  } else if (changes.modified.some(f => f.includes('README') || f.includes('.md'))) {
    changes.type = 'docs';
    changes.scope = 'documentation';
  } else if (changes.added.some(f => f.includes('component') || f.includes('src/'))) {
    changes.type = 'feat';
    changes.scope = 'components';
  } else if (changes.modified.some(f => f.includes('package.json'))) {
    changes.type = 'chore';
    changes.scope = 'deps';
  } else if (changes.added.some(f => f.includes('automation') || f.includes('scripts/'))) {
    changes.type = 'feat';
    changes.scope = 'automation';
  } else if (changes.added.some(f => f.includes('prisma') || f.includes('schema'))) {
    changes.type = 'feat';
    changes.scope = 'database';
  }
  
  // Buscar referencia a Linear issue en archivos recientes
  try {
    const recentFiles = [...changes.added, ...changes.modified].slice(0, 5);
    for (const file of recentFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const linearMatch = content.match(/API-(\d+)/);
        if (linearMatch) {
          changes.linearIssue = `API-${linearMatch[1]}`;
          break;
        }
      }
    }
  } catch (error) {
    // Ignorar errores de lectura de archivos
  }
  
  return changes;
}

function generateCommitMessage(commitInfo) {
  const { type, scope, added, modified, deleted, linearIssue } = commitInfo;
  
  // Generar descripción automática
  let description = '';
  
  if (added.length > 0) {
    const key = added[0];
    if (key.includes('automation')) description = 'implement automation system';
    else if (key.includes('test')) description = 'add comprehensive testing';
    else if (key.includes('component')) description = 'create new components';
    else if (key.includes('schema')) description = 'setup database schema';
    else if (key.includes('config')) description = 'setup project configuration';
    else description = `add ${added.length} new files`;
  } else if (modified.length > 0) {
    const key = modified[0];
    if (key.includes('README')) description = 'update documentation';
    else if (key.includes('package')) description = 'update dependencies';
    else if (key.includes('test')) description = 'improve test coverage';
    else description = `update ${modified.length} files`;
  } else if (deleted.length > 0) {
    description = `remove ${deleted.length} files`;
  }
  
  // Formato: tipo(scope): descripción (Linear: ISSUE)
  let message = `${type}(${scope}): ${description}`;
  
  if (linearIssue) {
    message += ` (Linear: ${linearIssue})`;
  }
  
  return message;
}

async function updateAutomationMetrics(commitInfo) {
  const metrics = {
    timestamp: new Date().toISOString(),
    commit: {
      type: commitInfo.type,
      scope: commitInfo.scope,
      filesAdded: commitInfo.added.length,
      filesModified: commitInfo.modified.length,
      filesDeleted: commitInfo.deleted.length,
      linearIssue: commitInfo.linearIssue
    },
    totalCommits: getTotalCommits()
  };
  
  // Guardar métricas
  const metricsPath = path.join(process.cwd(), '.automation', 'git-metrics.json');
  fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  
  console.log('📊 Métricas de commit actualizadas');
}

function getTotalCommits() {
  try {
    const result = execSync('git rev-list --count HEAD', { encoding: 'utf8' });
    return parseInt(result.trim()) + 1; // +1 porque este commit aún no está en el count
  } catch (error) {
    return 1; // Primer commit
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  autoCommit()
    .then(() => {
      console.log('🎉 @CursorGit completado exitosamente');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 @CursorGit falló:', error);
      process.exit(1);
    });
}

module.exports = { autoCommit };
