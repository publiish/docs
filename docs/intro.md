---
sidebar_position: 1
---

# Tutorial
> **TL;DR:** Publiish IPFS Network is a decentralized storage solution with privacy controls built on IPFS technology, giving you full ownership of your data with enhanced security, accessibility, and censorship resistance.

## 🚀 Get Started in 5 Minutes

Welcome to the world of truly decentralized storage! This guide will help you understand how Publiish works and how to start using it right away.

:::tip What you'll learn
- What makes Publiish IPFS Network unique
- How Private IPFS solves critical data privacy challenges
- How to set up and connect to the Publiish network
:::

## What is Publiish?

Publiish IPFS Network is a **privacy-focused decentralized storage solution** built on IPFS technology. Unlike traditional cloud providers, Publiish distributes your data across a resilient peer-to-peer network while maintaining privacy controls.

### Key Benefits

- **🔒 Full Data Sovereignty** — Your data remains accessible without reliance on centralized entities
- **🌐 Global Availability** — Content is distributed across a resilient peer-to-peer network
- **🛡️ Enhanced Privacy** — Access controls for sensitive or proprietary content
- **⚡ High Performance** — Fast retrieval through optimized network topology

Whether you're a developer integrating storage solutions, a creator protecting digital assets, or an enterprise seeking secure data infrastructure, Publiish ensures your files are securely stored and easily retrievable.

## Understanding Private IPFS

### The Privacy Challenge

The standard InterPlanetary File System (IPFS) is a revolutionary decentralized storage protocol with **content addressing** and **immutability**. However, its public nature creates privacy challenges:

:::warning ⚠️ Public IPFS Limitations
- Anyone with a Content Identifier (CID) can access stored data
- Once pinned, content remains accessible indefinitely
- No built-in permission mechanisms to restrict access
:::

These limitations make public IPFS unsuitable for sensitive data, proprietary content, or applications requiring access control.

### How Private IPFS Works

Private IPFS solves these challenges by integrating access control mechanisms while preserving IPFS's core benefits:

| Feature | Description |
|---------|-------------|
| **Controlled P2P Network** | Closed cluster where only authorized nodes can participate |
| **Encryption Layer** | Content is encrypted before storage, requiring keys for access |
| **Access Gateways** | Private gateways authenticate requests before serving content |
| **Permission System** | UCAN-based cryptographic tokens control who can access or modify data |

## The Publiish Advantage

Publiish Network implements Private IPFS with additional features:

- **Secure file storage** for all data types
- **Decentralized architecture** without public exposure
- **Customizable access policies** for fine-grained control

This combination creates a next-generation storage solution perfect for Web3 applications, content creators, and privacy-conscious organizations.

## Setting Up Your Publiish Node

This section guides you through adding a new node to an existing Publiish IPFS cluster network.

### Prerequisites

- A Linux-based system (Ubuntu/Debian recommended)
- Docker and Docker Compose installed
- Network connectivity to other cluster nodes
- Access keys from the Publiish team

### Installation Steps

1. **Install Docker Compose**

   ```bash
   sudo apt install -y docker-compose
   sudo usermod -a -G docker $USER
   # Restart your terminal to apply changes
   ```

2. **Request Security Keys**

   Contact Publiish support via:
   - [Discord Community](https://discord.gg/publiish)
   - Email: support@publiish.network

   You'll need to provide:
   - Your organization/project name
   - Your node's intended purpose
   
   You'll receive two essential keys:
   - `SWARM_KEY` for IPFS network security
   - `CLUSTER_SECRET` for IPFS cluster authentication

3. **Configure Your Environment**

   Update your `docker-compose.yml` file with the security keys:

   ```yaml
   version: '3.7'
   services:
     ipfs:
       environment:
         - SWARM_KEY=your-received-swarm-key
     cluster:
       environment:
         - CLUSTER_SECRET=your-received-cluster-secret
   ```

4. **Launch Your Node**

   ```bash
   # Start the services
   docker-compose up -d --build
   
   # Verify cluster connection
   docker container exec cluster0 ipfs-cluster-ctl peers ls
   ```

### Configuration Locations

Your configuration will be stored in:
- IPFS config: `/home/$USER/.compose/ipfs0`
- Cluster config: `/home/$USER/.compose/cluster0`

### Troubleshooting

<details>
<summary><strong>Cluster node not visible?</strong></summary>

- Verify your `SWARM_KEY` and `CLUSTER_SECRET` are correct
- Restart containers with `docker-compose restart`
- Check logs with `docker logs cluster0`

</details>

<details>
<summary><strong>IPFS not connecting?</strong></summary>

- Check network connectivity between nodes
- Run `ipfs swarm peers` in the container to verify connections

</details>

## Next Steps

Now that you understand the basics of Publiish IPFS Network, you're ready to:

- [Explore the API →](/docs/tutorial-basics/create-a-page)
- [Understand UCAN Authorization →](/docs/tutorial-basics/deploy-your-site)
- [Configure IPNS for Mutable Content →](/docs/tutorial-basics/ipns)

---

**Need help?** Join our [community Discord](https://discord.gg/publiish) or [contact support](mailto:support@publiish.network).

