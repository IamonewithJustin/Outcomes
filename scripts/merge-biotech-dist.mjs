import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDist = resolve('dist');
const biotechDist = resolve('biotech', 'dist');
const biotechTarget = resolve(rootDist, 'biotech');

if (!existsSync(rootDist)) {
  throw new Error('Root dist folder not found. Run root build first.');
}

if (!existsSync(biotechDist)) {
  throw new Error('Biotech dist folder not found. Run biotech build first.');
}

rmSync(biotechTarget, { recursive: true, force: true });
mkdirSync(biotechTarget, { recursive: true });
cpSync(biotechDist, biotechTarget, { recursive: true });

console.log('Merged biotech build into dist/biotech');
