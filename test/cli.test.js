import { test, describe } from 'node:test'
import assert from 'node:assert'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLI_PATH = join(__dirname, '..', 'bin', 'noskey.js')

function runCLI(args = '') {
  const command = `node ${CLI_PATH} ${args}`
  let result

  try {
    result = execSync(command, { encoding: 'utf-8' })
  } catch (error) {
    const stdout = error && error.stdout ? error.stdout : ''
    const stderr = error && error.stderr ? error.stderr : ''

    assert.fail(
      [
        'CLI command failed.',
        `Command: ${command}`,
        stdout ? `STDOUT:\n${stdout}` : '',
        stderr ? `STDERR:\n${stderr}` : '',
        `Error: ${error.message}`
      ].filter(Boolean).join('\n')
    )
  }

  try {
    return JSON.parse(result)
  } catch (parseError) {
    assert.fail(
      [
        'Failed to parse CLI JSON output.',
        `Command: ${command}`,
        `Output: ${result}`,
        `Error: ${parseError.message}`
      ].join('\n')
    )
  }
}

// Test vectors
const TEST_KEY = '0000000000000000000000000000000000000000000000000000000000000001'
const TEST_NSEC = 'nsec1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsmhltgl'
const EXPECTED_PUBKEY = '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'

describe('CLI: Basic functionality', () => {
  test('generates random key when no arguments provided', () => {
    const output = runCLI()

    assert.ok(output.privkey, 'should have privkey')
    assert.ok(output.pubkey, 'should have pubkey')
    assert.ok(output.nsec, 'should have nsec')
    assert.ok(output.npub, 'should have npub')
    assert.strictEqual(output.privkey.length, 64, 'privkey should be 64 hex chars')
    assert.strictEqual(output.pubkey.length, 64, 'pubkey should be 64 hex chars')
  })

  test('accepts private key via -p flag', () => {
    const output = runCLI(`-p ${TEST_KEY}`)

    assert.strictEqual(output.privkey, TEST_KEY)
    assert.strictEqual(output.pubkey, EXPECTED_PUBKEY)
  })

  test('accepts nsec via -s flag', () => {
    const output = runCLI(`-s ${TEST_NSEC}`)

    assert.strictEqual(output.privkey, TEST_KEY)
    assert.strictEqual(output.pubkey, EXPECTED_PUBKEY)
  })
})

describe('CLI: Output format', () => {
  test('outputs valid JSON', () => {
    const output = runCLI(`-p ${TEST_KEY}`)

    // Should have all expected fields
    const expectedFields = [
      'privkey', 'nsec', 'pubkey', 'didnostr', 'pubkeycompressed',
      'npub', 'taproot', 'taproottestnet', 'liquidtaproot',
      'ed25519pubkey', 'pubky', 'mnemonic', 'bip86_tprv', 'bip86_tpub',
      'bip86_p2tr', 'openSSHed25519pubkey', 'openSSHed25519privkey'
    ]

    for (const field of expectedFields) {
      assert.ok(field in output, `output should have ${field}`)
    }
  })

  test('taproot addresses have correct prefixes', () => {
    const output = runCLI(`-p ${TEST_KEY}`)

    assert.ok(output.taproot.startsWith('bc1p'), 'mainnet taproot should start with bc1p')
    assert.ok(output.taproottestnet.startsWith('tb1p'), 'testnet taproot should start with tb1p')
    assert.ok(output.liquidtaproot.startsWith('ex1p'), 'liquid taproot should start with ex1p')
  })

  test('OpenSSH keys have correct format', () => {
    const output = runCLI(`-p ${TEST_KEY}`)

    assert.ok(output.openSSHed25519pubkey.startsWith('ssh-ed25519 '))
    assert.ok(output.openSSHed25519privkey.includes('-----BEGIN OPENSSH PRIVATE KEY-----'))
  })
})

describe('CLI: Deterministic output', () => {
  test('same private key produces same output', () => {
    const output1 = runCLI(`-p ${TEST_KEY}`)
    const output2 = runCLI(`-p ${TEST_KEY}`)

    assert.deepStrictEqual(output1, output2)
  })

  test('same nsec produces same output', () => {
    const output1 = runCLI(`-s ${TEST_NSEC}`)
    const output2 = runCLI(`-s ${TEST_NSEC}`)

    assert.deepStrictEqual(output1, output2)
  })

  test('-p and -s with equivalent keys produce same output', () => {
    const outputP = runCLI(`-p ${TEST_KEY}`)
    const outputS = runCLI(`-s ${TEST_NSEC}`)

    assert.deepStrictEqual(outputP, outputS)
  })
})
