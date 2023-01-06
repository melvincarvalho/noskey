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
  "privkey": "2978c96896e21a75a1a9e5caec040c2b610ab2fafb73785c3370253f325e6bf9",
  "nsec": "nsec199uvj6ykugd8tgdfuh9wcpqv9dss4vh6ldehshpnwqjn7vj7d0uswzzsxm",
  "pubkey": "c9aeff80b1455a641c7d3c6095a7cee6cdc0108c96d484a2394e3743a7270353",
  "npub": "npub1exh0lq93g4dxg8ra83sftf7wumxuqyyvjm2gfg3efcm58fe8qdfspfcvja",
  "taproot": "bc1p1exh0lq93g4dxg8ra83sftf7wumxuqyyvjm2gfg3efcm58fe8qdfscyclcy",
  "taproottestnet": "tb1p1exh0lq93g4dxg8ra83sftf7wumxuqyyvjm2gfg3efcm58fe8qdfsy2gdrj",
  "ed25519pubkey": "6abcc8a74c992a96f1726a9507b268707aa0b34109bb645ac147764b6865ccfd",
  "openSSHed25519pubkey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGq8yKdMmSqW8XJqlQeyaHB6oLNBCbtkWsFHdktoZcz9"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
