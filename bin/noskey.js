#!/usr/bin/env node
// Force explicit stdout flushing
process.stdout.write('noskey starting...\n')

// IMPORTS
import { generatePrivateKey } from 'nostr-tools'
import {
	getAllKeys,
	decodeBytes
} from '../lib/index.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

console.log('noskey: imports loaded')

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

console.log('noskey: args parsed')

// INIT
// console.log(argv)
const vanity = argv.v || ''
const npubvanity = argv.n || ''
const nsec = argv.s

// If no specific key provided and no vanity requirements, just generate one key
if (!nsec && !argv.p && !vanity && !npubvanity) {
	console.log('noskey: generating single key')
	const privateKey = generatePrivateKey()
	console.log('noskey: calling getAllKeys')
	const output = getAllKeys(privateKey)
	console.log(JSON.stringify(output, null, 2))
	process.exit(0)
}

console.log('noskey: entering vanity loop')

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
