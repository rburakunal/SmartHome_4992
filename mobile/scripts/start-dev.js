/**
 * Script to start both backend and frontend together
 */
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the project root directory (2 levels up from this script)
const projectRoot = path.resolve(__dirname, '../../');
const backendPath = path.join(projectRoot, 'backend');
const mobilePath = path.join(projectRoot, 'mobile');

console.log('🚀 Starting Smart Home App Development Environment');
console.log('📂 Project Root:', projectRoot);

// Check if backend exists
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found at:', backendPath);
  process.exit(1);
}

// Start backend server
console.log('🔄 Starting backend server...');
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: backendPath,
  stdio: 'pipe', // Pipe output to be captured
  shell: true
});

// Handle backend process output
backendProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`📡 Backend: ${output}`);
  
  // Look for the "server running" message to know when backend is ready
  if (output.includes('Sunucu') && output.includes('portunda çalışıyor')) {
    console.log('✅ Backend server started successfully!');
    console.log('🔄 Starting frontend app...');
    
    // Start the Expo app
    const frontendProcess = spawn('npx', ['expo', 'start'], {
      cwd: mobilePath,
      stdio: 'inherit', // Inherit will show output in the same terminal
      shell: true
    });

    frontendProcess.on('error', (error) => {
      console.error('❌ Error starting frontend:', error);
    });
  }
});

backendProcess.stderr.on('data', (data) => {
  console.error(`❌ Backend Error: ${data}`);
});

backendProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend process exited with code ${code}`);
  }
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('👋 Shutting down all processes...');
  backendProcess.kill();
  process.exit(0);
}); 