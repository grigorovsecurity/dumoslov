#!/usr/bin/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('⚡ Building Думослов (Vite -> Cloudflare Pages)...');

try {
  // 1. Run Vite build into dist/
  cp.execSync('npx vite build', { stdio: 'inherit' });

  // 2. Also mirror dist into .next so if Cloudflare Pages expects .next, it finds all assets
  const distDir = path.resolve(process.cwd(), 'dist');
  const nextDir = path.resolve(process.cwd(), '.next');

  if (fs.existsSync(distDir)) {
    if (!fs.existsSync(nextDir)) {
      try {
        fs.cpSync(distDir, nextDir, { recursive: true });
      } catch {
        // Ignore copy errors
      }
    }
  }

  console.log('✅ Build completed successfully for Cloudflare Pages!');
  process.exit(0);
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
