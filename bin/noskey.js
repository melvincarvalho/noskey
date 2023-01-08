#!/usr/bin/env node

// IMPORTS
const {
	generatePrivateKey,
	getPublicKey,
	nip19
} = require("nostr-tools");
const {
	encodeBytes,
	generate_public_key,
	hexToBase64,
	bufferToHex
} = require('../lib/index.js');
const tiny = require('tiny-secp256k1')


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
	.alias('h', 'help')
	.argv;

// INIT
// console.log(argv)
var vanity = argv.v || ''

const ed25519_prefix = '0000000b7373682d6564323535313900000020'
const ed25519_ssh_prefix = 'ssh-ed25519'
const taproot_prefix = 'bc1p'
const taproot_testnet_prefix = 'tb1p'

// MAIN
while (true) {
	var privateKey = argv.p || generatePrivateKey()
	let publicKey = getPublicKey(privateKey);
	let npub = nip19.npubEncode(publicKey)
	// console.log(npub)

	if (publicKey.startsWith(vanity)) {
		var ed25519pubkey = generate_public_key(privateKey)
		const p = tiny.pointFromScalar(Buffer.from(privateKey, 'hex'))
		var compressed = bufferToHex(p)

		var output = {
			privkey: privateKey,
			nsec: nip19.nsecEncode(privateKey),
			pubkey: publicKey,
			pubkeycompressed: compressed,
			npub: npub,
			taproot: encodeBytes(taproot_prefix, publicKey),
			taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
			ed25519pubkey: ed25519pubkey,
			openSSHed25519pubkey: `${ed25519_ssh_prefix} ${hexToBase64(ed25519_prefix + ed25519pubkey)}`
		}

		console.log(JSON.stringify(output, null, 2))

		break;
	}
}






