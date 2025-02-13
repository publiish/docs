---
sidebar_position: 2
---

# File Storage API v2

## 1. Upload File
### `POST /files/file_add_update`
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

## 2. Upload File in Chunks
### `POST /files/file_chunk_add`
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

## 3. Delete File
### `DELETE /files/file_delete`
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

## 4. Get Public File Link
### `GET /files/publish-link/:cid`
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

## 5. Download File
### `GET /files/download/:cid`
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

## 6. Get All Stored Files
### `GET /files`
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

