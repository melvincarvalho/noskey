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

// --- pubkey-only mode: web core vs CLI --pub, and consistency with getAllKeys
for (const key of KEYS) {
  const all = noskey.getAllKeys(key);

  // web core vs CLI --pub (fed the derived pubkey, as hex and as npub)
  for (const pubInput of [all.pubkey, all.npub]) {
    const cli = JSON.parse(execFileSync("node", ["bin/noskey.js", "--pub", pubInput], { encoding: "utf8" }));
    const web = noskey.getPubKeys(all.pubkey);
    const fields = new Set([...Object.keys(cli), ...Object.keys(web)]);
    const bad = [...fields].filter((f) => cli[f] !== web[f]);
    if (bad.length) {
      failures++;
      console.log(`FAIL  --pub ${pubInput.slice(0, 14)}…  mismatched: ${bad.join(", ")}`);
    } else {
      console.log(`PASS  --pub ${pubInput.slice(0, 14)}…  (${fields.size} fields match)`);
    }
  }

  // every getPubKeys field must equal the same field in getAllKeys
  const pub = noskey.getPubKeys(all.pubkey);
  const drift = Object.keys(pub).filter((f) => pub[f] !== all[f]);
  if (drift.length) {
    failures++;
    console.log(`FAIL  getPubKeys drift vs getAllKeys: ${drift.join(", ")}`);
  }
}

// --- getPubKeys input validation: uppercase normalizes, junk throws
{
  const all = noskey.getAllKeys(KEYS[0]);
  const upper = noskey.getPubKeys(all.pubkey.toUpperCase());
  if (upper.npub !== all.npub) {
    failures++;
    console.log("FAIL  uppercase pubkey not normalized");
  } else {
    console.log("PASS  uppercase pubkey normalized");
  }
  for (const junk of ["beef", all.pubkey + "00", "z".repeat(64)]) {
    try {
      noskey.getPubKeys(junk);
      failures++;
      console.log(`FAIL  getPubKeys accepted invalid input: ${junk.slice(0, 20)}`);
    } catch {
      console.log(`PASS  getPubKeys rejects ${junk.slice(0, 20)}`);
    }
  }
}

if (failures) {
  console.error(`\n${failures} check(s) mismatched the CLI.`);
  process.exit(1);
}
console.log("\nAll keys match the CLI exactly. ✅");
