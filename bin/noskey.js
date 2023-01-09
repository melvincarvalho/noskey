#!/usr/bin/env node

// IMPORTS
const { generatePrivateKey, getPublicKey, nip19 } = require('nostr-tools')
const {
	encodeBytes,
	generate_public_key,
	hexToBase64,
	bufferToHex,
	encodePEM
} = require('../lib/index.js')
const tiny = require('tiny-secp256k1')
const bitcoin = require('bitcoinjs-lib')
const TESTNET = bitcoin.networks.testnet;
const { ECPairFactory } = require('ecpair');
const { encode } = require('bitcoinjs-lib/src/script_number.js');

// args
const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.option('v', {
		alias: 'vanity',
		describe: 'Vanity string',
		type: 'string'
	})
	.option('p', {
		alias: 'priv',
		describe: 'Private key',
		type: 'string'
	})
	.help('h')
	.alias('h', 'help').argv

// INIT
// console.log(argv)
var vanity = argv.v || ''
const ECPair = ECPairFactory(tiny)

const ed25519_prefix = '0000000b7373682d6564323535313900000020'
const ed25519_ssh_prefix = 'ssh-ed25519'
const taproot_prefix = 'bc1p'
const taproot_testnet_prefix = 'tb1p'

// MAIN
while (true) {
	var privateKey = argv.p || generatePrivateKey()
	let publicKey = getPublicKey(privateKey)
	let npub = nip19.npubEncode(publicKey)
	// console.log(npub)

	const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
	let wif = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
	let wifTestnet = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: TESTNET })

	// console.log(keyPair.publicKey)

	if (publicKey.startsWith(vanity)) {
		var ed25519pubkey = generate_public_key(privateKey)
		const p = tiny.pointFromScalar(Buffer.from(privateKey, 'hex'))
		var compressed = bufferToHex(p)
		var privkeyPEM = encodePEM(({ publicKey: publicKey, privateKey: privateKey }))

		var output = {
			privkey: privateKey,
			nsec: nip19.nsecEncode(privateKey),
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

		console.log(JSON.stringify(output, null, 2))

		break
	}
}
