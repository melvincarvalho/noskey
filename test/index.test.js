import { test, describe } from 'node:test'
import assert from 'node:assert'
import {
  encodeBytes,
  decodeBytes,
  hexToBuffer,
  bufferToHex,
  generate_public_key,
  hexToBase64,
  decodePEM,
  getAllKeys,
  getPublicKey,
  generateBIP39Mnemonic,
  mnemonicToSeed,
  generateBIP86Keys
} from '../lib/index.js'

// Test vectors with known private keys and expected outputs
const TEST_VECTORS = {
  // Private key: 1 (32 bytes, zero-padded)
  key1: {
    privkey: '0000000000000000000000000000000000000000000000000000000000000001',
    pubkey: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    nsec: 'nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsmhltgl',
    npub: 'npub10xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqpkge6d',
    taproot: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
    taproottestnet: 'tb1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vq47zagq',
    ed25519pubkey: '4cb5abf6ad79fbf5abbccafcc269d85cd2651ed4b885b5869f241aedf0a5ba29',
    mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon diesel',
    bip86_tprv: 'tprv8gZA5YUMsfaf5pWUTrWBDAhpKkEvhz9FMmYQCgb7vQr3V8PFprU2yh2zu7TtKYojSky3VA5ghfzLR2o5MGzdTfZJEVJ812w7xtsM9AngvTv',
    bip86_tpub: 'tpubDDFCDxWc23GKyHYGMWAmcaMvtmkrsKL9w59BVCdRLgeSKce2TFHdABes5DZBLNA8d62TgAEUFivv7W49ZGsdEPRKvuurDZJ8yiiYnGoJ8gs'
  },
  // Private key: deadbeef repeated
  key2: {
    privkey: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    pubkey: 'c6b754b20826eb925e052ee2c25285b162b51fdca732bcf67e39d647fb6830ae',
    nsec: 'nsec1m6kmam774klwlh4dhmhaatd7al02m0h0m6kmam774klwlh4dhmhsn0fay6',
    npub: 'npub1c6m4fvsgym4eyhs99m3vy559k93t287u5uetean788ty07mgxzhqgnrguu',
    taproot: 'bc1pc6m4fvsgym4eyhs99m3vy559k93t287u5uetean788ty07mgxzhqtnlr57',
    ed25519pubkey: 'ff57575dc7af8bfc4d0837cc1ce2017b686a88145dc5579a958e3462fe9a908e',
    mnemonic: 'team hospital room run swim jewel kingdom result used voice hurry text turn term satoshi stick same leave problem lava worth fine wing utility'
  }
}

// ============================================================================
// CRITICAL TESTS - Functions affected by vulnerable dependencies
// These use sha.js, cipher-base, and base-x indirectly
// ============================================================================

describe('Critical: generateBIP39Mnemonic (sha.js dependency)', () => {
  test('generates correct 24-word mnemonic for 256-bit entropy', () => {
    const mnemonic = generateBIP39Mnemonic(TEST_VECTORS.key1.privkey)
    assert.strictEqual(mnemonic, TEST_VECTORS.key1.mnemonic)
  })

  test('generates correct mnemonic for different private key', () => {
    const mnemonic = generateBIP39Mnemonic(TEST_VECTORS.key2.privkey)
    assert.strictEqual(mnemonic, TEST_VECTORS.key2.mnemonic)
  })

  test('mnemonic has 24 words for 256-bit key', () => {
    const mnemonic = generateBIP39Mnemonic(TEST_VECTORS.key1.privkey)
    const words = mnemonic.split(' ')
    assert.strictEqual(words.length, 24)
  })

  test('generates 12-word mnemonic for 128-bit entropy', () => {
    const shortKey = '00000000000000000000000000000001'
    const mnemonic = generateBIP39Mnemonic(shortKey)
    const words = mnemonic.split(' ')
    assert.strictEqual(words.length, 12)
  })
})

describe('Critical: generateBIP86Keys (bip32/cipher-base dependency)', () => {
  test('generates correct tprv for known mnemonic', () => {
    const keys = generateBIP86Keys(TEST_VECTORS.key1.mnemonic)
    assert.strictEqual(keys.tprv, TEST_VECTORS.key1.bip86_tprv)
  })

  test('generates correct tpub for known mnemonic', () => {
    const keys = generateBIP86Keys(TEST_VECTORS.key1.mnemonic)
    assert.strictEqual(keys.tpub, TEST_VECTORS.key1.bip86_tpub)
  })

  test('generates valid P2TR testnet address', () => {
    const keys = generateBIP86Keys(TEST_VECTORS.key1.mnemonic)
    assert.ok(keys.p2tr_address.startsWith('tb1p'), 'P2TR address should start with tb1p')
  })

  test('different mnemonics produce different keys', () => {
    const keys1 = generateBIP86Keys(TEST_VECTORS.key1.mnemonic)
    const keys2 = generateBIP86Keys(TEST_VECTORS.key2.mnemonic)
    assert.notStrictEqual(keys1.tprv, keys2.tprv)
    assert.notStrictEqual(keys1.tpub, keys2.tpub)
  })
})

describe('Critical: encodeBytes/decodeBytes (bech32m/base-x dependency)', () => {
  test('encodes pubkey to taproot address correctly', () => {
    const taproot = encodeBytes('bc', TEST_VECTORS.key1.pubkey)
    assert.strictEqual(taproot, TEST_VECTORS.key1.taproot)
  })

  test('encodes pubkey to testnet taproot correctly', () => {
    const taproot = encodeBytes('tb', TEST_VECTORS.key1.pubkey)
    assert.strictEqual(taproot, TEST_VECTORS.key1.taproottestnet)
  })

  test('encodes second test vector correctly', () => {
    const taproot = encodeBytes('bc', TEST_VECTORS.key2.pubkey)
    assert.strictEqual(taproot, TEST_VECTORS.key2.taproot)
  })

  test('decodeBytes recovers original nsec hex', () => {
    const decoded = decodeBytes(TEST_VECTORS.key1.nsec)
    assert.strictEqual(decoded, TEST_VECTORS.key1.privkey)
  })
})

// ============================================================================
// CORE FUNCTION TESTS
// ============================================================================

describe('Core: getPublicKey', () => {
  test('derives correct public key from private key', () => {
    const pubkey = getPublicKey(TEST_VECTORS.key1.privkey)
    assert.strictEqual(pubkey, TEST_VECTORS.key1.pubkey)
  })

  test('derives correct public key for second test vector', () => {
    const pubkey = getPublicKey(TEST_VECTORS.key2.privkey)
    assert.strictEqual(pubkey, TEST_VECTORS.key2.pubkey)
  })

  test('public key is 64 hex characters (32 bytes)', () => {
    const pubkey = getPublicKey(TEST_VECTORS.key1.privkey)
    assert.strictEqual(pubkey.length, 64)
    assert.match(pubkey, /^[0-9a-f]{64}$/)
  })
})

describe('Core: getAllKeys', () => {
  test('returns all expected key formats', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)

    assert.strictEqual(keys.privkey, TEST_VECTORS.key1.privkey)
    assert.strictEqual(keys.pubkey, TEST_VECTORS.key1.pubkey)
    assert.strictEqual(keys.nsec, TEST_VECTORS.key1.nsec)
    assert.strictEqual(keys.npub, TEST_VECTORS.key1.npub)
    assert.strictEqual(keys.taproot, TEST_VECTORS.key1.taproot)
    assert.strictEqual(keys.ed25519pubkey, TEST_VECTORS.key1.ed25519pubkey)
    assert.strictEqual(keys.mnemonic, TEST_VECTORS.key1.mnemonic)
  })

  test('includes DID nostr identifier', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)
    assert.strictEqual(keys.didnostr, `did:nostr:${TEST_VECTORS.key1.pubkey}`)
  })

  test('includes compressed public key', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)
    assert.ok(keys.pubkeycompressed.startsWith('02') || keys.pubkeycompressed.startsWith('03'))
    assert.strictEqual(keys.pubkeycompressed.length, 66) // 33 bytes = 66 hex chars
  })

  test('includes OpenSSH keys', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)
    assert.ok(keys.openSSHed25519pubkey.startsWith('ssh-ed25519 '))
    assert.ok(keys.openSSHed25519privkey.includes('-----BEGIN OPENSSH PRIVATE KEY-----'))
    assert.ok(keys.openSSHed25519privkey.includes('-----END OPENSSH PRIVATE KEY-----'))
  })
})

// ============================================================================
// PEM ENCODING/DECODING TESTS
// ============================================================================

describe('PEM: encodePEM/decodePEM', () => {
  test('round-trip encode and decode preserves keys', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)
    const pem = keys.openSSHed25519privkey
    const decoded = decodePEM(pem)

    assert.ok(decoded !== null, 'decodePEM should return non-null')
    assert.strictEqual(
      bufferToHex(decoded.publicKey),
      TEST_VECTORS.key1.ed25519pubkey
    )
  })

  test('encoded PEM has correct format', () => {
    const keys = getAllKeys(TEST_VECTORS.key1.privkey)
    const pem = keys.openSSHed25519privkey

    assert.ok(pem.includes('-----BEGIN OPENSSH PRIVATE KEY-----'))
    assert.ok(pem.includes('-----END OPENSSH PRIVATE KEY-----'))
  })

  test('decodePEM returns null for invalid input', () => {
    const result = decodePEM('not a valid pem')
    assert.strictEqual(result, null)
  })
})

// ============================================================================
// UTILITY FUNCTION TESTS
// ============================================================================

describe('Utilities: hexToBuffer/bufferToHex', () => {
  test('hexToBuffer converts hex string to buffer', () => {
    const buffer = hexToBuffer('deadbeef')
    assert.ok(Buffer.isBuffer(buffer))
    assert.strictEqual(buffer.length, 4)
  })

  test('bufferToHex converts buffer to hex string', () => {
    const buffer = Buffer.from([0xde, 0xad, 0xbe, 0xef])
    const hex = bufferToHex(buffer)
    assert.strictEqual(hex, 'deadbeef')
  })

  test('round-trip preserves data', () => {
    const original = 'cafebabe12345678'
    const buffer = hexToBuffer(original)
    const hex = bufferToHex(buffer)
    assert.strictEqual(hex, original)
  })
})

describe('Utilities: hexToBase64', () => {
  test('converts hex to base64 correctly', () => {
    const base64 = hexToBase64('deadbeef')
    assert.strictEqual(base64, '3q2+7w==')
  })
})

describe('Utilities: generate_public_key (Ed25519)', () => {
  test('generates ed25519 public key from private key', () => {
    const pubkey = generate_public_key(TEST_VECTORS.key1.privkey)
    assert.strictEqual(pubkey, TEST_VECTORS.key1.ed25519pubkey)
  })

  test('generates different pubkey for different privkey', () => {
    const pubkey = generate_public_key(TEST_VECTORS.key2.privkey)
    assert.strictEqual(pubkey, TEST_VECTORS.key2.ed25519pubkey)
  })
})

describe('Utilities: mnemonicToSeed', () => {
  test('generates 64-byte seed from mnemonic', () => {
    const seed = mnemonicToSeed(TEST_VECTORS.key1.mnemonic)
    assert.strictEqual(seed.length, 64)
  })

  test('same mnemonic produces same seed', () => {
    const seed1 = mnemonicToSeed(TEST_VECTORS.key1.mnemonic)
    const seed2 = mnemonicToSeed(TEST_VECTORS.key1.mnemonic)
    assert.deepStrictEqual(seed1, seed2)
  })

  test('passphrase changes the seed', () => {
    const seed1 = mnemonicToSeed(TEST_VECTORS.key1.mnemonic, '')
    const seed2 = mnemonicToSeed(TEST_VECTORS.key1.mnemonic, 'password')
    assert.notDeepStrictEqual(seed1, seed2)
  })
})
