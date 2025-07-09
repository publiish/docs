---
sidebar_position: 2
---

# Content Pinning

> **TL;DR:** Pinning ensures your content stays available in the IPFS network indefinitely. Publiish offers reliable pinning services with flexible options for different content types and storage durations.

## What is Pinning?

In IPFS, content is stored in a distributed network of nodes. By default, this content might be removed during garbage collection if no node is actively keeping it. **Pinning** is the process of telling IPFS nodes to keep specific content, ensuring it remains available.

:::info Why Pinning Matters
Without pinning, your content might disappear from the network if no nodes are keeping it cached, making links to your content break over time.
:::

## Pinning with Publiish

Publiish provides robust pinning services with various options to meet your specific needs:

### Basic Pinning

The simplest way to pin content is through our API:

```javascript
import { PubliishClient } from '@publiish/sdk';

const client = new PubliishClient({ apiKey: 'YOUR_API_KEY' });

// Pin content by CID
async function pinContent() {
  try {
    const result = await client.pin('QmExampleCID123456789');
    console.log('Content pinned successfully!');
    console.log('Pin ID:', result.pinId);
  } catch (error) {
    console.error('Pinning failed:', error);
  }
}

pinContent();
```

### Pin Management

You can manage your pins through the dashboard or API:

- **List pins** - View all your pinned content
- **Check pin status** - Monitor the replication status of your pins
- **Unpin content** - Remove pins when no longer needed
- **Repin content** - Refresh pin duration

### Pin Options

When pinning content, you can specify various options:

| Option | Description |
|--------|-------------|
| `name` | A human readable name for the pin |
| `expires` | When the pin should expire (e.g., '30d', '1y') |
| `replicas` | Number of nodes to replicate content across |
| `metadata` | Custom metadata to associate with the pin |

### Example with Options

```javascript
const pinOptions = {
  name: 'Project Logo',
  // Pin for one year
  expires: '365d',
  // Store on at least 3 nodes
  replicas: 3,
  metadata: {
    project: 'My App',
    version: '1.0'
  }
};

const result = await client.pin('QmExampleCID123456789', pinOptions);
```

## Pinning from Upload

When uploading content, it's automatically pinned:

```javascript
const result = await client.upload('/path/to/file.png', {
  name: 'Product Image',
  expires: '180d'
});

// The content is now pinned with the specified options
console.log('Content CID:', result.cid);
console.log('Pin ID:', result.pinId);
```

## Next Steps

- Learn about [dedicated gateways](/docs/gateways) for faster content delivery
- Explore [IPNS](/docs/ipns) for updating content while maintaining the same address
- Understand [access controls](/docs/privacy) for your pinned content 