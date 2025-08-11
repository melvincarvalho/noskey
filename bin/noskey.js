#!/usr/bin/env node

async function main() {
	console.log('noskey starting...')

	// IMPORTS
	try {
		var { generatePrivateKey } = await import('nostr-tools')
		var { getAllKeys, decodeBytes } = await import('../lib/index.js')
		var yargs = (await import('yargs')).default
		var { hideBin } = await import('yargs/helpers')
		console.log('All imports successful')
	} catch (error) {
		console.error('Import error:', error)
		process.exit(1)
	}

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

	// If no specific key provided and no vanity requirements, just generate one key
	if (!nsec && !argv.p && !vanity && !npubvanity) {
		console.log('Generating single key...')
		try {
			const privateKey = generatePrivateKey()
			console.log('Private key generated:', privateKey.slice(0, 8) + '...')
			const output = getAllKeys(privateKey)
			console.log('Keys processed, outputting...')
			console.log(JSON.stringify(output, null, 2))
			console.log('Done!')
		} catch (error) {
			console.error('Error generating key:', error)
		}
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
}

main().catch(error => {
	console.error('Fatal error:', error)
	process.exit(1)
})
