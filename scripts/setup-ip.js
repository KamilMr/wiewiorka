#!/usr/bin/env node

import {networkInterfaces} from 'os';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

function getLocalIP() {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal addresses and IPv6
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  // Priority order for interface names
  const priority = ['en0', 'wlan0', 'eth0', 'Wi-Fi', 'Ethernet'];

  for (const interfaceName of priority) {
    if (results[interfaceName] && results[interfaceName].length > 0) {
      return results[interfaceName][0];
    }
  }

  // Fallback to first available IP
  for (const interfaceName of Object.keys(results)) {
    if (results[interfaceName].length > 0) {
      return results[interfaceName][0];
    }
  }

  return '127.0.0.1'; // Ultimate fallback
}

function updateEnvFile() {
  const ip = getLocalIP();
  const apiUrl = `http://${ip}:7555`;

  console.log(`🔍 Detected IP: ${ip}`);
  console.log(`🔧 Setting API URL: ${apiUrl}`);

  try {
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add EXPO_PUBLIC_API_URL
    const lines = envContent.split('\n');
    let found = false;

    const updatedLines = lines.map(line => {
      if (
        line.startsWith('EXPO_PUBLIC_API_URL=') ||
        line.startsWith('#EXPO_PUBLIC_API_URL=')
      ) {
        found = true;
        return `EXPO_PUBLIC_API_URL=${apiUrl}`;
      }
      return line;
    });

    if (!found) {
      updatedLines.push(`EXPO_PUBLIC_API_URL=${apiUrl}`);
    }

    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log(`✅ Updated .env file with IP: ${ip}`);
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
}

updateEnvFile();
