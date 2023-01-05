#!/usr/bin/env node

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


// require yargs
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

// console.log(argv)

function encodeBytes(prefix, hex) {
	let data = secp256k1.utils.hexToBytes(hex)
	let words = bech32.toWords(data)
	return bech32.encode(prefix, words, 1500)
}

var vanity = argv.v || ''

const hexToBuffer = hex => Buffer.from(hex, 'hex');

function generate_public_key(privKey) {
	return ed25519.MakeKeypair(hexToBuffer(privKey)).publicKey.toString('hex');
}

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
			ed25519pubkey: ed25519pubkey
		}

		console.log(JSON.stringify(output, null, 2))

		break;
	}
}






