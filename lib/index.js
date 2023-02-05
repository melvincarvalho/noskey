import bitcoin from 'bitcoinjs-lib'
// import TESTNET from 'bitcoin'
import nostrTools from 'nostr-tools'
// const { getPublicKey } = nostrTools

import { ECPairFactory } from 'ecpair'
import * as secp256k1 from '@noble/secp256k1'
// import { bech32 } from '@scure/base'
import ed25519 from 'ed25519'
import { bech32 } from 'bech32'
import * as tiny from 'tiny-secp256k1'


function getPublicKey(privateKey) {
  return secp256k1.utils.bytesToHex(secp256k1.schnorr.getPublicKey(privateKey))
}

// rewrite function nip19
function nip19(data, prefix) {
  console.log(data)
  let words = bech32.toWords(Buffer.from(data, 'hex'))
  return bech32.encode(prefix, words)
}

const TESTNET = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394,
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};


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

function splitLongStrings(str) {
  let charLimit = 70;
  let splittedString = '';
  if (str.length > charLimit) {
    for (let i = 0; i < str.length; i++) {
      if (i % charLimit === 0) {
        splittedString += '\n';
      }
      splittedString += str[i];
    }
    return splittedString;
  } else {
    return str;
  }
}


function encodePEM(keys) {

  var pem = `6f70656e7373682d6b65792d763100000000046e6f6e65000000046e6f6e650000000000000001000000330000000b7373682d6564323535313900000020${keys.publicKey}000000980ac771850ac771850000000b7373682d6564323535313900000020${keys.publicKey}00000040${keys.privateKey}${keys.publicKey}000000126d656c76696e406d656c76696e2d504e3632010203`

  return `${BEGIN}${splitLongStrings(hexToBase64(pem))}
${END}`

}


function getAllKeys(privateKey) {
  const ECPair = ECPairFactory(tiny)

  const ed25519_prefix = '0000000b7373682d6564323535313900000020'
  const ed25519_ssh_prefix = 'ssh-ed25519'
  const taproot_prefix = 'bc1p'
  const taproot_testnet_prefix = 'tb1p'

  let publicKey = getPublicKey(privateKey)
  let npub = nip19(publicKey, 'npub')
  // console.log(npub)

  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  let wif = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
  let wifTestnet = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TESTNET })

  // console.log(keyPair.publicKey)
  var ed25519pubkey = generate_public_key(privateKey)
  const p = tiny.pointFromScalar(Buffer.from(privateKey, 'hex'))
  var compressed = bufferToHex(p)
  var privkeyPEM = encodePEM({ publicKey: ed25519pubkey, privateKey: privateKey })

  var output = {
    privkey: privateKey,
    nsec: nip19(privateKey, 'nsec'),
    pubkey: publicKey,
    pubkeycompressed: compressed,
    bitcoinPubkey: wif.address,
    bitcoinTestnet3Pubkey: wifTestnet.address,
    npub: npub,
    taproot: encodeBytes(taproot_prefix, publicKey),
    taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
    ed25519pubkey: ed25519pubkey,
    openSSHed25519pubkey: `${ed25519_ssh_prefix} ${hexToBase64(
      ed25519_prefix + ed25519pubkey
    )}`,
    openSSHed25519privkey: privkeyPEM
  }
  return output
}


export {
  encodeBytes,
  hexToBuffer,
  bufferToHex,
  generate_public_key,
  hexToBase64,
  secp256k1Add,
  encodePEM,
  decodePEM,
  getAllKeys,
  getPublicKey
}
