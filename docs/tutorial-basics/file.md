# File Storage API

This module handles file related operations, including file uploads, chunked uploads, file deletion, and generating publish/download links.

### 1. File Entity

The File entity represents the structure of a file in the database. It includes fields such as filename, CID (Content Identifier), file size, and relationships with other entities.

#### Fields:
- `id`: Unique identifier for the file.
- `filename`: The name of the file.
- `new_filename`: The new name of the file (if renamed).
- `file_type`: The MIME type of the file.
- `cid`: The CID (Content Identifier) of the file in IPFS.
- `file_size`: The size of the file in bytes.
- `brand_id`: The ID of the brand associated with the file.
- `consumer_id`: The ID of the consumer who uploaded the file.
- `created_by`: The ID of the user who created the file.
- `updated_by`: The ID of the user who last updated the file.
- `delete_flag`: Indicates if the file is marked for deletion.
- `created_at`: Timestamp for when the file was created.
- `updated_at`: Timestamp for when the file was last updated.

#### Methods:
- `toJSON()`: Converts the entity instance to a plain object, excluding sensitive data.

### 2. File Service

The `FileService` handles the business logic for file related operations, including file uploads, chunked uploads, file deletion, and generating publish/download links.

#### Methods:
- `getHello()`: Retrieves all files from the database (used for testing).
- `postFile(req, brand_id, auth_user_id)`: Handles file uploads to IPFS and saves file metadata to the database.
- `postChunkFile(req, brand_id, auth_user_id, res)`: Handles chunked file uploads, reassembles the chunks, and uploads the file to IPFS.
- `uploadFile2IPFS(args)`: Uploads a file to IPFS and saves the metadata to the database.
- `deleteFile(brand_id, auth_user_id, cid)`: Marks a file for deletion in the database.
- `getPublishLink(cid, filename)`: Generates a publish link for a file.

### 3. File Controller

The `FileController` exposes endpoints for file related operations.

#### Endpoints:
- `GET /files`: Retrieves all files (used for testing).
- `POST /files/file_add_update`: Handles file uploads.
- `POST /files/file_chunk_add`: Handles chunked file uploads.
- `DELETE /files/file_delete`: Marks a file for deletion.
- `GET /files/publish-link/:cid`: Generates a publish link for a file.
- `GET /files/download/:cid`: Generates a download link for a file.

#### Imports:
- `TypeOrmModule.forFeature([File, Brand])`: Registers the File and Brand entities with TypeORM.
- `MulterModule.register()`: Configures Multer for handling file uploads.
- `JwtModule.register()`: Configures JWT for authentication.

### 4. File DTOs

The DTOs define the structure of the data required for file related operations and the `types.ts` file defines the response structures.

#### DTOs:
- `UploadFileDto`: Contains `auth_user_id`.
- `DeleteFileDto`: Contains `auth_user_id` and `cid`.

#### Interfaces:
- `PostFileResponse`: Extends `CoreApiResponse` and includes the uploaded file details.
- `DeleteFileResponse`: Extends `CoreApiResponse` and includes a success message.
- `ClusterFile`: Represents a file in the IPFS cluster, including name, CID, size, and allocations.

### 6. Helper Functions

#### `streamToBuffer.ts`
- `streamToBuffer(stream)`: Converts a readable stream to a buffer.

#### `parseClusterStringResponse.ts`
- `parseClusterStringResponse(ipfsData)`: Parses a string response from the IPFS cluster into an array of `ClusterFile` objects.

### 7. Integration

The file module integrates with the following modules:
- `AuthModule`: Ensures that only authenticated users can perform file-related operations.
- `BrandModule`: Associates files with specific brands.
- `MulterModule`: Handles file uploads.

### 8. Usage Example

#### Uploading a File:
```typescript
const uploadFileDto = {
  auth_user_id: 1,
};

const response = await this.fileService.postFile(req, 1, uploadFileDto.auth_user_id);
```

#### Uploading a Chunked File:
```typescript
const uploadFileDto = {
  auth_user_id: 1,
};

const response = await this.fileService.postChunkFile(req, 1, uploadFileDto.auth_user_id, res);
```

#### Deleting a File:
```typescript
const deleteFileDto = {
  auth_user_id: 1,
  cid: 'QmExampleCID',
};

const response = await this.fileService.deleteFile(1, deleteFileDto.auth_user_id, deleteFileDto.cid);
```

#### Generating a Publiish Link:
```typescript
const publishLink = await this.fileService.getPublishLink('QmExampleCID', 'example.txt');
```

#### Generating a Download Link:
```typescript
const downloadLink = await this.fileService.getPublishLink('QmExampleCID', 'example.txt');
```

### 9. File Storage API v2

#### 1. Upload File
#### `POST /files/file_add_update`
#### Description:
Uploads a file to IPFS and associates it with a brand and user.
#### Request Parameters:
- **Query Parameters:**
  - `auth_user_id` (number, required): The ID of the authenticated user.
- **Headers:**
  - `Authorization`: Bearer token for authentication.
- **Request Body:**
  - Multipart file upload.
#### Response:
- **Success (200):**
  ```json
  {
    "success": "Y",
    "status": 200,
    "data": [
      {
        "cid": "<IPFS CID>",
        "filename": "<Filename>"
      }
    ]
  }
  ```
- **Error (500):**
  ```json
  { "message": "File not uploaded." }
  ```

---

#### 2. Upload File in Chunks
#### `POST /files/file_chunk_add`
#### Description:
Uploads a large file in chunks and stores it in a temporary directory before sending it to IPFS.
#### Request Parameters:
- **Query Parameters:**
  - `auth_user_id` (number, required): The ID of the authenticated user.
- **Headers:**
  - `Authorization`: Bearer token for authentication.
- **Request Body:**
  - Multipart file chunks.
#### Response:
- **Success (200):**
  ```json
  {
    "success": "Y",
    "status": 200,
    "data": {
      "cid": "<IPFS CID>",
      "filename": "<Filename>"
    }
  }
  ```
- **Error (400, 413, 410, 500):**
  ```json
  { "message": "Error message based on failure." }
  ```

---

#### 3. Delete File
#### `DELETE /files/file_delete`
#### Description:
Marks a file as deleted in the database.
#### Request Parameters:
- **Query Parameters:**
  - `auth_user_id` (number, required): The ID of the authenticated user.
  - `cid` (string, required): The IPFS CID of the file to delete.
- **Headers:**
  - `Authorization`: Bearer token for authentication.
#### Response:
- **Success (200):**
  ```json
  {
    "success": "Y",
    "status": 200,
    "data": "File has been deleted successfully"
  }
  ```
- **Error (404, 500):**
  ```json
  { "message": "File not found or could not be deleted." }
  ```

---

#### 4. Get Public File Link
#### `GET /files/publish-link/:cid`
#### Description:
Retrieves a public IPFS URL for a file.
#### Request Parameters:
- **Path Parameters:**
  - `cid` (string, required): The IPFS CID of the file.
- **Query Parameters:**
  - `filename` (string, optional): Suggested filename for download.
#### Response:
- **Redirects to IPFS URL:**
  ```text
  http://localhost:8080/ipfs/<CID>?filename=<Filename>
  ```

---

#### 5. Download File
#### `GET /files/download/:cid`
#### Description:
Provides a direct download link for a file stored in IPFS.
#### Request Parameters:
- **Path Parameters:**
  - `cid` (string, required): The IPFS CID of the file.
- **Query Parameters:**
  - `filename` (string, optional): Suggested filename for download.
#### Response:
- **Redirects to IPFS download URL:**
  ```text
  http://localhost:8080/ipfs/<CID>?filename=<Filename>&download=true
  ```

---

#### 6. Get All Stored Files
#### `GET /files`
#### Description:
Retrieves all stored files in the database.
#### Response:
- **Success (200):**
  ```json
  [
    {
      "id": 1,
      "brand_id": 123,
      "cid": "<IPFS CID>",
      "filename": "<Filename>",
      "file_size": 1024,
      "file_type": "image/png",
      "delete_flag": false
    }
  ]
  ```



