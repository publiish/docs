---
sidebar_position: 1
---

# UCAN Basics

UCAN stands for User Controlled Authorization Networks. UCAN redefines how identity and permissions work in a decentralized world. Unlike conventional web systems, UCAN puts you in charge of your digital identity and access rights. Curious about what sets UCAN apart? Let’s explore.

## UCAN - Empowering Decentralized Access

It’s a framework designed to shift the relationship between users and service providers, giving end users greater control over their identity and permissions.

At its core, UCAN handles two key questions:

- **Who are you?** (Authentication)
- **What can you do?** (Authorization)

Instead of relying on a service to dictate your identity or permissions, UCAN lets you define and prove both using cryptographic tools. This makes it perfect for peer-to-peer networks where trust and flexibility are paramount.

## How UCAN Operates

### Your Identity, Your Keys

With UCAN, you create your own identity using a public-private key pair. No more usernames or passwords managed by a third party. When you interact with a service, it checks your public key against your signed requests to confirm you’re the real deal. This self sovereign approach boosts privacy and portability across platforms.

### Tokens of Power

Forget centralized permission lists. UCAN uses tokens to grant access. Each token is like a keycard, detailing:

- **What you can do** (e.g., upload, delete).
- **Where you can do it** (e.g., a specific IPFS file).

These tokens are self contained, so services don’t need to ping a database they just verify the token. It’s fast, secure, and works offline or across distributed systems.

### Trust Through Provenance

Every UCAN token carries a proof chain, a trail of signed tokens showing who granted your access. A simple chain might start with the resource owner giving you permission directly. The service checks the signatures to ensure it’s legit no middleman required.

### Sharing Made Simple

Need to grant access to someone else? UCAN’s delegation lets you pass along your permissions without handing over your private key. You issue a new token, linking it to the original, creating a chain of trust. For example:

- An IPFS file owner gives you write access.
- You delegate read access to a collaborator.
- They use the token, and the chain proves it’s valid.

This delegation superpower makes UCAN a great option for collaboration in decentralized setups.

## Why Choose UCAN?

- **Control**: You own your identity and permissions no service can lock you out.
- **Decentralized**: Works seamlessly in systems without a central authority.
- **Efficient**: Tokens cut out the need for constant server checks.
- **Secure**: Cryptography ensures tamper-proof access.

Imagine UCAN as a backstage pass: it gets you in, and you can share it with a friend, all without asking the venue.

## Publiish.UCAN

This project integrates UCAN with IPFS to enable secure, user driven authorization for decentralized storage and sharing. Want to see it in action? Dig into the code or try the examples below.

## UCAN Module Overview

This module provides tools for creating and managing UCAN tokens in your IPFS workflows.

### 1. UCAN Manager

The `UcanManager` handles token creation and updates via simple API endpoints.

#### API Routes:

- **POST** `/ucan/create`: Issues a new UCAN token.
  - **Input**: User details and optional existing token.
  - **Output**: A fresh UCAN token.

### 2. UCAN Logic

The `UcanLogic` class powers the token operations.

#### Functions:

- **`generateUcan(user, type, token?)`**:
  - **Inputs**:
    - `user`: The requesting user.
    - `type`: Authentication method (key or UCAN).
    - `token`: Optional existing UCAN for refresh.
  - **Output**: A new or updated UCAN token.

#### Dependencies:

- `TypeOrmModule.forFeature([Entity])`: Links to your data entities (e.g., Brand).

### 3. Connections

The module ties into:

- **AuthCheck**: Restricts UCAN actions to verified users.
- **EntityModule**: Ties tokens to specific resources or brands.

## Setup and Usage

### Installation

Install the `publiish-ucan` package:

```bash
npm install publiish-ucan
```

### Using UCANs with Node Publiish

[Publiish Web3 Storage](https://publiish.io/) is a free service for storing data on the decentralized [Filecoin](https://filecoin.io) storage network, with content retrieval via [IPFS](https://ipfs.io).

Node Publiish is the first service to support UCAN based authorization using the `publiish-ucan` library.

To integrate UCAN auth for free, decentralized storage without requiring users to sign up for a Node Publiish account:

- Register your DID.
- Obtain a root UCAN token.
- Use the UCAN API endpoints.

### Registering your DID

To register your DID, send a `POST` request to:

```bash
curl -X POST -H "Authorization: Bearer $API_TOKEN" -H 'Content-Type: application/json' --data '{"did": "$DID"}' https://node.publiish/api/brands/did
```

### Obtaining a Root UCAN Token

Request a root UCAN token from the Node Publiish API:

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" https://node.publiish/api/ucan/token
```

### Obtaining the Service DID

Retrieve the Node Publiish service DID:

```bash
curl -X GET https://node.publiish/api/did
```