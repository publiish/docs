# File Storage API

The File Storage module provides comprehensive file management capabilities for the Publiish platform, including storage, retrieval, and metadata management with IPFS integration.

## 1. File Entity Schema

The `File` entity represents the core data structure for files stored within the system:

| Property | Type | Description |
|----------|------|-------------|
| `id` | UUID | Unique identifier for the file record |
| `filename` | String | Original name of the uploaded file |
| `new_filename` | String | Renamed file (if applicable) |
| `file_type` | String | MIME type of the file content |
| `cid` | String | Content Identifier (CID) from IPFS |
| `file_size` | Number | Size of the file in bytes |
| `brand_id` | UUID | Reference to the brand that owns the file |
| `consumer_id` | UUID | Reference to the consumer who uploaded the file |
| `created_by` | UUID | Reference to the user who created the file |
| `updated_by` | UUID | Reference to the user who last updated the file |
| `delete_flag` | Boolean | Soft deletion marker |
| `created_at` | Date | Creation timestamp |
| `updated_at` | Date | Last update timestamp |

### Methods

- **`toJSON()`**: Transforms the entity into a plain object for serialization, excluding sensitive data.

## 2. File Service

The `FileService` implements the core business logic for all file-related operations, providing a robust API for file management.

### Methods

#### `getHello()`
Retrieves all files from the database (primarily used for testing and diagnostics).

**Returns:** Array&lt;File&gt; - List of all file entities

#### `postFile(req, brand_id, auth_user_id)`
Processes a standard file upload to IPFS.

**Parameters:**
- `req`: Request - The HTTP request containing the file to upload
- `brand_id`: UUID - The ID of the brand associated with the file
- `auth_user_id`: UUID - The ID of the authenticated user performing the upload

**Returns:** FileResponse - Contains the CID and filename of the uploaded file

**Process:**
1. Validates the upload request and file content
2. Uploads the file to IPFS
3. Stores file metadata in the database
4. Returns the file's CID and other metadata

#### `postChunkFile(req, brand_id, auth_user_id, res)`
Handles large file uploads using a chunked upload approach.

**Parameters:**
- `req`: Request - The HTTP request containing the file chunk
- `brand_id`: UUID - The ID of the brand associated with the file
- `auth_user_id`: UUID - The ID of the authenticated user performing the upload
- `res`: Response - The HTTP response object

**Returns:** FileResponse - Contains the CID and filename of the uploaded file

**Process:**
1. Processes incoming file chunks
2. Temporarily stores chunks on disk
3. Reassembles complete file when all chunks are received
4. Uploads the reassembled file to IPFS
5. Stores file metadata in the database
6. Returns the file's CID and other metadata

#### `uploadFile2IPFS(args)`
Core method for uploading files to IPFS.

**Parameters:**
- `args`: Object - Contains file path, brand ID, user ID, and other metadata

**Returns:** IPFSResponse - Contains the CID and upload confirmation

#### `deleteFile(brand_id, auth_user_id, cid)`
Marks a file for deletion in the database.

**Parameters:**
- `brand_id`: UUID - The ID of the brand associated with the file
- `auth_user_id`: UUID - The ID of the authenticated user performing the deletion
- `cid`: String - The CID of the file to delete

**Returns:** DeleteResponse - Contains a success confirmation message

#### `getPublishLink(cid, filename)`
Generates a public IPFS URL for accessing a file.

**Parameters:**
- `cid`: String - The CID of the file
- `filename`: String - Optional suggested filename for the download

**Returns:** String - The public URL for accessing the file

## 3. File Controller

The `FileController` exposes RESTful endpoints for file management operations.

### Endpoints

#### `GET /files`
Retrieves all files in the system (diagnostic endpoint).

**Response:** Array&lt;File&gt; - List of all file entities

#### `POST /files/file_add_update`
Handles file uploads to the system.

**Request:**
- Multipart form data containing the file
- Query parameters for brand and user identification

**Response:** FileResponse - Contains the CID and filename of the uploaded file

#### `POST /files/file_chunk_add`
Processes chunked file uploads for larger files.

**Request:**
- Multipart form data containing the file chunk
- Headers specifying chunk information
- Query parameters for brand and user identification

**Response:** FileResponse - Contains the CID and filename of the uploaded file

#### `DELETE /files/file_delete`
Marks a file for deletion.

**Request:**
- Query parameters specifying the CID, brand ID, and user ID

**Response:** DeleteResponse - Contains a success confirmation message

#### `GET /files/publish-link/:cid`
Generates a public IPFS URL for a file.

**Path Parameters:**
- `cid`: String - The CID of the file

**Query Parameters:**
- `filename`: String - Optional suggested filename for the download

**Response:** Redirect to IPFS gateway URL

#### `GET /files/download/:cid`
Generates a download URL for a file.

**Path Parameters:**
- `cid`: String - The CID of the file

**Query Parameters:**
- `filename`: String - Optional suggested filename for the download

**Response:** Redirect to IPFS gateway download URL

## 4. File Data Structures

### Request DTOs

```typescript
export class UploadFileDto {
  @IsUUID()
  @IsNotEmpty()
  auth_user_id: string;
}

export class DeleteFileDto {
  @IsUUID()
  @IsNotEmpty()
  auth_user_id: string;
  
  @IsString()
  @IsNotEmpty()
  cid: string;
}
```

### Response Interfaces

```typescript
export interface FileResponse extends CoreApiResponse {
  data: {
    cid: string;
    filename: string;
  };
}

export interface DeleteResponse extends CoreApiResponse {
  data: string; // Success message
}

export interface ClusterFile {
  name: string;
  cid: string;
  size: number;
  allocations: string[];
}
```

## 5. Helper Utilities

### `streamToBuffer(stream)`
Converts a readable stream to a buffer for processing.

**Parameters:**
- `stream`: ReadableStream - The stream to convert

**Returns:** Promise&lt;Buffer&gt; - The resulting buffer

### `parseClusterStringResponse(ipfsData)`
Parses IPFS cluster responses into structured data.

**Parameters:**
- `ipfsData`: String - Raw response from IPFS cluster

**Returns:** Array&lt;ClusterFile&gt; - Structured file data

## 6. API Reference

### Upload File
`POST /files/file_add_update`

Uploads a file to IPFS and stores its metadata.

**Request Parameters:**
- **Query Parameters:**
  - `auth_user_id` (UUID, required): The ID of the authenticated user
- **Headers:**
  - `Authorization`: Bearer token for authentication
- **Body:**
  - Multipart file upload

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "cid": "Qm...",
    "filename": "example.jpg"
  }
}
```

### Upload File in Chunks
`POST /files/file_chunk_add`

Uploads large files in manageable chunks to prevent timeout issues.

**Request Parameters:**
- **Query Parameters:**
  - `auth_user_id` (UUID, required): The ID of the authenticated user
- **Headers:**
  - `Authorization`: Bearer token for authentication
  - `X-File-Id`: Unique identifier for the chunked file
  - `X-File-Name`: Original filename
  - `X-File-Size`: Total file size in bytes
  - `X-Chunk-Index`: Current chunk index (zero-based)
  - `X-Total-Chunks`: Total number of chunks
- **Body:**
  - Binary chunk data

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": {
    "cid": "Qm...",
    "filename": "example.mp4"
  }
}
```

### Delete File
`DELETE /files/file_delete`

Marks a file as deleted in the database.

**Request Parameters:**
- **Query Parameters:**
  - `auth_user_id` (UUID, required): The ID of the authenticated user
  - `cid` (String, required): The IPFS CID of the file to delete
- **Headers:**
  - `Authorization`: Bearer token for authentication

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": "File has been deleted successfully"
}
```

### Get Public File Link
`GET /files/publish-link/:cid`

Returns a public IPFS URL for accessing a file.

**Request Parameters:**
- **Path Parameters:**
  - `cid` (String, required): The IPFS CID of the file
- **Query Parameters:**
  - `filename` (String, optional): Suggested filename for download

**Response:**
Redirects to IPFS gateway URL:
```
http://ipfs-gateway-url/ipfs/Qm...?filename=example.jpg
```

### Download File
`GET /files/download/:cid`

Provides a direct download link for a file stored in IPFS.

**Request Parameters:**
- **Path Parameters:**
  - `cid` (String, required): The IPFS CID of the file
- **Query Parameters:**
  - `filename` (String, optional): Suggested filename for download

**Response:**
Redirects to IPFS gateway download URL:
```
http://ipfs-gateway-url/ipfs/Qm...?filename=example.jpg&download=true
```

## 7. Integration

The File Storage API integrates with these core modules:

- **AuthModule**: Enforces authentication for file operations
- **BrandModule**: Associates files with specific brands
- **IPFSModule**: Provides the underlying distributed storage functionality

## 8. Error Handling

The API implements robust error handling for various scenarios:

| Error Scenario | HTTP Code | Error Response |
|----------------|-----------|----------------|
| File not found | 404 | `{"message": "File not found"}` |
| Invalid CID | 400 | `{"message": "Invalid CID format"}` |
| Upload failure | 500 | `{"message": "File upload failed: [reason]"}` |
| Chunk assembly error | 410 | `{"message": "Chunked upload failed: [reason]"}` |
| Unauthorized access | 403 | `{"message": "Insufficient permissions to access this file"}` |