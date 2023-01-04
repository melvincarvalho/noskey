#!/usr/bin/env node

const {
	generatePrivateKey,
	getPublicKey
} = require("nostr-tools");
const _sodium = require('libsodium-wrappers');

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

while (true) {
	let privateKey = generatePrivateKey();
	let publicKey = getPublicKey(privateKey);

	if (publicKey.startsWith(vanity)) {
		var output = {
			privkey: privateKey,
			pubkey: publicKey
		}

		console.log(JSON.stringify(output, null, 2))

		break;
	}
}






