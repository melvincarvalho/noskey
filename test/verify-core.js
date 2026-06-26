// Verifies assets/noskey-core.js produces byte-identical output to the CLI.
// Run: node test/verify-core.js
import { createNoskey } from "../web/assets/noskey-core.js";
import * as secp from "@noble/secp256k1";
import nacl from "tweetnacl";
import { bech32, bech32m } from "bech32";
import { HDKey } from "@scure/bip32";
import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from "@noble/hashes/sha512";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { entropyToMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { execFileSync } from "node:child_process";

const noskey = createNoskey({
  secp, nacl, bech32, bech32m, HDKey, sha256, pbkdf2, sha512, entropyToMnemonic, wordlist,
});

const KEYS = [
  "096267c08957fe0a83399d3e6be45fb283aefed6487fac55350d828142362f68",
  "0000000000000000000000000000000000000000000000000000000000000001",
  "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140", // n-1, max valid
];

let failures = 0;
for (const key of KEYS) {
  const cliRaw = execFileSync("node", ["bin/noskey.js", "-p", key], { encoding: "utf8" });
  const cli = JSON.parse(cliRaw);
  const web = noskey.getAllKeys(key);

  const fields = new Set([...Object.keys(cli), ...Object.keys(web)]);
  const mismatches = [];
  for (const f of fields) {
    if (cli[f] !== web[f]) mismatches.push({ field: f, cli: cli[f], web: web[f] });
  }

  if (mismatches.length === 0) {
    console.log(`PASS  ${key.slice(0, 12)}…  (${fields.size} fields match)`);
  } else {
    failures++;
    console.log(`FAIL  ${key.slice(0, 12)}…`);
    for (const m of mismatches) {
      console.log(`   ${m.field}\n     cli: ${m.cli}\n     web: ${m.web}`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} key(s) mismatched the CLI.`);
  process.exit(1);
}
console.log("\nAll keys match the CLI exactly. ✅");
