// Browser entry: wires the faithful derivation core to the same library
// versions the CLI uses, imported as ESM (zero build step). Verified to match
// `node bin/noskey.js` exactly — see test/verify-core.js.
import * as secp from "https://esm.sh/@noble/secp256k1@1.7.1";
import nacl from "https://esm.sh/tweetnacl@1.0.3";
import { bech32, bech32m } from "https://esm.sh/bech32@2.0.0";
import { HDKey } from "https://esm.sh/@scure/bip32@1.1.4";
import { sha256 } from "https://esm.sh/@noble/hashes@1.2.0/sha256";
import { sha512 } from "https://esm.sh/@noble/hashes@1.2.0/sha512";
import { pbkdf2 } from "https://esm.sh/@noble/hashes@1.2.0/pbkdf2";
import { entropyToMnemonic } from "https://esm.sh/@scure/bip39@1.1.1";
import { wordlist } from "https://esm.sh/@scure/bip39@1.1.1/wordlists/english";
import { createNoskey } from "./noskey-core.js";

export const noskey = createNoskey({
  secp, nacl, bech32, bech32m, HDKey, sha256, pbkdf2, sha512, entropyToMnemonic, wordlist,
});
