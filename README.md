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

&nbsp;&nbsp;✓&nbsp; Generate Public Key  
&nbsp;&nbsp;✓&nbsp; Generate npub Public Key  
&nbsp;&nbsp;✓&nbsp; Generate npub Public Key  
&nbsp;&nbsp;✓&nbsp; Generate Private Key  
&nbsp;&nbsp;✓&nbsp; Generate nsec Private Key  
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
  "privkey": "c6157c9fec0b9baf6d1da9045322aab2f362b9445b1c07647c50ffe86b27de47",
  "nsec": "nsec1cc2he8lvpwd67mga4yz9xg42ktek9w2ytvwqweru2rl7s6e8mersh7h3vk",
  "pubkey": "825d6e28bee7247f689ac1243e3bdca739f097182904b9de0c487c07756691db",
  "npub": "npub1sfwku297uuj876y6cyjruw7u5uulp9cc9yztnhsvfp7qwatxj8dsg48sf3",
  "taproot": "bc1p1sfwku297uuj876y6cyjruw7u5uulp9cc9yztnhsvfp7qwatxj8ds3c8rrg",
  "ed25519pubkey": "f69af2d4a7004e7de42655f1cee9087161ab7dafd59d026b5f7c1047bc454bcb",
  "openSSHed25519pubkey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPaa8tSnAE595CZV8c7pCHFhq32v1Z0Ca198EEe8RUvL"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
