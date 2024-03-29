// import bitcoin from 'bitcoinjs-lib'
// import TESTNET from 'bitcoin'
// import nostrTools from 'nostr-tools'
// const { getPublicKey } = nostrTools

import { ECPairFactory } from 'ecpair'
import * as secp256k1 from '@noble/secp256k1'
// import { bech32 } from '@scure/base'
import ed25519 from 'ed25519'
import { bech32, bech32m } from 'bech32'
// import * as tiny from 'tiny-secp256k1'

/**
 * getPublicKey
 *
 * Gets a public key from a given private key
 *
 * @param {Buffer|Uint8Array} privateKey - The private key to use to generate the public key
 * @returns {String} Hex encoded public key
 */
function getPublicKey(privateKey) {
  return secp256k1.utils.bytesToHex(secp256k1.schnorr.getPublicKey(privateKey))
}

/**
 * Function to convert a hexadecimal data to a bech32 encoded string
 * @param {string} data - Hexadecimal data to be encoded
 * @param {string} prefix - Prefix of the bech32 encoded string
 * @returns {string} bech32 encoded string
 */
function nip19(data, prefix) {
  // console.log(data)
  const words = bech32.toWords(Buffer.from(data, 'hex'))
  return bech32.encode(prefix, words)
}

const TESTNET = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef
}

// FUNCTIONS
/**
 * Encode bytes into bech32 format
 * @param {string} prefix
 * @param {string} hex
 * @returns {string} bech32 encoded string
 */
function encodeBytes(prefix, hex) {
  const data = secp256k1.utils.hexToBytes(hex)
  var words = bech32m.toWords(data)
  words = [1, ...words];
  return bech32m.encode(prefix, words, 1500)
}

/**
 * Decode bech32 encoded bytes
 * @param {string} bech32EncodedString
 * @returns {string} hex
 * @throws {Error} if input is not a valid bech32 encoded string
 */
function decodeBytes(bech32EncodedString) {
  const { words } = bech32.decode(bech32EncodedString)
  const data = bech32.fromWords(words)
  const hex = data.map(byte => byte.toString(16).padStart(2, '0')).join('')

  return hex
}

// Convert a hex string to a buffer
// This function is used to convert a hex string to a buffer
// which is required by the bitcoinjs-lib library
// hex - the hex string to convert
// returns the buffer
const hexToBuffer = hex => Buffer.from(hex, 'hex')

/**
 * Generates a public key from a given private key
 *
 * @param {string} privKey - The private key used to generate the public key
 *
 * @returns {string} The generated public key in hexadecimal format
 */
function generate_public_key(privKey) {
  return ed25519.MakeKeypair(hexToBuffer(privKey)).publicKey.toString('hex')
}

/**
 * Converts a given buffer to a hexadecimal string.
 * @param {Buffer} buffer - The buffer to convert.
 * @returns {string} The hexadecimal string.
 */
function bufferToHex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
    .join('')
}

/**
 * Converts a hexadecimal string to a base64 encoded string
 * @param {string} str A string of hexadecimal characters
 * @returns {string} A base64 encoded string
 */
function hexToBase64(str) {
  return Buffer.from(str, 'hex').toString('base64')
}

/**
 * This function adds two secp256k1 keys together using the XOR operator.
 *
 * @param {string} keyA - The first secp256k1 key to be added.
 * @param {string} keyB - The second secp256k1 key to be added.
 *
 * @returns {string} The result of the addition of the two keys in hexadecimal format.
 */
function secp256k1Add(keyA, keyB) {
  // xor is a binary operator that returns a 1 in each bit position for which the corresponding bits of its operands are different
  const xorKeyA = BigInt('0x' + keyA.slice(0, 64))
  const xorKeyB = BigInt('0x' + keyB.slice(0, 64))

  // xor the two keys
  const xorAdd = xorKeyA + xorKeyB

  // convert the result to hex
  const hexAdd = xorAdd.toString(16).padStart(64, '0')
  const result = `${hexAdd.slice(64)}`

  return result
}

class Base64 {
  static encode(bin) {
    const ss = []
    bin.map(b => ss.push(String.fromCharCode(b)))
    return btoa(ss.join(''))
  }

  static decode(text) {
    const s = atob(text)
    const res = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) {
      res[i] = s.charCodeAt(i)
    }
    return res
  }
}

const bin2s = (bin, n, len) => {
  const b = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n]
  }
  return new TextDecoder().decode(b)
}
const bin2i = (bin, n) => {
  return ((bin[n] & 0xff) << 24) | ((bin[n + 1] & 0xff) << 16) | ((bin[n + 2] & 0xff) << 8) | (bin[n + 3] & 0xff)
}
const subbin = (bin, n, len) => {
  const b = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    b[i] = bin[i + n]
  }
  return b
}
const setbin = (bin, off, b) => {
  for (let i = 0; i < b.length; i++) {
    bin[i + off] = b[i]
  }
  return bin
}
const i2bin = (b, off, n) => {
  b[off] = (n >> 24) & 0xff
  b[off + 1] = (n >> 16) & 0xff
  b[off + 2] = (n >> 8) & 0xff
  b[off + 3] = n & 0xff
}
const s2bin = (bin, off, s) => {
  setbin(bin, off, new TextEncoder().encode(s))
}
const bincat = (bin1, bin2) => {
  const bin = new Uint8Array(bin1.length + bin2.length)
  for (let i = 0; i < bin1.length; i++) {
    bin[i] = bin1[i]
  }
  for (let i = 0; i < bin2.length; i++) {
    bin[i + bin1.length] = bin2[i]
  }
  return bin
}
const eqbin = (bin1, bin2) => {
  if (bin1 == bin2) {
    return true
  }
  if (!bin1 || !bin2) {
    return false
  }
  if (bin1.length != bin2.length) {
    return false
  }
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] != bin2[i]) {
      return false
    }
  }
  return true
}

const BEGIN = '-----BEGIN OPENSSH PRIVATE KEY-----'
const END = '-----END OPENSSH PRIVATE KEY-----'

/**
 * This function decodes a PEM (Privacy Enhanced Mail) string and returns an object containing the public and private key.
 *
 * @param {string} txt - The PEM string to decode.
 * @returns {Object} An object containing the public and private key, or null if the string could not be decoded.
 */
function decodePEM(txt) {
  const ss = txt.split('\n').map(s => s.trim())
  const ns = ss.indexOf(BEGIN)
  const ne = ss.indexOf(END)
  if (ns < 0 || ne < 0 || ns > ne) {
    return null
  }
  const bin = Base64.decode(ss.slice(ns + 1, ne).join(''))
  if (bin2s(bin, 0x2f, 11) != 'ssh-ed25519') {
    return null
  }
  if (bin2s(bin, 0x6e, 11) != 'ssh-ed25519') {
    return null
  }
  if (bin2i(bin, 0x3a) != 32) {
    return null
  }
  const publicKey = subbin(bin, 0x3e, 32)
  if (bin2i(bin, 0x9d) != 64) {
    return null
  }
  const privateKey = subbin(bin, 0xa1, 64)
  return { publicKey, privateKey }
}

/**
 * Splits a long string into multiple lines of a specified character limit
 * @param {string} str - The string to be split
 * @returns {string} The splitted string
 */
function splitLongStrings(str) {
  const charLimit = 70
  let splittedString = ''
  if (str.length > charLimit) {
    for (let i = 0; i < str.length; i++) {
      if (i % charLimit === 0) {
        splittedString += '\n'
      }
      splittedString += str[i]
    }
    return splittedString
  } else {
    return str
  }
}

/**
 * This function encodes a given set of keys in PEM format.
 *
 * @param {Object} keys An object containing the public and private keys.
 * @returns {String} A string representing the encoded PEM format.
 */
function encodePEM(keys) {
  const pem = `6f70656e7373682d6b65792d763100000000046e6f6e65000000046e6f6e650000000000000001000000330000000b7373682d6564323535313900000020${keys.publicKey}000000980ac771850ac771850000000b7373682d6564323535313900000020${keys.publicKey}00000040${keys.privateKey}${keys.publicKey}000000126d656c76696e406d656c76696e2d504e3632010203`

  return `${BEGIN}${splitLongStrings(hexToBase64(pem))}
${END}`
}

/**
 * Generates various keys and related information from a given private key using different algorithms.
 *
 * @param {string} privateKey - The private key to generate keys from.
 * @returns {Object} An object containing the generated keys and related information.
 * @property {string} privkey - The original private key.
 * @property {string} nsec - The nsec value for the private key.
 * @property {string} pubkey - The public key generated from the private key.
 * @property {string} pubkeycompressed - The compressed public key generated from the private key.
 * @property {string} npub - The npub value for the public key.
 * @property {string} nrepo - The nrepo value for the public key.
 * @property {string} taproot - The taproot address generated from the public key.
 * @property {string} taproottestnet - The taproot testnet address generated from the public key.
 * @property {string} liquidtaproot - The liquid taproot address generated from the public key.
 * @property {string} ed25519pubkey - The ed25519 public key generated from the private key.
 * @property {string} openSSHed25519pubkey - The OpenSSH ed25519 public key generated from the private key.
 * @property {string} openSSHed25519privkey - The OpenSSH ed25519 private key generated from the private key.
 */
function getAllKeys(privateKey) {
  const ed25519_prefix = '0000000b7373682d6564323535313900000020'
  const ed25519_ssh_prefix = 'ssh-ed25519'
  const taproot_prefix = 'bc'
  const taproot_testnet_prefix = 'tb'
  const liquid_prefix = 'ex'
  const litecoin_prefix = 'ltc'
  const vertcoin_prefix = 'vtc'

  const publicKey = getPublicKey(privateKey)
  const npub = nip19(publicKey, 'npub')
  const nrepo = nip19(publicKey, 'nrepo')
  // console.log(npub)

  // const ECPair = ECPairFactory(tiny)
  // const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  // let wif = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
  // let wifTestnet = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TESTNET })

  // console.log(keyPair.publicKey)
  const ed25519pubkey = generate_public_key(privateKey)
  // const p = tiny.pointFromScalar(Buffer.from(privateKey, 'hex'))
  // var compressed = bufferToHex(p)
  const compressed = getPublicKey(privateKey)
  const privkeyPEM = encodePEM({ publicKey: ed25519pubkey, privateKey: privateKey })

  const output = {
    privkey: privateKey,
    nsec: nip19(privateKey, 'nsec'),
    pubkey: publicKey,
    pubkeycompressed: compressed,
    // bitcoinPubkey: wif.address,
    // bitcoinTestnet3Pubkey: wifTestnet.address,
    npub: npub,
    nrepo: nrepo,
    taproot: encodeBytes(taproot_prefix, publicKey),
    taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
    liquidtaproot: encodeBytes(liquid_prefix, publicKey),
    litecointaproot: encodeBytes(litecoin_prefix, publicKey),
    vertcointaproot: encodeBytes(vertcoin_prefix, publicKey),
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
  decodeBytes,
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
