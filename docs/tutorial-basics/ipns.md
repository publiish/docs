---
sidebar_position: 3
---

# InterPlanetary Name System (IPNS)

:::tip TL;DR
IPNS enables mutable references to IPFS content, solving the problem of sharing updated content without distributing new CIDs. The Publiish IPNS API makes it easy to create named keys, publish content, and resolve IPNS names.
:::

## Understanding IPNS

### The Challenge with IPFS Content

IPFS provides **content-addressed storage** where every file is referenced by its unique Content Identifier (CID). While this ensures immutability and data integrity, it creates a challenge: **when content changes, its CID changes too**.

This means for updatable content like websites, documents, or apps, you'd need to distribute a new CID every time you make changes.

### How IPNS Solves This

IPNS creates a persistent, updateable name that can point to different CIDs over time. Think of it as:

**Traditional Web:** Domain name → IP address  
**IPFS/IPNS:** IPNS name → Content hash (CID)

With IPNS, you can:
- Share a consistent name that never changes
- Update what content that name points to
- Maintain cryptographic verification of content ownership

## Publiish IPNS API

The Publiish IPNS API makes working with IPNS straightforward. Here's how to use it in your applications:

### Key Concepts

| Term | Description |
|------|-------------|
| **IPNS Key** | A cryptographic key pair used to sign and verify IPNS records |
| **IPNS Name** | A public identifier (derived from the key) that others can use to fetch your content |
| **IPNS Record** | A signed statement linking an IPNS name to a specific CID |
| **TTL** | Time-to-live for IPNS records in the network (24 hours by default) |

### Authentication

All IPNS API endpoints require authentication using your Publiish API key:

```http
Authorization: Bearer your-api-key-here
```

### Core IPNS Operations

#### 1. Create an IPNS Key

First, create a named key to publish with:

**Request:**
```http
POST /ipns/keys
Content-Type: application/json

{
  "keyName": "my-website"
}
```

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "name": "my-website",
    "id": "k51qzi5uqu5dkgmf8wn...(truncated)"
  }
}
```

#### 2. Publish Content to IPNS

Point your IPNS name to a specific CID:

**Request:**
```http
POST /ipns/publish/my-website/QmXzd4mLH8k...
```

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "sequence": "1",
    "path": "/ipfs/QmXzd4mLH8k...",
    "cid": "QmXzd4mLH8k..."
  }
}
```

#### 3. Resolve an IPNS Name

Find what content an IPNS name points to:

**Request:**
```http
GET /ipns/k51qzi5uqu5dkgmf8wn...
```

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "path": "/ipfs/QmXzd4mLH8k..."
  }
}
```

## Practical Examples

### Building a Website with IPNS

Follow these steps to publish and update a website with IPNS:

1. **Upload your website to IPFS**
   
   Use the Publiish API to upload your static website files and get a CID:
   ```javascript
   const cid = await publiish.upload(websiteFiles);
   // cid: QmXzd4mLH8k...
   ```

2. **Create an IPNS key (one-time step)**
   
   Create a named key for your website:
   ```javascript
   await publiish.ipns.createKey("my-website");
   // Returns key details including the IPNS name
   ```

3. **Publish your website to IPNS**
   
   Link your IPNS name to your website's CID:
   ```javascript
   await publiish.ipns.publish("my-website", cid);
   ```

4. **Share your IPNS address**
   
   Distribute your IPNS address instead of the CID:
   ```
   ipns://k51qzi5uqu5dkgmf8wn...
   // or via gateway: https://ipfs.io/ipns/k51qzi5uqu5dkgmf8wn...
   ```

5. **Update your website**
   
   When you change your content, upload again and republish:
   ```javascript
   const newCid = await publiish.upload(updatedWebsiteFiles);
   await publiish.ipns.publish("my-website", newCid);
   // Same IPNS address, but now points to new content!
   ```

### Integrating IPNS in Applications

```javascript
// Node.js example with fetch
const publishToIPNS = async (apiKey, keyName, cid) => {
  const response = await fetch(
    `https://node.publiish/api/ipns/publish/${keyName}/${cid}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return await response.json();
};

// Usage
const result = await publishToIPNS(
  'your-api-key',
  'my-app-config',
  'QmXzd4mLH8k...'
);

console.log(`Published to IPNS with sequence: ${result.data.sequence}`);
```

## Best Practices

:::info 📌 Tips for Effective IPNS Usage
- **Name your keys meaningfully** to identify their purpose (e.g., "company-website" or "user-profile-12345")
- **Cache IPNS resolutions** in your applications to reduce latency
- **Republish regularly** (at least every 24 hours) for critical content to ensure records stay fresh in the network
- **Back up your IPNS keys** — if you lose access to a key, you'll need to distribute a new IPNS name
:::

:::warning ⚠️ Limitations to Be Aware Of
- IPNS resolution is slower than direct CID access
- Records have a limited lifetime in the network (default TTL is 24 hours)
- You can only publish to keys you own/create
:::

## Implementation Details

For developers interested in the technical implementation, the Publiish IPNS module consists of:

| Component | Description |
|-----------|-------------|
| **IpnsController** | Handles HTTP requests and routes to appropriate service methods |
| **IpnsService** | Implements the business logic for key creation, publishing, and resolution |
| **ApikeyGuard** | Ensures requests are authenticated with valid API keys |

The service uses Ed25519 keys for IPNS to ensure fast verification and compact signatures.

## Next Steps

Now that you understand IPNS, you might want to:

- [Build a Dynamic Website with IPFS and IPNS](/docs/tutorial-extras/dynamic-websites)
- [Implement Content Versioning with IPNS](/docs/tutorial-extras/content-versioning)
- [Integrate IPNS with Traditional DNS](/docs/tutorial-extras/ipns-dns-integration)

---

**Questions?** Join our [developer community](https://discord.gg/publiish) for support and discussions about IPNS implementations.