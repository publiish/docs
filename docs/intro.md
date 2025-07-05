---
sidebar_position: 1
---

# Welcome to Publiish

> Publiish IPFS Network is a decentralized storage solution and a GDPR compliant Decentralized Identifier (DID) system designed with privacy controls built on IPFS technology, giving you full ownership of your data with enhanced security, accessibility, and censorship resistance.

## Getting Started

Welcome to the Publiish IPFS Network documentation! This guide will help you understand how to use our decentralized storage solution effectively and integrate it with your applications.

### What is Publiish?

Publiish is a privacy focused decentralized storage network built on IPFS technology. It provides developers with reliable storage infrastructure while ensuring users maintain complete ownership of their data.

:::info Key Features
- **Dedicated IPFS Gateways**: Fast and reliable content delivery
- **Persistent Storage**: Guaranteed pinning of your content
- **IPNS Publishing**: Easy updates to your content with consistent addressing
- **Privacy Controls**: Fine grained access management for your data
:::

## Quick Start Guide

To get started with Publiish, follow these simple steps:

1. **Create an account** on the [Publiish platform](https://publiish.xyz)
2. **Generate your API key** from the dashboard
3. **Install the SDK** for your preferred language
4. **Start uploading content** using our API

### Installation

```bash
# npm
npm install @publiish/sdk

# yarn
yarn add @publiish/sdk

# pnpm
pnpm add @publiish/sdk
```

### Basic Usage

Here's a simple example of how to upload a file to Publiish:

```javascript
import { PubliishClient } from '@publiish/sdk';

// Initialize the client
const client = new PubliishClient({ 
  apiKey: 'YOUR_API_KEY' 
});

// Upload a file
async function uploadFile() {
  try {
    const result = await client.upload('/path/to/file.png');
    console.log('File uploaded successfully!');
    console.log('CID:', result.cid);
    console.log('Gateway URL:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadFile();
```

## Next Steps

Now that you've got the basics, you can explore our more advanced features:

- [Content pinning and management](/docs/pinning)
- [Setting up dedicated gateways](/docs/gateways)
- [Using IPNS for mutable content](/docs/ipns)
- [Managing privacy and access control](/docs/privacy)

Let's build the decentralized web together!

---

**Need help?** Join our [community Discord](https://discord.gg/publiish) or [contact support](mailto:support@publiish.network).

