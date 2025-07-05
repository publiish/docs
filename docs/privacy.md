---
sidebar_position: 5
---

# Privacy Controls

> **TL;DR:** Publiish offers robust privacy controls for your IPFS content, allowing you to restrict access, implement encryption, and manage permissions at a granular level.

## Privacy in Decentralized Storage

Public IPFS networks are designed for open content sharing, but many use cases require privacy and access control. Publiish addresses this with comprehensive privacy features that don't compromise the benefits of decentralized storage.

:::warning Understanding Content Addressing
Remember that IPFS content is addressed by its hash (CID). While this provides integrity, it also means anyone with the CID can potentially access the content unless proper privacy controls are in place.
:::

## Publiish Privacy Features

### Access Control Methods

Publiish provides multiple layers of privacy protection:

1. **Gateway-level Access Control**
   - API key authentication
   - JWT token validation
   - IP address allowlisting
   - Geolocation restrictions

2. **Content Encryption**
   - Client-side encryption options
   - Server-side encryption for all content
   - Key management services

3. **Permission Management**
   - User/group permission system
   - Granular access levels (read, write, admin)
   - Temporary access tokens

## Implementing Privacy Controls

### Restricting Gateway Access

The simplest form of access control is at the gateway level:

```javascript
import { PubliishClient } from '@publiish/sdk';

const client = new PubliishClient({ apiKey: 'YOUR_API_KEY' });

// Configure gateway access restrictions
await client.gateway.configureAccess({
  type: 'private',
  authentication: {
    apiKey: true,
    jwt: true,
    ipAllowlist: ['203.0.113.0/24', '198.51.100.1']
  },
  allowedOrigins: ['https://example.com', 'https://app.example.com']
});
```

### Content-level Encryption

For enhanced security, encrypt content before uploading:

```javascript
// Generate an encryption key
const encryptionKey = await client.encryption.generateKey();

// Upload with encryption
const result = await client.upload('/path/to/file.pdf', {
  encrypt: true,
  encryptionKey: encryptionKey.id
});

console.log('Encrypted CID:', result.cid);
console.log('Key ID for decryption:', encryptionKey.id);
```

### Managing Access Permissions

Create and manage access policies for your content:

```javascript
// Create an access policy
const policy = await client.access.createPolicy({
  name: 'Team Content',
  description: 'Access policy for team documents',
  permissions: {
    read: ['team:developers', 'team:designers'],
    write: ['team:administrators'],
    admin: ['user:alice@example.com']
  }
});

// Assign the policy to content
await client.access.assignPolicy(result.cid, policy.id);
```

## User Authentication

For applications requiring user-based access:

### Creating Access Tokens

```javascript
// Generate a temporary access token for a user
const token = await client.access.createToken({
  subject: 'user:bob@example.com',
  resources: [result.cid],
  permissions: ['read'],
  expiresIn: '24h'
});

console.log('Access token:', token.jwt);
```

### Using Access Tokens

```javascript
// In a browser environment
const response = await fetch(`https://gateway.publiish.xyz/ipfs/${cid}`, {
  headers: {
    'Authorization': `Bearer ${token.jwt}`
  }
});

const data = await response.blob();
```

## Audit and Compliance

For enterprise use cases, Publiish provides comprehensive audit logs:

- **Access Logging**: Track who accessed what content and when
- **Permission Changes**: Monitor changes to access permissions
- **Encryption Events**: Log encryption and decryption operations

Access logs through the API:

```javascript
// Get access logs for specific content
const logs = await client.logs.getAccessLogs({
  cid: result.cid,
  startTime: '2025-06-01T00:00:00Z',
  endTime: '2025-06-30T23:59:59Z'
});

console.log('Access logs:', logs);
```

## Next Steps

- Explore [private gateways](/docs/advanced/private-gateways) for enhanced privacy
- Learn about [custom domains](/docs/advanced/custom-domains) for your private content
- Implement [advanced access control](/docs/advanced/access-control) for enterprise use cases 