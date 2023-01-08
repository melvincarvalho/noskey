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
  "privkey": "92634fba65ff2338e5afad63da0f89a53121e210f863848201a745e660e33504",
  "nsec": "nsec1jf35lwn9lu3n3ed0443a5ruf55cjrcsslp3cfqsp5az7vc8rx5zqh8jrqr",
  "pubkey": "0080afbcdd233eab2e148c0716e962cf8c3b5d9f9dd66754782943a71f09d7c8",
  "pubkeycompressed": "020080afbcdd233eab2e148c0716e962cf8c3b5d9f9dd66754782943a71f09d7c8",
  "npub": "npub1qzq2l0xayvl2kts53sr3d6tze7xrkhvlnhtxw4rc99p6w8cf6lyq024864",
  "taproot": "bc1p1qzq2l0xayvl2kts53sr3d6tze7xrkhvlnhtxw4rc99p6w8cf6lyqk845sv",
  "taproottestnet": "tb1p1qzq2l0xayvl2kts53sr3d6tze7xrkhvlnhtxw4rc99p6w8cf6lyq2f9xt6",
  "ed25519pubkey": "4ac740ddff4d4545c11679a588b519682a27eca363c93da147b7206c65c0e8f6",
  "openSSHed25519pubkey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIErHQN3/TUVFwRZ5pYi1GWgqJ+yjY8k9oUe3IGxlwOj2"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
