# Security

## Public repository rule

This repository must never contain plaintext relationship content, source chat exports, media, passwords, tokens, cookies, contact details, or identity identifiers.

The only private-content artifact allowed under `assets/` is:

```text
assets/private-content.enc.json
```

It must use the documented versioned AES-256-GCM envelope. Pull requests or commits that add plaintext exports or unencrypted analysis must not be merged.

## Password requirements

Use a unique random decryption password of at least 24 characters. Do not reuse an account password. Losing the password makes the ciphertext unrecoverable; exposing it makes the published ciphertext readable.

## Incident response

If plaintext is committed, deleting the current file is insufficient because Git history may retain it. Immediately unpublish Pages, make the repository private, rotate all affected secrets, and rewrite repository history before republishing.
