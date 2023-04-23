#!/usr/bin/env node

// IMPORTS
import { generatePrivateKey } from 'nostr-tools'
import {
	getAllKeys,
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
	.help('h')
	.alias('h', 'help').argv

// INIT
// console.log(argv)
const vanity = argv.v || ''
const npubvanity = argv.n || ''
const nsec = argv.s

// MAIN
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
