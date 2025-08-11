#!/usr/bin/env node

console.log('noskey starting (CommonJS version)...');

// Simple test without any imports first
console.log('Process args:', process.argv);

// Just output something basic to test if the issue is with imports
console.log({
  "test": "basic output",
  "version": "0.0.60",
  "working": true
});

console.log('Done!');
process.exit(0);