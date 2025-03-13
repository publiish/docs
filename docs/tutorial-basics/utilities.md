# Utility functions

These utilities include file chunk handling, Magic Link authentication parsing, and IPFS HTTP client functionality.

### 1. Chunk Receiver

The `chunk-receiver.ts` file handles the reception and reassembly of file chunks during a chunked file upload process. It ensures that the chunks are correctly received, stored temporarily, and then reassembled into the original file.

#### Key Functions:

- **`checkHeaders(headers)`**: Validates that the required headers for chunked uploads are present and correctly formatted.
- **`checkTotalSize(maxFileSize, maxChunkSize, totalChunks)`**: Ensures that the total file size does not exceed the allowed limit.
- **`cleanChunks(dirPath)`**: Deletes temporary directories and files created during the chunked upload process.
- **`assembleChunks(tmpDir, dirPath, fileId, fileName, totalChunks, postParams)`**: Reassembles the chunks into a single file.
- **`mkdirIfDoesntExist(dirPath, callback)`**: Creates a directory if it does not already exist.
- **`handleFile(tmpDir, headers, fileStream, postParams)`**: Handles the writing of individual chunks to the temporary directory.
- **`chunkReceive(req, tmpDir, maxFileSize, maxChunkSize)`**: The main function that processes the chunked upload request.

#### Usage:

This utility is used in the `file.service.ts` to handle chunked file uploads. It ensures that large files can be uploaded in smaller, manageable chunks.

### 2. Magic Library

The `magic-lib.ts` file provides a utility function for parsing metadata from Magic Link authentication.

#### Key Functions:

- **`parseMagic({ issuer, email, publicAddress })`**: Parses the metadata from Magic Link authentication and returns a structured object.
  
    **Parameters:**
    - `issuer`: The issuer of the Magic Link token.
    - `email`: The email address associated with the Magic Link token.
    - `publicAddress`: The public address associated with the Magic Link token.
    
    **Returns:** An object containing parsed user information.

#### Usage:

This utility is used in the `auth.service.ts` to parse user metadata after Magic Link authentication.

### 3. IPFS HTTP Client

The `ipfs-http-client` contains a lightweight HTTP client for interacting with an IPFS node. It provides functionality for key generation, IPNS publishing, and IPNS resolution.

#### Key Files:

- **`index.ts`**: Exports the `Key` and `Name` classes along with their types.
- **`key.ts`**: Contains the `Key` class for generating IPFS keys.
- **`name.ts`**: Contains the `Name` class for IPNS publishing and resolution.
- **`types.ts`**: Defines the types and interfaces used by the IPFS HTTP client.

#### Key Classes:

#### **Key** (Handles IPNS key generation)

- **`gen(params)`**: Generates a new IPNS key.
  
    **Parameters:**
    - `name`: The name of the key.
    - `type`: The type of key (optional).
    - `size`: The size of the key (optional).
    
    **Returns:** The generated key details.

#### **Name** (Handles IPNS publishing and resolution)

- **`publish(params)`**: Publishes a CID to an IPNS key.
  
    **Parameters:**
    - `cid`: The CID to publish.
    - `key`: The IPNS key to use.
    - `resolve`: Whether to resolve the IPNS name.
    - `ttl`: Time-to-live for the IPNS record (optional).
    
    **Returns:** The IPNS publish result.

- **`resolve(params)`**: Resolves an IPNS name to its corresponding CID.
  
    **Parameters:**
    - `cid`: The IPNS name to resolve.
    - `recursive`: Whether to resolve recursively.
    - `ttl`: Time-to-live for the resolution (optional).
    
    **Returns:** The resolved IPNS path.

#### Usage:

The IPFS HTTP client is used in the `ipns.service.ts` to interact with an IPFS node for key generation, IPNS publishing, and IPNS resolution.