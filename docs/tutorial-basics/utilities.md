# Utility Libraries

The Publiish platform includes several core utility libraries that provide essential functionality for file handling, authentication, and IPFS interaction.

## 1. Chunk Receiver

The `chunk-receiver` module provides robust file chunking capabilities for handling large file uploads efficiently.

### Core Functions

#### `checkHeaders(headers)`
Validates that all required headers for chunked upload requests are present and properly formatted.

**Parameters:**
- `headers`: Object - HTTP headers from the upload request

**Returns:** Boolean - True if all required headers are valid

**Throws:** Error with appropriate message if headers are invalid

#### `checkTotalSize(maxFileSize, maxChunkSize, totalChunks)`
Ensures that the total file size does not exceed configured system limits.

**Parameters:**
- `maxFileSize`: Number - Maximum allowed file size in bytes
- `maxChunkSize`: Number - Maximum allowed chunk size in bytes
- `totalChunks`: Number - Total number of chunks in the upload

**Returns:** Boolean - True if the total size is within limits

**Throws:** Error if size exceeds configured limits

#### `cleanChunks(dirPath)`
Removes temporary directories and files created during the chunked upload process.

**Parameters:**
- `dirPath`: String - Path to the temporary directory

**Returns:** Promise - Resolves when cleanup is complete

#### `assembleChunks(tmpDir, dirPath, fileId, fileName, totalChunks, postParams)`
Reassembles individual file chunks into the complete original file.

**Parameters:**
- `tmpDir`: String - Base temporary directory path
- `dirPath`: String - Directory path for this specific file
- `fileId`: String - Unique identifier for the file
- `fileName`: String - Original file name
- `totalChunks`: Number - Total number of chunks to assemble
- `postParams`: Object - Additional parameters for post-processing

**Returns:** Promise&lt;Object&gt; - File information including path and name

#### `mkdirIfDoesntExist(dirPath, callback)`
Creates a directory if it doesn't already exist.

**Parameters:**
- `dirPath`: String - Path of directory to create
- `callback`: Function - Callback to execute after directory creation

**Returns:** Promise - Resolves when directory exists

#### `handleFile(tmpDir, headers, fileStream, postParams)`
Processes and stores individual file chunks in the temporary directory.

**Parameters:**
- `tmpDir`: String - Base temporary directory path
- `headers`: Object - HTTP headers containing chunk metadata
- `fileStream`: ReadableStream - The chunk data stream
- `postParams`: Object - Additional parameters for processing

**Returns:** Promise&lt;Object&gt; - Information about the processed chunk

#### `chunkReceive(req, tmpDir, maxFileSize, maxChunkSize)`
Main entry point for processing chunked file uploads.

**Parameters:**
- `req`: Request - The HTTP request object
- `tmpDir`: String - Base temporary directory path
- `maxFileSize`: Number - Maximum allowed file size in bytes
- `maxChunkSize`: Number - Maximum allowed chunk size in bytes

**Returns:** Promise&lt;Object&gt; - Result of the chunk processing

### Usage Example

```typescript
import { chunkReceive } from './chunk-receiver';

// In file upload handler
async function handleChunkedUpload(req, res) {
  try {
    const result = await chunkReceive(
      req,
      './temp-uploads',
      // 100MB max file size
      1024 * 1024 * 100,
      // 1MB chunk size
      1024 * 1024
    );
    
    if (result.assembled) {
      // File is complete, process it
      await processCompleteFile(result.filePath);
      return res.status(200).json({
        success: true,
        message: 'File upload complete'
      });
    } else {
      // Chunk received but file not yet complete
      return res.status(202).json({
        success: true,
        message: `Chunk ${result.currentChunk} of ${result.totalChunks} received`
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
```

## 2. Magic Authentication Library

The `magic-lib` module provides utility functions for parsing and processing Magic Link authentication data.

### Core Functions

#### `parseMagic({ issuer, email, publicAddress })`
Parses metadata from Magic Link authentication and returns a structured user object.

**Parameters:**
- `issuer`: String - The issuer identifier from Magic Link
- `email`: String - The authenticated user's email address
- `publicAddress`: String - The public blockchain address associated with the user

**Returns:** Object - Structured user information containing:
  - `id`: String - Unique user identifier
  - `email`: String - User's email address
  - `publicAddress`: String - User's blockchain address
  - `issuer`: String - Original issuer information

### Usage Example

```typescript
import { parseMagic } from './magic-lib';

// In authentication handler
async function authenticateWithMagic(didToken) {
  const metadata = await magicAdmin.users.getMetadataByToken(didToken);
  const user = parseMagic(metadata);
  
  // Use user information for further processing
  return storeOrUpdateUser(user);
}
```

## 3. IPFS HTTP Client

The `ipfs-http-client` provides a lightweight, efficient interface for interacting with IPFS nodes, focusing on key management and IPNS functionality.

### Key Class

The `Key` class manages cryptographic keys for IPFS operations.

#### `gen(params)`
Generates a new IPNS key with specified parameters.

**Parameters:**
- `name`: String - Name identifier for the key
- `type`: String (optional) - Key type (default: 'ed25519')
- `size`: Number (optional) - Key size in bits

**Returns:** Promise&lt;Object&gt; - Generated key information including:
  - `name`: String - The key name
  - `id`: String - The key identifier (multihash)

### Name Class

The `Name` class handles IPNS (InterPlanetary Name System) operations.

#### `publish(params)`
Publishes content to IPNS using the specified key.

**Parameters:**
- `cid`: String - Content identifier to publish
- `key`: String - Key name to use for publishing
- `resolve`: Boolean (optional) - Whether to resolve the name after publishing
- `ttl`: String (optional) - Time-to-live for the record (default: '24h')

**Returns:** Promise&lt;Object&gt; - Publication result including:
  - `name`: String - The IPNS name
  - `value`: String - The published CID path
  - `sequence`: Number - Record sequence number

#### `resolve(params)`
Resolves an IPNS name to its corresponding content path.

**Parameters:**
- `cid`: String - IPNS name to resolve
- `recursive`: Boolean (optional) - Whether to resolve recursively
- `nocache`: Boolean (optional) - Whether to bypass cache

**Returns:** Promise&lt;Object&gt; - Resolution result including:
  - `path`: String - The resolved content path

### Type Definitions

```typescript
export interface KeyGenParams {
  name: string;
  type?: string;
  size?: number;
}

export interface KeyGenResult {
  name: string;
  id: string;
}

export interface NamePublishParams {
  cid: string;
  key: string;
  resolve?: boolean;
  ttl?: string;
}

export interface NamePublishResult {
  name: string;
  value: string;
  sequence: number;
}

export interface NameResolveParams {
  cid: string;
  recursive?: boolean;
  nocache?: boolean;
}

export interface NameResolveResult {
  path: string;
}
```

### Usage Example

```typescript
import { Key, Name } from './ipfs-http-client';

const ipfsKey = new Key('http://localhost:5001/api/v0');
const ipfsName = new Name('http://localhost:5001/api/v0');

// Generate a new key for a user
async function createUserKey(username) {
  const key = await ipfsKey.gen({
    name: `user-${username}`,
    type: 'ed25519'
  });
  
  return key;
}

// Publish content to IPNS
async function publishUserContent(keyName, contentCid) {
  const result = await ipfsName.publish({
    cid: contentCid,
    key: keyName,
    ttl: '48h'
  });
  
  return result;
}

// Resolve an IPNS name to content
async function resolveContent(ipnsName) {
  const result = await ipfsName.resolve({
    cid: ipnsName,
    recursive: true
  });
  
  return result.path;
}
```