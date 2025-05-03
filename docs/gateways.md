---
sidebar_position: 3
---

# Dedicated Gateways

> **TL;DR:** Publiish provides dedicated IPFS gateways for reliable, fast access to your content. Custom domains, SSL, and private gateways are available to enhance your user experience.

## What are IPFS Gateways?

IPFS gateways are HTTP servers that bridge the gap between traditional web browsers and the IPFS network. They allow anyone to access IPFS content without running an IPFS node or using specialized software.

:::info Why Use Dedicated Gateways?
While public gateways exist, they often have rate limits, slower performance, and no guarantees of availability. Dedicated gateways provide reliable, fast access to your content with customization options.
:::

## Publiish Dedicated Gateways

Publiish offers dedicated gateways specifically for your content:

### Gateway Features

- **High Performance**: Optimized for speed with global edge caching
- **High Availability**: 99.9% uptime SLA with redundant infrastructure
- **Custom Domains**: Use your own domain for a branded experience
- **SSL Support**: Automatic SSL certificate management
- **Access Controls**: Public or private access with authentication
- **Usage Analytics**: Track requests, bandwidth, and geographic distribution

### Gateway URLs

Each account receives the following gateway URLs:

| Gateway Type | URL Format | Example |
|--------------|------------|---------|
| Default | `https://gateway.publiish.io/ipfs/{CID}` | `https://gateway.publiish.io/ipfs/QmExampleCID123` |
| Subdomain | `https://{CID}.ipfs.gateway.publiish.io` | `https://QmExampleCID123.ipfs.gateway.publiish.io` |
| Custom Domain | `https://{your-domain}/ipfs/{CID}` | `https://assets.example.com/ipfs/QmExampleCID123` |

### Setting Up a Custom Domain

To use your own domain with our gateway:

1. **Add your domain** in the Publiish dashboard
2. **Configure DNS records** as instructed (typically a CNAME record)
3. **Verify ownership** through the provided methods
4. **Wait for SSL provisioning** (usually 5-10 minutes)

Example DNS configuration:

```
Type: CNAME
Host: gateway.example.com
Value: custom-gw.publiish.io
TTL: 3600
```

## Private Gateways

For content that requires access control, you can set up private gateways:

### Authentication Methods

- **API Key Authentication**: Include an API key in request headers
- **JWT Authentication**: Use JSON Web Tokens for fine grained permissions
- **IP Whitelisting**: Restrict access to specific IP addresses

### Example: Accessing Private Content

```javascript
// In a browser environment with fetch
const response = await fetch('https://private.gateway.publiish.io/ipfs/QmExampleCID123', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.blob();
```

```bash
# With curl
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://private.gateway.publiish.io/ipfs/QmExampleCID123
```

## Gateway Performance Optimization

To optimize content delivery through our gateways:

- **Use subdomain gateways** for the best browser compatibility
- **Enable edge caching** for frequently accessed content
- **Consider content chunking** for large files to improve partial loading
- **Compress assets** before uploading when possible

## Next Steps

- Learn about [IPNS](/docs/ipns) for updating content while maintaining the same address
- Explore [privacy controls](/docs/privacy) for managing access to your content
- Check out [advanced gateway features](/docs/advanced/private-gateways) for enterprise use cases 