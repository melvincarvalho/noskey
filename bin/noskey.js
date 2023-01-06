#!/usr/bin/env node

// IMPORTS
const {
	generatePrivateKey,
	getPublicKey,
	nip19
} = require("nostr-tools");
const
	secp256k1
		= require("@noble/secp256k1");
const {
	bech32,
} = require("@scure/base");
const ed25519 = require('ed25519');

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

// MAIN
while (true) {
	var privateKey = argv.p || generatePrivateKey()
	let publicKey = getPublicKey(privateKey);

	if (publicKey.startsWith(vanity)) {
		var ed25519pubkey = generate_public_key(privateKey)

		var output = {
			privkey: privateKey,
			nsec: nip19.nsecEncode(privateKey),
			pubkey: publicKey,
			npub: nip19.npubEncode(publicKey),
			taproot: encodeBytes('bc1p', publicKey),
			taproottestnet: encodeBytes('tb1p', publicKey),
			ed25519pubkey: ed25519pubkey,
			openSSHed25519pubkey: `ssh-ed25519 ${hexToBase64(ed25519_prefix + ed25519pubkey)}`
		}

		console.log(JSON.stringify(output, null, 2))

		break;
	}
}






