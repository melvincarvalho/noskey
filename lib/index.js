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

class Base64 {
  static encode(bin) {
    const ss = [];
    bin.map(b => ss.push(String.fromCharCode(b)));
    return btoa(ss.join(""));
  }
  static decode(text) {
    const s = atob(text);
    const res = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
      res[i] = s.charCodeAt(i);
    }
    return res;
  }
}

const bin2s = (bin, n, len) => {
  const b = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n];
  }
  return new TextDecoder().decode(b);
};
const bin2i = (bin, n) => {
  return ((bin[n] & 0xff) << 24) | ((bin[n + 1] & 0xff) << 16) | ((bin[n + 2] & 0xff) << 8) | (bin[n + 3] & 0xff);
};
const subbin = (bin, n, len) => {
  const b = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n];
  }
  return b;
};
const setbin = (bin, off, b) => {
  for (let i = 0; i < b.length; i++) {
    bin[i + off] = b[i];
  }
  return bin;
};
const i2bin = (b, off, n) => {
  b[off] = (n >> 24) & 0xff;
  b[off + 1] = (n >> 16) & 0xff;
  b[off + 2] = (n >> 8) & 0xff;
  b[off + 3] = n & 0xff;
};
const s2bin = (bin, off, s) => {
  setbin(bin, off, new TextEncoder().encode(s));
};
const bincat = (bin1, bin2) => {
  const bin = new Uint8Array(bin1.length + bin2.length);
  for (let i = 0; i < bin1.length; i++) {
    bin[i] = bin1[i];
  }
  for (let i = 0; i < bin2.length; i++) {
    bin[i + bin1.length] = bin2[i];
  }
  return bin;
};
const eqbin = (bin1, bin2) => {
  if (bin1 == bin2) {
    return true;
  }
  if (!bin1 || !bin2) {
    return false;
  }
  if (bin1.length != bin2.length) {
    return false;
  }
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] != bin2[i]) {
      return false;
    }
  }
  return true;
};



const BEGIN = "-----BEGIN OPENSSH PRIVATE KEY-----";
const END = "-----END OPENSSH PRIVATE KEY-----";

function decodePEM(txt) {
  const ss = txt.split("\n").map(s => s.trim());
  const ns = ss.indexOf(BEGIN);
  const ne = ss.indexOf(END);
  if (ns < 0 || ne < 0 || ns > ne) {
    return null;
  }
  const bin = Base64.decode(ss.slice(ns + 1, ne).join(""));
  if (bin2s(bin, 0x2f, 11) != "ssh-ed25519") {
    return null;
  }
  if (bin2s(bin, 0x6e, 11) != "ssh-ed25519") {
    return null;
  }
  if (bin2i(bin, 0x3a) != 32) {
    return null;
  }
  const publicKey = subbin(bin, 0x3e, 32);
  if (bin2i(bin, 0x9d) != 64) {
    return null;
  }
  const privateKey = subbin(bin, 0xa1, 64);
  return { publicKey, privateKey };
}

function encodePEM(keys) {
  const pubkey = keys.publicKey;
  const prikey = keys.privateKey;
  const bin = new Uint8Array(234);
  s2bin(bin, 0, "openssh-key-v1\0");
  i2bin(bin, 0xf, 4);
  s2bin(bin, 0x13, "none");
  i2bin(bin, 0x17, 4);
  s2bin(bin, 0x1b, "none");
  i2bin(bin, 0x1f, 0);
  i2bin(bin, 0x23, 1);
  i2bin(bin, 0x27, 0x33);
  i2bin(bin, 0x2b, 0xb);
  s2bin(bin, 0x2f, "ssh-ed25519");
  i2bin(bin, 0x3a, 32);
  setbin(bin, 0x3e, pubkey);
  i2bin(bin, 0x5e, 0x88);
  const rnd = (Math.random() * 0x100000000) >> 0;
  i2bin(bin, 0x62, rnd);
  i2bin(bin, 0x62 + 4, rnd);
  i2bin(bin, 0x6a, 0xb);
  s2bin(bin, 0x6e, "ssh-ed25519");
  i2bin(bin, 0x79, 32);
  setbin(bin, 0x7d, pubkey);
  i2bin(bin, 0x9d, 0x40);
  setbin(bin, 0xa1, prikey);
  setbin(bin, 0xc1, pubkey);
  i2bin(bin, 0xe1, 0);
  setbin(bin, 0xe5, new Uint8Array([1, 2, 3, 4, 5]));
  const cr = "\n";
  return [BEGIN, Base64.encode(bin).replace(/(.{70})/g, "$1" + cr), END].join(cr) + cr;
}


// functions as requires
module.exports = {
  encodeBytes,
  hexToBuffer,
  bufferToHex,
  generate_public_key,
  hexToBase64,
  secp256k1Add,
  encodePEM,
  decodePEM
}
