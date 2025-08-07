#!/usr/bin/env node

/**
 * SSH Ed25519 Public Key Decoder
 * 
 * This tool shows you how to read and decode SSH Ed25519 public keys
 * Usage: node decode-ssh-key.js [ssh-key-string]
 */

import { getAllKeys } from './lib/index.js'

// ANSI colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`)
}

async function decodeSSHPublicKey(sshKey) {
  try {
    log(colors.blue + colors.bold, '🔍 SSH Ed25519 Public Key Decoder')
    log(colors.blue, '=' .repeat(50))
    console.log()
    
    console.log('Input SSH key:')
    console.log(sshKey)
    console.log()
    
    // Parse the SSH key format
    const parts = sshKey.trim().split(/\s+/)
    if (parts.length < 2) {
      throw new Error('Invalid SSH key format')
    }
    
    const algorithm = parts[0]
    const base64Data = parts[1]
    const comment = parts.slice(2).join(' ') || 'no comment'
    
    log(colors.cyan, '📝 Key Components:')
    console.log(`  Algorithm: ${algorithm}`)
    console.log(`  Base64 data: ${base64Data}`)
    console.log(`  Comment: ${comment}`)
    console.log(`  Base64 length: ${base64Data.length} characters`)
    console.log()
    
    // Decode base64
    const decoded = Buffer.from(base64Data, 'base64')
    log(colors.cyan, '🔧 Raw Binary Data:')
    console.log(`  Decoded length: ${decoded.length} bytes`)
    console.log(`  Raw hex: ${decoded.toString('hex')}`)
    console.log()
    
    // Parse SSH wire format
    let pos = 0
    
    // Read algorithm name length
    if (pos + 4 > decoded.length) throw new Error('Truncated data: cannot read algorithm length')
    const algLen = decoded.readUInt32BE(pos)
    pos += 4
    
    // Read algorithm name
    if (pos + algLen > decoded.length) throw new Error('Truncated data: cannot read algorithm name')
    const algName = decoded.subarray(pos, pos + algLen).toString('ascii')
    pos += algLen
    
    // Read public key length
    if (pos + 4 > decoded.length) throw new Error('Truncated data: cannot read key length')
    const keyLen = decoded.readUInt32BE(pos)
    pos += 4
    
    // Read public key
    if (pos + keyLen > decoded.length) throw new Error('Truncated data: cannot read public key')
    const publicKey = decoded.subarray(pos, pos + keyLen)
    const publicKeyHex = publicKey.toString('hex')
    
    log(colors.cyan, '🔑 Parsed SSH Wire Format:')
    console.log(`  Algorithm name length: ${algLen} bytes`)
    console.log(`  Algorithm name: "${algName}"`)
    console.log(`  Public key length: ${keyLen} bytes`)
    console.log(`  Ed25519 public key: ${publicKeyHex}`)
    console.log()
    
    // Validation
    log(colors.cyan, '✅ Validation:')
    console.log(`  Algorithm matches: ${algorithm === algName ? '✅' : '❌'} (${algorithm} === ${algName})`)
    console.log(`  Key length correct: ${keyLen === 32 ? '✅' : '❌'} (Ed25519 should be 32 bytes)`)
    console.log(`  Data fully parsed: ${pos + keyLen === decoded.length ? '✅' : '❌'}`)
    console.log()
    
    // Generate fingerprint
    const crypto = await import('crypto')
    const sha256Hash = crypto.createHash('sha256').update(decoded).digest()
    const fingerprint = sha256Hash.toString('base64').replace(/=+$/, '')
    
    log(colors.cyan, '🔐 Key Fingerprint:')
    console.log(`  SHA256:${fingerprint}`)
    console.log()
    
    return {
      algorithm: algName,
      publicKey: publicKeyHex,
      fingerprint,
      comment
    }
    
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`)
    return null
  }
}

async function main() {
  // Get SSH key from command line or use our test key
  let sshKey = process.argv[2]
  
  if (!sshKey) {
    log(colors.yellow, '💡 No SSH key provided, generating test key...')
    console.log()
    
    // Generate a test key using our library
    const testPrivateKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const result = getAllKeys(testPrivateKey)
    sshKey = result.openSSHed25519pubkey
    
    log(colors.green, '🔑 Generated test SSH Ed25519 public key:')
    console.log()
  }
  
  // Decode the key
  const decoded = await decodeSSHPublicKey(sshKey)
  
  if (decoded) {
    log(colors.green + colors.bold, '🎉 Successfully decoded SSH Ed25519 public key!')
    console.log()
    log(colors.blue, 'Summary:')
    console.log(`• Algorithm: ${decoded.algorithm}`)
    console.log(`• Public Key: ${decoded.publicKey}`)
    console.log(`• Fingerprint: SHA256:${decoded.fingerprint}`)
    console.log(`• Comment: ${decoded.comment}`)
  }
  
  console.log()
  log(colors.blue, '🛠️  Usage examples:')
  console.log('• node decode-ssh-key.js "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICB6BniSgh4l13Dx user@host"')
  console.log('• ssh-keygen -l -f keyfile.pub')
  console.log('• ssh-keygen -lvf keyfile.pub  # visual fingerprint')
}

main().catch(console.error)