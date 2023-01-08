const secp256k1 = require('@noble/secp256k1')
const { bech32 } = require('@scure/base')
const ed25519 = require('ed25519')
const tiny = require('tiny-secp256k1')

// FUNCTIONS
/**
 * Encode bytes into bech32 format
 * @param {string} prefix
 * @param {string} hex
 * @returns {string} bech32 encoded string
 */
function encodeBytes(prefix, hex) {
  let data = secp256k1.utils.hexToBytes(hex)
  let words = bech32.toWords(data)
  return bech32.encode(prefix, words, 1500)
}

// Convert a hex string to a buffer
// This function is used to convert a hex string to a buffer
// which is required by the bitcoinjs-lib library
// hex - the hex string to convert
// returns the buffer
const hexToBuffer = hex => Buffer.from(hex, 'hex')

// Generate a public key from a private key
// privKey: Private key to convert
function generate_public_key(privKey) {
  return ed25519.MakeKeypair(hexToBuffer(privKey)).publicKey.toString('hex')
}

// function buffer to hex
function bufferToHex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
    .join('')
}

// function to convert hex string to base64 string
function hexToBase64(str) {
  return Buffer.from(str, 'hex').toString('base64')
}

function secp256k1Add(keyA, keyB) {
  // xor is a binary operator that returns a 1 in each bit position for which the corresponding bits of its operands are different
  let xorKeyA = BigInt('0x' + keyA.slice(0, 64))
  let xorKeyB = BigInt('0x' + keyB.slice(0, 64))

  // xor the two keys
  let xorAdd = xorKeyA + xorKeyB

  // convert the result to hex
  let hexAdd = xorAdd.toString(16).padStart(64, '0')
  let result = `${hexAdd.slice(64)}`

  return result
}

// export functions as requires
module.exports = {
  encodeBytes,
  hexToBuffer,
  bufferToHex,
  generate_public_key,
  hexToBase64,
  secp256k1Add
}
