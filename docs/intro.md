---
sidebar_position: 1
---

# Tutorial

Let's discover **Publiish - PantherStorage IPFS Network in less than 5 minutes**.

## Introduction

In a world where data sovereignty matters, PantherStorage IPFS Network delivers a trustless, decentralized, and censorship-resistant storage solution, ensuring your data remains accessible without reliance on centralized entities.

Unlike traditional cloud providers, PantherStorage leverages IPFS (InterPlanetary File System) to distribute and store data across a resilient peer-to-peer network. Whether you're a developer, creator, or enterprise, PantherStorage ensures your files are easily retrievable and globally available.

Join the next generation of storage, where your data is truly yours.

# What is Private IPFS?

InterPlanetary File System (IPFS) is a decentralized protocol designed for peer-to-peer file sharing with content addressing and immutability. While IPFS provides a powerful infrastructure for decentralized storage, its default nature is public, meaning that anyone with a Content Identifier (CID) can access stored data. This raises concerns when sensitive, proprietary, or gated content needs to be stored securely without exposing it to unauthorized access. To combat the issue of content authenticity and availability, another popular approach is encrypting the data before uploading it to IPFS **Private IPFS** solves this challenge by enabling access-controlled data storage while retaining IPFS's key advantages.

A common method for handling private offchain storage is relying on conventional file storage services such as AWS S3. With a service like S3, the bucket owner has the ability to modify file contents without changing the filename or even remove the file entirely.

To effectively address the challenge of private off-chain storage, Private IPFS is essential. While it may seem contradictory given IPFS's nature as a public peer-to-peer network, that’s not entirely the case.

Kademlia is a robust DHT that efficiently locates nodes and stores (key, value) pairs using an XOR-based metric. However, it lacks a native mechanism for fine grained access control or user-driven authorization. UCAN, with its cryptographic token based authorization and delegation, can address this gap by allowing users to control who can access or modify data stored in the Kademlia network. This integration would create a decentralized system where users manage their own identities and permissions, and nodes enforce access based on UCAN tokens

## Why Public IPFS Falls Short for Privacy
Public IPFS operates as a distributed network where nodes freely share and retrieve content. While this ensures redundancy and censorship resistance, it lacks built-in privacy controls. Some of the key limitations include:

- **Open Accessibility:** Any file uploaded to a public IPFS network can be accessed by anyone who has its CID.
- **Immutable but Unprotected:** Once uploaded, content remains in the network indefinitely if pinned, making unauthorized access a persistent risk.
- **Limited Content Control:** Traditional IPFS does not offer a mechanism to manage user permissions or restrict access to specific parties.

These constraints make **Private IPFS** a necessary solution for enterprises, content creators, and projects requiring restricted access to digital assets.

## Private IPFS Model
Private IPFS builds upon the core principles of IPFS while introducing access control mechanisms to enforce security. The essential features include:

1. **Controlled Peer-to-Peer Connections:** Instead of an open network, Private IPFS operates within a closed cluster where only authorized nodes can communicate.
2. **Encryption-Based Access Management:** Files are encrypted before being uploaded, ensuring that only users with the decryption key can access the content.
3. **Private Gateways:** Access to stored content is restricted via private gateways that authenticate requests and serve data only to approved users.
4. **Content Addressing with Permissions:** CIDs remain verifiable on the blockchain, but access is regulated based on ownership and authentication protocols.

## Private IPFS in Publiish - PantherStorage
Publiish - PantherStorage Network leverages Private IPFS to offer:
- **Secure file storage for any data**
- **Decentralized storage without exposure to public nodes**
- **Fully encrypted storage with custom access policies**

By implementing Private IPFS, **Publiish - PantherStorage** provides a next-generation, privacy-focused decentralized storage solution tailored for creators, businesses, and web3 powered applications.

### IPFS Cluster Network Setup Guide

This guide outlines the steps to add a new IPFS node and cluster node to an existing PantherStorage IPFS cluster network.

### 1. Install Docker Compose on Ubuntu (Debian-based Linux OS)

### 1.1 Install Docker Compose
```sh
sudo apt install -y docker-compose
```

### 1.2 Add User to Docker Group
```sh
sudo usermod -a -G docker $USER
```

### 1.3 Restart Terminal
Restart the terminal to apply the new user group settings.

# Requesting Access Keys for PantherStorage IPFS Network

To join an existing cluster, you will need two essential security keys provided by the PantherStorage team. Follow the steps below to request and configure these keys.

## 1.4 Request the Access Keys

To obtain the required security keys, contact the PantherStorage support team via the following channels:

- **Email**: support@pantherstorage.io  
- **Official Website Contact Form**: [https://pantherstorage.io/contact](https://pantherstorage.io/contact)  
- **Community Support (Discord/Telegram)**: Join our community channels and request assistance from an admin.

When reaching out, provide the following details:
- Your organization or project name
- Your IPFS node purpose (e.g., storage provider, retrieval node, testing)

Once approved, you will receive the following keys:
- **SWARM_KEY**: Used for securing the IPFS network
- **CLUSTER_SECRET**: Required for joining the PantherStorage IPFS cluster

## 2. Configure Environment Variables

- **SWARM_KEY**: Used for IPFS network security.
- **CLUSTER_SECRET**: Used for IPFS cluster security.

Update `docker-compose.yml` with these keys before starting the node.

After receiving your keys, update your `docker-compose.yml` file to include them before starting your node.

### Example Configuration:

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

## 3. Start the New IPFS and Cluster Node
Run the following command to build and start the new node:
```sh
docker-compose up -d --build
```

This will:
- Build Docker images for IPFS and IPFS Cluster.
- Start the services in the background.

To stop the containers:
```sh
docker-compose down
```
To restart:
```sh
docker-compose up -d
```

### Configuration Paths
- IPFS configuration files: `/home/$USER/.compose/ipfs0`
- Cluster configuration files: `/home/$USER/.compose/cluster0`

## 4. Verify Cluster Status
Check if the new node is connected to the cluster:
```sh
docker container exec cluster0 ipfs-cluster-ctl peers ls
```

Expected output for a cluster with two nodes:
```
12D3KooWJrFYdHcjLCGCgqZaCFV2wyopFfYbj5CYr6X7v8sLgQZt | cluster0 | Sees 1 other peer
  > Addresses:
    - /ip4/127.0.0.1/tcp/9096/p2p/12D3KooW...
    - /ip4/192.168.240.4/tcp/9096/p2p/12D3KooW...
  > IPFS: 12D3KooWD9...
    - /ip4/127.0.0.1/tcp/4001/p2p/12D3KooWD9...

12D3KooWJv96qg3... | cluster1 | Sees 1 other peer
  > Addresses:
    - /ip4/127.0.0.1/tcp/9096/p2p/12D3KooWJv96qg3...
    - /ip4/192.168.240.5/tcp/9096/p2p/12D3KooWJv96qg3...
  > IPFS: 12D3KooWBMT...
    - /ip4/127.0.0.1/tcp/4001/p2p/12D3KooWBMT...
    - /ip4/192.168.240.3/tcp/4001/p2p/12D3KooWBMT...
```

## Troubleshooting
- **Cluster node not visible?**
  - Ensure `SWARM_KEY` and `CLUSTER_SECRET` are correctly set.
  - Restart containers: `docker-compose restart`
  - Check logs: `docker logs cluster0`

- **IPFS not connecting?**
  - Verify network connectivity between nodes.
  - Run `ipfs swarm peers` inside the container to check connections.

---

This document provides steps to integrate a new IPFS node into an existing PantherStorage IPFS Network cluster securely.

