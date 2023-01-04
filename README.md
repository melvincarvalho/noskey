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
&nbsp;&nbsp;✓&nbsp; Generate Private Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 Public Key  
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
  "privkey": "18acc881234b739e4135f407e6eba7c5c28d916c5efab594b849a0d776932522",
  "pubkey": "f6d3fe71a5ce486a11510945cefc87562d6386e4ad7f234de33b96da3ebfd8da",
  "ed25519pubkey": "3963746904ee0baa58dff9e31bd8304666598095558c65545fee7e07113b6f80"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
