#!/usr/bin/env node

const {
	generatePrivateKey,
	getPublicKey
} = require("nostr-tools");

let privateKey = generatePrivateKey();
let publicKey = getPublicKey(privateKey);

var output = {
	privkey: privateKey,
	pubkey: publicKey
}

console.log(JSON.stringify(output, null, 2))
