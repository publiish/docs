# Publiish IPNS

This module handles IPNS key creation, IPNS publishing, and IPNS resolution.

### 1. IPNS Controller

The `IpnsController` exposes endpoints for IPNS related operations.

#### Endpoints:

- **POST /ipns/keys**: Creates a new IPNS key.

  - **Body**: `CreateKeyDto` containing `keyName`.
  - **Returns**: The created IPNS key details, including name and ID.

- **POST /ipns/publish/:keyName/:cid**: Publishes a CID to an IPNS key.

  - **Parameters**:
    - `keyName`: The name of the IPNS key.
    - `cid`: The CID to publish.
  - **Returns**: The IPNS publish details, including the sequence, path, and CID.

- **GET /ipns/:ipnsname**: Resolves an IPNS name to its corresponding CID.

  - **Parameters**:
    - `ipnsname`: The IPNS name to resolve.
  - **Returns**: The resolved IPNS path.

### 2. IPNS Service

The `IpnsService` handles the business logic for IPNS-related operations, including key creation, IPNS publishing, and IPNS resolution.

#### Methods:

- **createKey(args)**: Creates a new IPNS key.
  
  - **Parameters**:
    - `name`: The name of the IPNS key.
  - **Returns**: The created IPNS key details, including name and ID.

- **publishIpns(args)**: Publishes a CID to an IPNS key.
  
  - **Parameters**:
    - `keyName`: The name of the IPNS key.
    - `cid`: The CID to publish.
  - **Returns**: The IPNS publish details, including the sequence, path, and CID.

- **resolveIpns(args)**: Resolves an IPNS name to its corresponding CID.
  
  - **Parameters**:
    - `cid`: The IPNS name to resolve.
  - **Returns**: The resolved IPNS path.

#### Imports:

- `TypeOrmModule.forFeature([Brand])`: Registers the `Brand` entity with TypeORM.

### 3. IPNS DTOs 

The DTOs define the structure of the data required for IPNS related operations and the `types.ts` file defines the response structures.

#### DTOs:

- `CreateKeyDto`: Contains `name` for creating an IPNS key.

#### Interfaces:

- `IpnsPublishResponse`: Extends `CoreApiResponse` and includes the IPNS publish details.
- `IpnsResolveResponse`: Extends `CoreApiResponse` and includes the resolved IPNS path.
- `IpnsKeyResponse`: Extends `CoreApiResponse` and includes the created IPNS key details.

### 4. Integration

The IPNS module integrates with the following modules:

- `ApikeyGuard`: Ensures that only authenticated users can perform IPNS-related operations.
- `BrandModule`: Associates IPNS operations with specific brands.

### 5. Publiish IPNS

This API provides endpoints for managing IPNS keys, publishing IPNS records, and resolving IPNS names using IPFS. The implementation leverages NestJS, IPFS HTTP client, and Helia.

### Endpoints

#### 1. IPNS Key Management

#### Create a Key
**Endpoint:** `POST /ipns/keys`

**Description:**
Creates a new IPNS key using Ed25519.

**Authentication:** Requires API key guard.

**Request Body:**
```json
{
  "keyName": "your-key-name"
}
```

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "name": "your-key-name",
    "id": "Qm..."
  }
}
```

#### 2. IPNS Publishing

#### Publish a CID to IPNS
**Endpoint:** `POST /ipns/publish/:keyName/:cid`

**Description:**
Publishes a CID under a specific IPNS key.

**Authentication:** Requires API key guard.

**Parameters:**
- `keyName` (string): The name of the IPNS key.
- `cid` (string): The CID of the IPFS content to publish.

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "sequence": "1",
    "path": "/ipfs/Qm...",
    "cid": "Qm..."
  }
}
```

#### 3. IPNS Resolution

#### Resolve an IPNS Name
**Endpoint:** `GET /ipns/:ipnsname`

**Description:**
Resolves an IPNS name to its latest CID.

**Parameters:**
- `ipnsname` (string): The IPNS name to resolve.

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "path": "/ipfs/Qm..."
  }
}
```