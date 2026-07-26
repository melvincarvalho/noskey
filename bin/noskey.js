#!/usr/bin/env node

// IMPORTS
import { generatePrivateKey } from 'nostr-tools'
import {
	getAllKeys,
	getPubKeys,
	decodeBytes
} from '../lib/index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// args
const yarg = yargs(hideBin(process.argv))

// console.log(yargs)
const argv = yarg
	.usage('Usage: $0 [options]')
	.option('v', {
		alias: 'vanity',
		describe: 'Vanity string',
		type: 'string'
	})
	.option('n', {
		alias: 'npub',
		describe: 'npub Vanity string',
		type: 'string'
	})
	.option('p', {
		alias: 'priv',
		describe: 'Private key',
		type: 'string'
	})
	.option('s', {
		alias: 'nsec',
		describe: 'nsec private key',
		type: 'string'
	})
	.option('pub', {
		describe: 'Public key (hex or npub) — output only publicly derivable fields',
		type: 'string'
	})
	.help('h')
	.alias('h', 'help').argv

// INIT
// console.log(argv)
const vanity = argv.v || ''
const npubvanity = argv.n || ''
const nsec = argv.s

// Public-key-only mode: output the subset derivable without a private key
if (argv.pub) {
	try {
		const publicKey = argv.pub.startsWith('npub1') ? decodeBytes(argv.pub) : argv.pub
		console.log(JSON.stringify(getPubKeys(publicKey), null, 2))
		process.exit(0)
	} catch (error) {
		console.error(error.message)
		process.exit(1)
	}
}

// If no specific key provided and no vanity requirements, just generate one key
if (!nsec && !argv.p && !vanity && !npubvanity) {
	const privateKey = generatePrivateKey()
	const output = getAllKeys(privateKey)
	console.log(JSON.stringify(output, null, 2))
	process.exit(0)
}

// MAIN - for vanity generation or specific key processing
while (true) {
	var privateKey
	if (nsec) {
		privateKey = decodeBytes(nsec)
	} else if (argv.p) {
		privateKey = argv.p
	} else {
		privateKey = generatePrivateKey()
	}
	const output = getAllKeys(privateKey)

	const npub_prefix = 'npub1'
	if (output.pubkey.startsWith(vanity) && output.npub.slice(npub_prefix.length).startsWith(npubvanity)) {
		console.log(JSON.stringify(output, null, 2))
		break
	}
}
