---
sidebar_position: 1
---

# UCAN Authorization

**User Controlled Authorization Networks**

*Decentralized identity and permissions for Web3*

:::info TL;DR
UCAN is a decentralized authorization framework that puts you in control of your digital identity. Unlike traditional auth systems, UCAN uses cryptographic keys and tokens to verify who you are and what you can access no central server needed.
:::

## Why UCAN Matters

Traditional web services require you to create accounts they control. With UCAN, **you own your identity** and decide what permissions to grant. This fundamental shift makes UCAN perfect for decentralized systems like Publiish IPFS Network.

### Key Features

- **🔐 Self-Sovereign Identity** - Create and control your digital identity using your own cryptographic keys.
- **🔄 Delegated Permissions** - Share specific access rights without sharing your private keys.
- **⚡ Offline Verification** - Tokens can be verified without connecting to a central server.
- **🔗 Chain of Trust** - Built-in provenance lets you trace who granted what permissions.

## UCAN Fundamentals

UCAN handles two critical security questions:

1. **Who are you?** (Authentication)
2. **What can you do?** (Authorization)

Let's explore how UCAN reimagines these concepts for a decentralized world:

### Identity Through Cryptography

![Identity Graph](../../static/img/IdentityGraph.svg)

With UCAN:

- You generate a cryptographic key pair
- Your **public key** becomes your decentralized identifier (DID)
- Your **private key** signs messages to prove your identity
- No central identity provider needed

:::success 💡 The Power of DIDs
Decentralized Identifiers (DIDs) let you prove who you are across any platform or service without creating separate accounts. Your DID travels with you!
:::

### Token-Based Permissions

UCANs are encoded as JSON Web Tokens (JWTs) containing:

```json
{
  // Who issued this token
  "iss": "did:key:user123",
  // Who can use this token
  "aud": "did:key:service456",
  // Not valid before (timestamp)
  "nbf": 1618099138,
  // Expiration (timestamp)
  "exp": 1618185538,
  "att": [
    {
      "with": "storage://did:key:user123",
      "can": "upload/*"
    }
  ],
  // Capabilities (what you can do)
  // Proof chain (where did these permissions come from)
  "prf": [] 
}
```

These elements combine to create a powerful, self-contained authorization system.

### Delegation in Action

Here's how delegation works in practice:

**Step 1: Resource owner creates a root token**  
Resource creators generate tokens with full permissions over their content.

**Step 2: Owner delegates specific access to others**  
Using their root token, they can create more limited tokens for collaborators.

**Step 3: Collaborators use delegated tokens**  
These tokens contain a cryptographic chain proving they were authorized by the owner.

**Step 4: Services verify the token chain**  
Any service can verify permissions without contacting a central server.

## Publiish.UCAN Implementation

Publiish IPFS Network implements UCAN for a seamless, decentralized storage authorization experience.

### Getting Started with UCAN

#### Installation

```bash
npm install publiish-ucan
```

#### Basic Usage

```javascript
import { build, validate } from 'publiish-ucan/ucan-storage'
import { KeyPair } from 'publiish-ucan/keypair'

// Generate a new keypair
const myKeypair = await KeyPair.create()

// Create a UCAN token
const token = await build({
  // Who's issuing this token
  issuer: myKeypair,
  // Who the token is for
  audience: serviceDid,
  // What permissions to grant
  capabilities: [{
    with: 'storage://did:key:user123',
    can: 'upload/*'
  }],
  // Valid for 24 hours
  lifetimeInSeconds: 60 * 60 * 24
})

// Use the token in API requests
const response = await fetch('https://node.publiish/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

### API Integration

The Publiish UCAN module provides several endpoints for managing tokens:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ucan/token` | POST | Get a root token for your DID |
| `/api/did` | GET | Get the service DID |
| `/api/brands/did` | POST | Register your DID with the service |

:::warning ⚠️ Security Best Practice
Never share your private keys or root tokens. Use delegation to create more limited tokens for specific purposes or users.
:::

### Step-by-Step Setup

1. **Register your DID with Publiish**:

   ```bash
   curl -X POST \
     -H "Authorization: Bearer $API_TOKEN" \
     -H 'Content-Type: application/json' \
     --data '{"did": "did:key:YOUR_PUBLIC_KEY"}' \
     https://node.publiish/api/brands/did
   ```

2. **Get a root UCAN token**:

   ```bash
   curl -X POST \
     -H "Authorization: Bearer $API_TOKEN" \
     https://node.publiish/api/ucan/token
   ```

3. **Retrieve the service DID**:

   ```bash
   curl -X GET https://node.publiish/api/did
   ```

4. **Use these credentials to build and delegate tokens** in your application.

## Advanced Usage

<details>
<summary><strong>Token Delegation Examples</strong></summary>

```javascript
// Creating a delegated token with limited permissions
const childToken = await build({
  issuer: myKeypair,
  audience: collaboratorDid,
  capabilities: [{
    with: 'storage://did:key:user123/project1',
    // Limited to uploading JPEG files
    can: 'upload/jpeg'
  }],
   // Link to the parent token
  proofs: [parentToken],
  // Only valid for 1 hour
  lifetimeInSeconds: 3600
})
```

</details>

<details>
<summary><strong>Token Validation</strong></summary>

```javascript
// Validate a token before using it
try {
  const result = await validate({
    token: incomingToken,
    audience: myServiceDid,
    requiredCapabilities: [{
      with: 'storage://did:key:user123',
      can: 'upload/*'
    }]
  })
  
  if (result.ok) {
    // Token is valid and has required capabilities
    console.log('Valid token from:', result.ucan.issuer)
  }
} catch (error) {
  console.error('Invalid token:', error.message)
}
```

</details>

## Next Steps

Now that you understand UCAN basics, you're ready to:

- [Integrate UCAN Authentication](/docs/tutorial-basics/integrate-ucan)
- [Build Delegation Workflows](/docs/tutorial-basics/delegation-patterns)
- [Implement Storage Permissions](/docs/tutorial-basics/storage-permissions)

---

**Related Resources:**
- [UCAN Specification](https://ucan.xyz)
- [DID Method Specification](https://www.w3.org/TR/did-1.1/)
- [JSON Web Token Standards](https://jwt.io)