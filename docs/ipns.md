---
sidebar_position: 4
---

# IPNS Publishing

> **TL;DR:** IPNS allows you to create mutable links to IPFS content, letting you update your content while maintaining the same address. Publiish offers reliable IPNS publishing with fast propagation.

## Understanding IPNS

IPFS is content addressed, meaning that each piece of content has a unique identifier (CID) based on its hash. This creates immutability, but presents a challenge when you need to update content.

**InterPlanetary Name System (IPNS)** solves this by providing a way to create a persistent, mutable pointer to changing content.

:::info Key Concept
Think of IPNS as a changeable signpost that can point to different IPFS content over time, while the signpost itself maintains the same address.
:::

## IPNS Benefits

- **Stable References**: Keep the same link even as content changes
- **Content Versioning**: Update content without breaking existing links
- **Simplified Updates**: No need to update references across multiple systems
- **DNS Integration**: Can be combined with DNSLink for human readable names

## Using IPNS with Publiish

Publiish makes IPNS publishing simple and reliable:

### Creating an IPNS Name

```javascript
import { PubliishClient } from '@publiish/sdk';

const client = new PubliishClient({ apiKey: 'YOUR_API_KEY' });

async function createIPNSName() {
  try {
    // Generate a new IPNS key
    const result = await client.ipns.createKey('my-website');
    console.log('IPNS Key created!');
    console.log('Key Name:', result.name);
    console.log('IPNS Address:', result.ipnsId);
  } catch (error) {
    console.error('IPNS key creation failed:', error);
  }
}

createIPNSName();
```

### Publishing to IPNS

```javascript
async function publishToIPNS() {
  try {
    // Publish a CID to an IPNS name
    const result = await client.ipns.publish('QmExampleContentCID123', {
      keyName: 'my-website',
      lifetime: '87600h', // Valid for 10 years
      ttl: '5m' // Cache for 5 minutes
    });
    
    console.log('Published to IPNS!');
    console.log('IPNS Address:', result.name);
    console.log('Pointing to CID:', result.value);
  } catch (error) {
    console.error('IPNS publishing failed:', error);
  }
}

publishToIPNS();
```

### Resolving IPNS Names

```javascript
async function resolveIPNS() {
  try {
    // Resolve an IPNS name to its current CID
    const result = await client.ipns.resolve('k51qzi5uqu5dkknju2isuhotajrhi2tnvo88qv2qz89gm3qp8ldtq612kzkeoe');
    console.log('IPNS resolves to:', result.cid);
  } catch (error) {
    console.error('IPNS resolution failed:', error);
  }
}

resolveIPNS();
```

## IPNS Record Management

Managing your IPNS records through the Publiish platform:

### Listing IPNS Keys

```javascript
const keys = await client.ipns.listKeys();
console.log('Available IPNS keys:', keys);
```

### Revoking IPNS Keys

```javascript
await client.ipns.removeKey('my-website');
console.log('IPNS key removed');
```

## IPNS with DNSLink

For enhanced usability, you can combine IPNS with DNSLink to use domain names:

1. Add a TXT record to your domain's DNS:
   ```
   _dnslink.example.com. IN TXT "dnslink=/ipns/k51qzi5uqu5dkknju2isuhotajrhi2tnvo88qv2qz89gm3qp8ldtq612kzkeoe"
   ```

2. Access via gateway:
   ```
   https://gateway.publiish.xyz/ipns/example.com
   ```

## Performance Considerations

IPNS operations can be slower than direct IPFS operations. Publiish optimizes this with:

- **Fast Propagation**: Quick publishing across all Publiish nodes
- **Caching**: Enhanced caching for faster resolution
- **High Availability**: Redundant infrastructure for reliable IPNS operations

## Next Steps

- Learn about [privacy controls](/docs/privacy) for protecting your content
- Explore [custom domains](/docs/advanced/custom-domains) for your IPFS and IPNS content
- Check out [integration examples](/docs/integrations/javascript) for your applications 