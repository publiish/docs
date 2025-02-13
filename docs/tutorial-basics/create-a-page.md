---
sidebar_position: 1
---

# File Storage API v1

## 1. Upload File
**Endpoint:** `POST /file_add_update`

**Description:** Uploads a file to the IPFS cluster and stores its metadata in the database.

**Request Parameters (Query):**
- `brand_id` (number, required): The brand identifier.
- `auth_user_id` (number, required): The authenticated user identifier.

**Headers:**
- `Content-Type: multipart/form-data`

**Request Body:**
- A file uploaded as `multipart/form-data`.

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "data": [
    {
      "cid": "<file_cid>",
      "filename": "<file_name>"
    }
  ]
}
```

**Errors:**
- `403 FORBIDDEN`: If `brand_id` does not match the logged-in user.
- `500 INTERNAL SERVER ERROR`: If the file upload fails.

---

## 2. Delete File
**Endpoint:** `DELETE /file_delete`

**Description:** Marks a file as deleted in the database.

**Request Parameters (Query):**
- `brand_id` (number, required)
- `auth_user_id` (number, required)
- `cid` (string, required): The content identifier of the file in IPFS.

**Response:**
```json
{
  "success": "Y",
  "status": 200,
  "status_code": 200,
  "data": "File has been deleted successfully"
}
```

**Errors:**
- `404 NOT FOUND`: If the file does not exist.
- `500 INTERNAL SERVER ERROR`: If deletion fails.

---

## 3. Get File Publish Link
**Endpoint:** `GET /publish-link/:cid`

**Description:** Generates a link to access the file on the IPFS network.

**Request Parameters:**
- `cid` (string, required): The content identifier of the file.
- `filename` (string, optional): The name of the file.

**Response:**
```json
{
  "status": true,
  "link": "{IPFS_URL}/ipfs/<cid>?filename=<filename>"
}
```

---

## 4. Download File
**Endpoint:** `GET /download/:cid`

**Description:** Provides a direct download link for the file from the IPFS network.

**Request Parameters:**
- `cid` (string, required)
- `filename` (string, optional)

**Response:**
Redirects to `{IPFS_URL}/ipfs/<cid>?filename=<filename>&download=true`
