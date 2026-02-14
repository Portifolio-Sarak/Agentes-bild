#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const rootDir = path.join(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const isWindows = os.platform() === 'win32';

// Detecta o Python do ambiente virtual na raiz ou no backend
let pythonPath;

if (isWindows) {
  const rootVenv = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
  const backendVenv = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
  if (fs.existsSync(rootVenv)) {
    pythonPath = rootVenv;
  } else if (fs.existsSync(backendVenv)) {
    pythonPath = backendVenv;
  }
} else {
  const rootVenv = path.join(rootDir, '.venv', 'bin', 'python');
  const backendVenv = path.join(backendDir, 'venv', 'bin', 'python');
  if (fs.existsSync(rootVenv)) {
    pythonPath = rootVenv;
  } else if (fs.existsSync(backendVenv)) {
    pythonPath = backendVenv;
  }
}

if (!pythonPath) {
  console.error('❌ ERRO: Ambiente virtual não encontrado!');
  console.error('');
  console.error('Execute os seguintes comandos:');
  console.error('  cd backend');
  if (isWindows) {
    console.error('  python -m venv venv');
    console.error('  venv\\Scripts\\activate');
  } else {
    console.error('  python3 -m venv venv');
    console.error('  source venv/bin/activate');
  }
  console.error('  pip install -r requirements.txt');
  process.exit(1);
}

// Executa init_db.py
const args = ['init_db.py'];
const proc = spawn(pythonPath, args, {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false
});

proc.on('error', (err) => {
  console.error('Erro ao executar:', err);
  process.exit(1);
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});
