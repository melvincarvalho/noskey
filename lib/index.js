
const
  secp256k1
    = require("@noble/secp256k1");
const {
  bech32,
} = require("@scure/base");
const ed25519 = require('ed25519');


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
const hexToBuffer = hex => Buffer.from(hex, 'hex');

// Generate a public key from a private key
// privKey: Private key to convert
function generate_public_key(privKey) {
  return ed25519.MakeKeypair(hexToBuffer(privKey)).publicKey.toString('hex');
}

// function to convert hex string to base64 string
function hexToBase64(str) {
  return Buffer.from(str, 'hex').toString('base64');
}

// export functions as requires
module.exports = {
  encodeBytes,
  hexToBuffer,
  generate_public_key,
  hexToBase64
}