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
&nbsp;&nbsp;✓&nbsp; Generate nrepo Public Key  
&nbsp;&nbsp;✓&nbsp; Generate taproot Public Key  
&nbsp;&nbsp;✓&nbsp; Generate taproot test Public Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 Public Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 openssh Public Key  
&nbsp;&nbsp;✓&nbsp; Generate ed25519 openssh Private Key PEM  
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
  "privkey": "096267c08957fe0a83399d3e6be45fb283aefed6487fac55350d828142362f68",
  "nsec": "nsec1p93x0syf2llq4qeen5lxhezlk2p6alkkfpl6c4f4pkpgzs3k9a5qs7nk3j",
  "pubkey": "3104afd3bc605665d1e92afdc33bb50d8d8c47293916374f45a965fc390a0333",
  "pubkeycompressed": "033104afd3bc605665d1e92afdc33bb50d8d8c47293916374f45a965fc390a0333",
  "bitcoinPubkey": "1LcHKWvoVW7ZXVtVf7cX3JS6hqvWNnphaB",
  "bitcoinTestnet3Pubkey": "n18Eca1nJXYpJcN7NgatsDeRZqXDJ8EwFD",
  "npub": "npub1xyz2l5auvptxt50f9t7uxwa4pkxcc3ef8ytrwn6949jlcwg2qvesle5tfn",
  "nrepo": "nrepo1xyz2l5auvptxt50f9t7uxwa4pkxcc3ef8ytrwn6949jlcwg2qveskz7ewj",
  "taproot": "bc1p1xyz2l5auvptxt50f9t7uxwa4pkxcc3ef8ytrwn6949jlcwg2qvesx55cr2",
  "taproottestnet": "tb1p1xyz2l5auvptxt50f9t7uxwa4pkxcc3ef8ytrwn6949jlcwg2qves66y2cu",
  "liquidtaproot": "ex1p1xyz2l5auvptxt50f9t7uxwa4pkxcc3ef8ytrwn6949jlcwg2qvesdq02p7",
  "ed25519pubkey": "c6fcabb4927adf2eb64beb2a99004c836c71944220fe8b7568e04616eac34c29",
  "openSSHed25519pubkey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMb8q7SSet8utkvrKpkATINscZRCIP6LdWjgRhbqw0wp",
  "openSSHed25519privkey": "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACADAQAEAAAAAwAABgAFBgYFAAEACQIAAAAAAwMAAAUAAAAAAIiJTFkeiUxZ\nHgAAAAtzc2gtZWQyNTUxOQAAACADAQAEAAAAAwAABgAFBgYFAAEACQIAAAAAAwMAAAUAAA\nAAAEAACQYCBgcAAAgJBQcAAAAACAMDCQkAAwAGAAAEBQAAAgMBAAQAAAADAAAGAAUGBgUA\nAQAJAgAAAAADAwAABQAAAAAAAAECAwQF\n-----END OPENSSH PRIVATE KEY-----\n"
}
```


## ⚖️ License

This project is under the MIT License. See the [LICENSE](https://github.com/melvincarvalho/noskey/blob/gh-pages/LICENSE) file for the full license text.
