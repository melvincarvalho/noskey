<div align="center">
  <h1>noskey</h1>
</div>

<div align="center">  
Generate nostr keys from command line
</div>

---

<div align="center">
<h4>Getting Started</h4>
</div>
  
---
  

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/noskey)](https://npmjs.com/package/noskey)
[![npm](https://img.shields.io/npm/dw/noskey.svg)](https://npmjs.com/package/noskey)
[![Github Stars](https://img.shields.io/github/stars/melvincarvalho/noskey.svg)](https://github.com/melvincarvalho/noskey/)

## ⚡️ Features

&nbsp;&nbsp;✓&nbsp; Generate Private Key  
&nbsp;&nbsp;✓&nbsp; Generate nsec Private Key  
&nbsp;&nbsp;✓&nbsp; Generate Public Key  
&nbsp;&nbsp;✓&nbsp; Generate compressed Public Key  
&nbsp;&nbsp;✓&nbsp; Generate bitcoin address  
&nbsp;&nbsp;✓&nbsp; Generate bitcoin testnet3 address  
&nbsp;&nbsp;✓&nbsp; Generate npub Public Key  
&nbsp;&nbsp;✓&nbsp; Generate taproot Public Key  
&nbsp;&nbsp;✓&nbsp; Generate taproot test Public Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 Public Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 openssh Public Key  
&nbsp;&nbsp;✓&nbsp; Generate from private key  
&nbsp;&nbsp;✓&nbsp; Vanity Keys  
&nbsp;&nbsp;✓&nbsp; Run with npx or install  

## ✍️ Getting Started

---

Generate random keys

```bash
npx noskey
```

Generate a vanity key

```bash
npx noskey --vanity 123
```

Generate a from private key

```bash
npx noskey -p 123
```

Install locally

```bash
sudo npm install -g noskey
```

---


## Usage

```
Usage: noskey [options]

Options:
      --version  Show version number
  -v, --vanity   Vanity string
  -p, --priv     Private key
  -h, --help     Show help                             
```

## Example Output

```json
{
  "privkey": "69fb43a2b7d606e37fd107a535f984041ff52a0166eb9278430fc8c483b72403",
  "nsec": "nsec1d8a58g4h6crwxl73q7jnt7vyqs0l22spvm4ey7zrplyvfqahyspsv5fa95",
  "pubkey": "b8663282d86d1c5f8c806087b25f57dd6a88efb4e09a03ffcd6770d8af413370",
  "pubkeycompressed": "03b8663282d86d1c5f8c806087b25f57dd6a88efb4e09a03ffcd6770d8af413370",
  "bitcoinPubkey": "1AncgZz6zfyBg7UgXkMgi8JAwxtdLBeD3q",
  "bitcoinTestnet3Pubkey": "mqJZyd55ohQSTDxJFKL4Y3WVoxVLKPiD9k",
  "npub": "npub1hpnr9qkcd5w9lryqvzrmyh6hm44g3ma5uzdq8l7dvacd3t6pxdcqeam7dc",
  "taproot": "bc1p1hpnr9qkcd5w9lryqvzrmyh6hm44g3ma5uzdq8l7dvacd3t6pxdcqqsmd8p",
  "taproottestnet": "tb1p1hpnr9qkcd5w9lryqvzrmyh6hm44g3ma5uzdq8l7dvacd3t6pxdcqu7tluh",
  "ed25519pubkey": "45427f19fca470b73620955eaa4b1fc54c2af1fb4edca8ae73bdea37a3780256",
  "openSSHed25519pubkey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEVCfxn8pHC3NiCVXqpLH8VMKvH7TtyornO96jejeAJW"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
