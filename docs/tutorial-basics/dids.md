---
sidebar_position: 1
---

# DIDs in UCAN Tokens

## Decentralized Identifiers (DIDs)

A **Decentralized Identifier (DID)** is a globally unique identifier that enables verifiable, decentralized digital identity without relying on a centralized authority. It’s a string of letters and numbers stored on a blockchain or distributed ledger, allowing individuals, organizations, or devices to control their identity and authenticate it using cryptographic proofs like digital signatures.

DIDs are a core component of **self-sovereign identity**, giving users control over their data and enabling secure, private interactions. They follow a standard format defined by the **World Wide Web Consortium (W3C)** and typically look like:

```
did:<method>:<method-specific-identifier>
```

### Example:

```
did:key:z6Mkr5aefin1DzjG7MBJ3nsFCsnvHKEvTb2C4YAJwbxt1jFS
```

- `did` is the URI scheme  
- `key` is the DID method  
- The rest is a method-specific identifier (often encoding a public key)

---

### DIDs in UCAN Tokens

**UCAN** (User-Controlled Authorization Network) tokens are JSON Web Tokens (JWTs) extended with properties for decentralized authorization, allowing delegated permissions without centralized control. They use DIDs to identify participants in the authorization flow, such as users or services, ensuring cryptographic verifiability.

### In UCAN tokens, DIDs appear in specific fields of the JWT payload:

- **`iss` (issuer):** Contains the DID of the entity issuing the token, representing their public key.
- **`aud` (audience):** Contains the DID of the intended recipient of the token.

UCAN tokens often use the `did:key` method, where the DID encodes a public key in a compact string format (`did:key:<encoded-public-key>`). This allows verification of the token’s signature using the corresponding private key.

---

### Example of a UCAN Token with DIDs

Here’s a simplified example of a UCAN token payload (as JSON):

```json
{
  "iss": "did:key:z6Mkr5aefin1DzjG7MBJ3nsFCsnvHKEvTb2C4YAJwbxt1jFS",
  "aud": "did:key:z6MkfQhLHBSFMuR7bQXTQeqe5kYUW51HpfZeaymgy1zkP2jM",
  "nbf": 1529496683,
  "exp": 9256939505,
  "att": [
    {
      "with": "wnfs://demouser.fission.name/public/photos/",
      "can": "wnfs/OVERWRITE"
    },
    {
      "with": "wnfs://demouser.fission.name/public/notes/",
      "can": "wnfs/OVERWRITE"
    }
  ],
  "prf": []
}
```

### Explanation:

- **`iss`**: The DID of the issuer, tied to their public key for signature verification.
- **`aud`**: The DID of the intended recipient, such as a service like File.Storage.
- **`att`**: Specifies permissions (capabilities) the token grants, like overwriting files in a specific resource.
- **`prf`**: Contains a chain of proofs for delegated authority, which may include other UCAN tokens with their own DIDs.

---

### How It Works

1. **Keypair Generation**: Each participant (user or service) has a cryptographic keypair. The public key is encoded into a DID using the `did:key` method.

2. **Token Creation**: The issuer creates a UCAN token, signing it with their private key. The token includes their DID in the `iss` field and the recipient’s DID in the `aud` field.

3. **Verification**: The recipient (e.g., a service) verifies the token by checking the signature against the issuer’s public key (from the DID) and ensuring the permissions in `att` are valid.

4. **Delegation**: UCAN tokens can delegate permissions to others, forming a chain of proofs (`prf`). Each token in the chain uses DIDs to identify participants, ensuring a verifiable trust chain.

---

### Practical Example

In a service like **FIle.Storage**, a marketplace might issue a UCAN token to a user, delegating upload permissions. The token’s `iss` field contains the marketplace’s DID, and the `aud` field contains the File.Storage service’s DID.

The user then generates a request token with:
- their own DID in `iss`
- File.Storage’s DID in `aud`
- the marketplace’s token in the `prf` field

File.Storage verifies the chain of DIDs and signatures to authorize the upload.

---

## Summary

A **DID** is a unique, cryptographically verifiable identifier for decentralized identity, typically formatted as:

```
did:<method>:<identifier>
```

In **UCAN tokens**, DIDs (often `did:key`) are used in the `iss` and `aud` fields to identify the issuer and recipient, enabling secure, delegated authorization. The token’s structure, built on JWTs, includes permissions and proof chains, with DIDs ensuring verifiable identities throughout the process.

## References

- [W3C DID Spec](https://www.w3.org/TR/did-1.0/)

- [UCAN Spec](https://github.com/ucan-wg/spec)