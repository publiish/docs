# UCAN token

The module handles UCAN token generation and refresh operations.

### 1. UCAN Controller

The `UcanController` exposes endpoints for UCAN related operations.

### Endpoints:

- **POST** `/ucan/token`: Generates or refreshes a UCAN token.
  - **Request**: The request object containing the authenticated user and UCAN token.
  - **Returns**: The generated or refreshed UCAN token.

### 2. UCAN Service

The `UcanService` handles the business logic for UCAN token generation and refresh operations.

#### Methods:

- **`ucanToken(args)`**: Generates or refreshes a UCAN token.
  - **Parameters:**
    - `user`: The authenticated user.
    - `authType`: The type of authentication (`ucan` or `key`).
    - `ucanToken`: The existing UCAN token (if refreshing).
  - **Returns**: The generated or refreshed UCAN token.

#### Imports:

- `TypeOrmModule.forFeature([Brand])`: Registers the `Brand` entity with TypeORM.

### 3. Integration

The UCAN module integrates with the following modules:

- **AuthGuard**: Ensures that only authenticated users can perform UCAN-related operations.
- **BrandModule**: Associates UCAN operations with specific brands.

### Installation and usage

You can install the `publiish-ucan` package with your favorite JS dependency manager, e.g.:

```bash
npm install publiish-ucan
```

The main exports are the [`build`][typedoc-build] and [`validate`][typedoc-validate] methods, as well as the [`KeyPair` class][typedoc-keypair] used to manage signing keys.

### Using UCANs with Node Publiish

[Publiish Web3 Storage](https://publiish.io/) is a free service for storing datas on the decentralized [Filecoin](https://filecoin.io) storage network, with content retrieval via [IPFS](https://ipfs.io).

Node Publiish is the first service to support UCAN-based authorization using the `publiish-ucan` library.

For the platforms need storage, adopting UCAN auth can allow you to integrate free, decentralized storage into your own applications without requiring your end users to sign up for an Node Publiish account.

The Node Publiish API includes endpoints for registering your DID with your Node Publiish account and obtaining "root tokens" that can be used to delegate storage permissions to other users, whether they have an Node Publiish account or not.

To use the UCAN API endpoints, create an API token at your Node Publiish [account management page](https://publiish.io/).

### Registering your DID

Once you have a normal API token, you can [generate a keypair](#generating-a-keypair) using the `publiish-ucan` CLI and call an API endpoint to register the DID of the public key with the Node Publiish service.

To register your DID, send a `POST` request to `https://node.publiish/api/brands/did` with a body containing a JSON object of the form:

```json
{
  "did": "<your-did-string>"
}
```

In the example below, replace `$API_TOKEN` with your Node Publiish API token, or set a shell variable named `API_TOKEN` before running the command.

Likewise, replace `$DID` with your DID string, or set a shell variable named `DID` before running the command.

```bash
curl -X POST -H "Authorization: Bearer $API_TOKEN" -H 'Content-Type: application/json' --data "{\"did\": \"$DID\"}"
```

### Obtaining a root UCAN token

Once you've registered your DID, you can request a root UCAN token from the Node Publiish API, which will be valid for a duration of two weeks.

To request a root token, you must have either a normal API token or an existing root UCAN token. By providing an existing UCAN, you can "refresh" a token before it expires.

Send a `POST` request to `https://node.publiish/api/ucan/token` to obtain a new UCAN token.

In the example below, replace `$TOKEN` with either an existing UCAN token or an Node Publiish API token. Or, set a shell variable named `TOKEN` before running the command.

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" https://node.publiish/api/ucan/token
```

<!-- TODO: show response body -->

You can use the root token to [derive child UCAN tokens](#deriving-a-child-token) for other users, or to [create a request token](#creating-a-request-token-to-upload-content) to upload content using UCAN auth instead of your API token.

### Obtaining the service DID

The DID for the Node Publiish service is available at the public endpoint `https://node.publiish/api/did`.

Send a `GET` request to `https://node.publiish/api/did`, which should return a JSON object of the form:

```json
{
  "ok": true,
  "value": "<service-did>"
}
```