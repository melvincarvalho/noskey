// noskey-core.js
//
// Faithful browser port of the noskey CLI's lib/index.js `getAllKeys()`.
//
// The pure derivation logic lives here; the cryptographic primitives are
// INJECTED via `createNoskey(deps)`. This lets the exact same logic run:
//   - in the browser, with libs imported from a pinned ESM CDN, and
//   - in Node (test/verify-core.js), with libs from local node_modules,
// so we can prove the output matches `node bin/noskey.js` byte-for-byte.
//
// deps = {
//   secp,            // @noble/secp256k1 (v1.7.x: schnorr, Point, utils, CURVE)
//   nacl,            // tweetnacl (sign.keyPair.fromSeed)
//   bech32, bech32m, // from 'bech32'
//   HDKey,           // @scure/bip32
//   sha256,          // @noble/hashes/sha256
//   pbkdf2, sha512,  // @noble/hashes/pbkdf2 + /sha512
//   entropyToMnemonic, wordlist, // @scure/bip39 (+ english wordlist)
// }

export function createNoskey(deps) {
  const { secp, nacl, bech32, bech32m, HDKey, sha256, pbkdf2, sha512, entropyToMnemonic, wordlist } = deps;

  const enc = new TextEncoder();
  const utf8 = (s) => enc.encode(s);

  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  function bytesToHex(bytes) {
    let out = "";
    for (const b of bytes) out += b.toString(16).padStart(2, "0");
    return out;
  }

  function bytesToBase64(bytes) {
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  }

  // hex string -> base64 (matches lib's hexToBase64)
  const hexToBase64 = (hex) => bytesToBase64(hexToBytes(hex));

  function concatBytes(...arrs) {
    let len = 0;
    for (const a of arrs) len += a.length;
    const out = new Uint8Array(len);
    let off = 0;
    for (const a of arrs) { out.set(a, off); off += a.length; }
    return out;
  }

  // ---- z-base-32 (pubky) -------------------------------------------------
  // Verbatim from lib/index.js
  function z32Encode(hexData) {
    const alphabet = "ybndrfg8ejkmcpqxot1uwisza345h769";
    const data = hexToBytes(hexData);
    let buffer = 0;
    let bitsLeft = 0;
    let output = "";
    for (const byte of data) {
      buffer = (buffer << 8) | byte;
      bitsLeft += 8;
      while (bitsLeft >= 5) {
        bitsLeft -= 5;
        output += alphabet[(buffer >> bitsLeft) & 0x1f];
      }
    }
    if (bitsLeft > 0) {
      output += alphabet[(buffer << (5 - bitsLeft)) & 0x1f];
    }
    return output;
  }

  // schnorr (x-only) public key, hex
  function getPublicKey(privateKeyHex) {
    return secp.utils.bytesToHex(secp.schnorr.getPublicKey(privateKeyHex));
  }

  // nostr nip-19 style bech32 (npub/nsec/nrepo), default limit
  function nip19(dataHex, prefix) {
    const words = bech32.toWords(hexToBytes(dataHex));
    return bech32.encode(prefix, words);
  }

  // bech32m witness-v1 encoding (taproot family), matches lib's encodeBytes
  function encodeBytes(prefix, hex) {
    const data = hexToBytes(hex);
    let words = bech32m.toWords(data);
    words = [1, ...words];
    return bech32m.encode(prefix, words, 1500);
  }

  // ---- OpenSSH ed25519 private key PEM (verbatim template from lib) -------
  const BEGIN = "-----BEGIN OPENSSH PRIVATE KEY-----";
  const END = "-----END OPENSSH PRIVATE KEY-----";

  function splitLongStrings(str) {
    const charLimit = 70;
    if (str.length > charLimit) {
      let out = "";
      for (let i = 0; i < str.length; i++) {
        if (i % charLimit === 0) out += "\n";
        out += str[i];
      }
      return out;
    }
    return str;
  }

  function encodePEM(keys) {
    const pem =
      `6f70656e7373682d6b65792d763100000000046e6f6e65000000046e6f6e650000000000000001000000330000000b7373682d6564323535313900000020${keys.publicKey}000000980ac771850ac771850000000b7373682d6564323535313900000020${keys.publicKey}00000020${keys.privateKey}${keys.publicKey}000000126d656c76696e406d656c76696e2d504e3632010203`;
    return `${BEGIN}${splitLongStrings(hexToBase64(pem))}\n${END}`;
  }

  // ---- BIP39 mnemonic ----------------------------------------------------
  // lib derives a standard BIP39 mnemonic from the 32-byte privkey as entropy.
  function generateBIP39Mnemonic(privateKeyHex) {
    return entropyToMnemonic(hexToBytes(privateKeyHex), wordlist);
  }

  function mnemonicToSeed(mnemonic, passphrase = "") {
    return pbkdf2(sha512, utf8(mnemonic), utf8("mnemonic" + passphrase), { c: 2048, dkLen: 64 });
  }

  // ---- BIP341 taproot tweak (for BIP86 P2TR address) ---------------------
  const TESTNET_VERSIONS = { private: 0x04358394, public: 0x043587cf };

  function bytesToBigInt(b) {
    let n = 0n;
    for (const byte of b) n = (n << 8n) | BigInt(byte);
    return n;
  }

  function taggedHash(tag, msg) {
    const tagHash = sha256(utf8(tag));
    return sha256(concatBytes(tagHash, tagHash, msg));
  }

  // internalXOnly: 32-byte Uint8Array -> tweaked x-only output key hex
  function taprootOutputKey(internalXOnly) {
    const t = bytesToBigInt(taggedHash("TapTweak", internalXOnly)) % secp.CURVE.n;
    const P = secp.Point.fromHex("02" + bytesToHex(internalXOnly)); // even-y lift_x
    const Q = P.add(secp.Point.BASE.multiply(t));
    return Q.x.toString(16).padStart(64, "0");
  }

  function generateBIP86Keys(mnemonic) {
    try {
      const seed = mnemonicToSeed(mnemonic);
      const root = HDKey.fromMasterSeed(seed, TESTNET_VERSIONS);

      // tprv/tpub from RGB account path
      const account = root.derive("m/86'/827167'/0'");
      const tprv = account.privateExtendedKey;
      const tpub = account.publicExtendedKey;

      // P2TR address from testnet path m/86'/1'/0'/0/0
      const child = root.derive("m/86'/1'/0'/0/0");
      const internal = child.publicKey.slice(1, 33); // drop 0x02/0x03 prefix
      const p2tr = encodeBytes("tb", taprootOutputKey(internal));

      return { tprv, tpub, p2tr_address: p2tr };
    } catch (error) {
      return {
        tprv: `Error: ${error.message}`,
        tpub: `Error: ${error.message}`,
        p2tr_address: `Error: ${error.message}`,
      };
    }
  }

  // ---- the headline: everything from one private key ---------------------
  function getAllKeys(privateKey) {
    const ed25519_prefix = "0000000b7373682d6564323535313900000020";
    const ed25519_ssh_prefix = "ssh-ed25519";
    const taproot_prefix = "bc";
    const taproot_testnet_prefix = "tb";
    const liquid_prefix = "ex";
    const litecoin_prefix = "ltc";
    const vertcoin_prefix = "vtc";

    const publicKey = getPublicKey(privateKey);
    const npub = nip19(publicKey, "npub");
    const nrepo = nip19(publicKey, "nrepo");

    const ed25519Keypair = nacl.sign.keyPair.fromSeed(hexToBytes(privateKey));
    const ed25519pubkey = bytesToHex(ed25519Keypair.publicKey);
    const ed25519seed = privateKey;

    const compressed = secp.utils.bytesToHex(
      secp.Point.fromPrivateKey(privateKey).toRawBytes(true)
    );
    const privkeyPEM = encodePEM({ publicKey: ed25519pubkey, privateKey: ed25519seed });

    const mnemonic = generateBIP39Mnemonic(privateKey);
    const bip86Keys = generateBIP86Keys(mnemonic);

    return {
      privkey: privateKey,
      nsec: nip19(privateKey, "nsec"),
      pubkey: publicKey,
      didnostr: `did:nostr:${publicKey}`,
      pubkeycompressed: compressed,
      npub,
      nrepo,
      taproot: encodeBytes(taproot_prefix, publicKey),
      taproottestnet: encodeBytes(taproot_testnet_prefix, publicKey),
      liquidtaproot: encodeBytes(liquid_prefix, publicKey),
      litecointaproot: encodeBytes(litecoin_prefix, publicKey),
      vertcointaproot: encodeBytes(vertcoin_prefix, publicKey),
      ed25519pubkey,
      pubky: z32Encode(ed25519pubkey),
      mnemonic,
      bip86_tprv: bip86Keys.tprv,
      bip86_tpub: bip86Keys.tpub,
      bip86_p2tr: bip86Keys.p2tr_address,
      openSSHed25519pubkey: `${ed25519_ssh_prefix} ${hexToBase64(ed25519_prefix + ed25519pubkey)}`,
      openSSHed25519privkey: privkeyPEM,
    };
  }

  // Generate a fresh random secp256k1 private key (32 bytes, hex).
  function generatePrivateKey() {
    return secp.utils.bytesToHex(secp.utils.randomPrivateKey());
  }

  // Decode an nsec back to a 32-byte hex private key (matches lib.decodeBytes).
  function nsecToHex(nsec) {
    const { words } = bech32.decode(nsec);
    const data = bech32.fromWords(words);
    return data.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Cheap derivation for vanity mining: private key hex -> npub (skips the
  // expensive BIP86/pbkdf2 work that getAllKeys does).
  function npubFromPrivate(privateKeyHex) {
    return nip19(getPublicKey(privateKeyHex), "npub");
  }

  // Everything derivable from an x-only public key alone (mirrors lib's
  // getPubKeys). Compressed pubkey is omitted: y-parity is unknown from an
  // x-only key, so guessing 02 would differ from getAllKeys for ~half of keys.
  function getPubKeys(publicKey) {
    return {
      pubkey: publicKey,
      didnostr: `did:nostr:${publicKey}`,
      npub: nip19(publicKey, "npub"),
      nrepo: nip19(publicKey, "nrepo"),
      taproot: encodeBytes("bc", publicKey),
      taproottestnet: encodeBytes("tb", publicKey),
      liquidtaproot: encodeBytes("ex", publicKey),
      litecointaproot: encodeBytes("ltc", publicKey),
      vertcointaproot: encodeBytes("vtc", publicKey),
    };
  }

  // Decode an npub to the x-only public key hex.
  function npubToHex(npub) {
    const { words } = bech32.decode(npub);
    const data = bech32.fromWords(words);
    return data.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Deterministic 12-word BIP39 phrase from the first 128 bits of the private
  // key. NOT part of getAllKeys()/the CLI — a web-only convenience. One-way:
  // it encodes only the first half of the key, so it cannot restore the key.
  function mnemonic12(privateKeyHex) {
    return entropyToMnemonic(hexToBytes(privateKeyHex).slice(0, 16), wordlist);
  }

  return { getAllKeys, getPubKeys, getPublicKey, generatePrivateKey, nsecToHex, npubToHex, npubFromPrivate, mnemonic12 };
}
