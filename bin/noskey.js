#!/usr/bin/env node

const {
	generatePrivateKey,
	getPublicKey
} = require("nostr-tools");
const ed25519 = require('ed25519');

// require yargs
const argv = require('yargs')
	.usage('Usage: $0 [options]')
	.option('v', {
		alias: 'vanity',
		describe: 'Vanity string',
		type: 'string'
	})
	.help('h')
	.alias('h', 'help')
	.argv;

// console.log(argv)

var vanity = argv.v || ''

const hexToBuffer = hex => Buffer.from(hex, 'hex');
function generate_public_key(privKey) {
	return ed25519.MakeKeypair(hexToBuffer(privKey)).publicKey.toString('hex');
}

while (true) {
	let privateKey = generatePrivateKey();
	let publicKey = getPublicKey(privateKey);

	if (publicKey.startsWith(vanity)) {
		var ed25519pubkey = generate_public_key(privateKey)

		var output = {
			privkey: privateKey,
			pubkey: publicKey,
			ed25519pubkey: ed25519pubkey
		}

		console.log(JSON.stringify(output, null, 2))

		break;
	}
}






