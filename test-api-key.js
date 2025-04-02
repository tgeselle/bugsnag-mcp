#!/usr/bin/env node

/**
 * Simple script to test if a Bugsnag API key is valid
 * 
 * Usage: node test-api-key.js YOUR_API_KEY
 */

import axios from 'axios';

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Error: No API key provided');
  console.error('Usage: node test-api-key.js YOUR_API_KEY');
  process.exit(1);
}

console.log('Testing Bugsnag API key...');

axios.get('https://api.bugsnag.com/user', {
  headers: {
    Authorization: `token ${apiKey}`,
    'X-Version': '2',
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    console.log('✅ API key is valid!');
  })
  .catch(error => {
    console.error('❌ API key is invalid or there was an error:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  });